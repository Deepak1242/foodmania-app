import { useState, useEffect } from 'react';
import adminAPI from '../../api/adminAPI';
import { 
  FaSearch, 
  FaUserShield, 
  FaUser, 
  FaTrash, 
  FaSpinner,
  FaChevronLeft,
  FaChevronRight,
  FaCalendar,
  FaShoppingBag
} from 'react-icons/fa';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({});

  useEffect(() => {
    loadUsers();
  }, [currentPage, searchTerm]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: 10,
        search: searchTerm
      };
      const response = await adminAPI.getAllUsers(currentPage, 10, searchTerm);
      console.log('Users response:', response);
      setUsers(response.data?.data?.users || []);
      setPagination(response.data?.data?.pagination || {});
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleUpdate = async (userId, newRole) => {
    if (!window.confirm(`Are you sure you want to change this user's role to ${newRole}?`)) return;
    
    try {
      await adminAPI.updateUserRole(userId, newRole);
      await loadUsers();
    } catch (error) {
      console.error('Error updating user role:', error);
      alert('Error updating user role. Please try again.');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    
    try {
      await adminAPI.deleteUser(userId);
      await loadUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Error deleting user. Please try again.');
    }
  };

  const getRoleColor = (role) => {
    return role === 'ADMIN' 
      ? 'bg-purple-500/20 text-purple-300' 
      : 'bg-blue-500/20 text-blue-300';
  };

  const getRoleIcon = (role) => {
    return role === 'ADMIN' ? <FaUserShield /> : <FaUser />;
  };

  if (loading && users.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <FaSpinner className="animate-spin text-4xl text-yellow-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-white">User Management</h2>
        <div className="text-gray-300">
          Total Users: {pagination.total || 0}
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400"
        />
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <div key={user.id} className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:from-white/15 hover:to-white/10 transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-amber-400 rounded-full flex items-center justify-center text-black font-bold text-lg">
                  {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    {user.firstName} {user.lastName}
                  </h3>
                  <p className="text-gray-400 text-sm">{user.email}</p>
                </div>
              </div>
              
              <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                {getRoleIcon(user.role)}
                {user.role}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-gray-300 text-sm">
                <FaCalendar className="text-gray-400" />
                Joined: {new Date(user.createdAt).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-2 text-gray-300 text-sm">
                <FaShoppingBag className="text-gray-400" />
                Orders: {user._count.orders}
              </div>
            </div>

            <div className="flex gap-2">
              {user.role === 'USER' ? (
                <button
                  onClick={() => handleRoleUpdate(user.id, 'ADMIN')}
                  className="flex-1 flex items-center justify-center gap-2 bg-purple-500/20 text-purple-300 py-2 rounded-lg hover:bg-purple-500/30 transition-all text-sm"
                >
                  <FaUserShield /> Make Admin
                </button>
              ) : (
                <button
                  onClick={() => handleRoleUpdate(user.id, 'USER')}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-500/20 text-blue-300 py-2 rounded-lg hover:bg-blue-500/30 transition-all text-sm"
                >
                  <FaUser /> Make User
                </button>
              )}
              
              <button
                onClick={() => handleDeleteUser(user.id)}
                className="flex items-center justify-center gap-2 bg-red-500/20 text-red-300 py-2 px-4 rounded-lg hover:bg-red-500/30 transition-all text-sm"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      {users.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No users found</p>
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaChevronLeft /> Previous
          </button>
          
          <span className="px-4 py-2 text-white">
            Page {currentPage} of {pagination.pages}
          </span>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.pages))}
            disabled={currentPage === pagination.pages}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next <FaChevronRight />
          </button>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
