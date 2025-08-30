import { useState, useEffect } from 'react';
import adminAPI from '../../api/adminAPI';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaSearch, 
  FaSave, 
  FaTimes,
  FaSpinner,
  FaImage
} from 'react-icons/fa';

const DishManagement = () => {
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingDish, setEditingDish] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    category: ''
  });

  useEffect(() => {
    loadDishes();
  }, []);

  const loadDishes = async () => {
    try {
      const response = await adminAPI.getAllDishes(1, 100, searchTerm, '');
      console.log('Dishes response:', response);
      setDishes(response.data?.data?.dishes || []);
    } catch (error) {
      console.error('Error loading dishes:', error);
      setDishes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dishData = {
        ...formData,
        price: parseFloat(formData.price)
      };

      const response = editingDish 
        ? await adminAPI.updateDish(editingDish.id, dishData)
        : await adminAPI.createDish(dishData);

      if (response.success || response.data) {
        await loadDishes();
        resetForm();
        alert(`Dish ${editingDish ? 'updated' : 'created'} successfully!`);
      }
    } catch (error) {
      console.error('Error saving dish:', error);
      alert(error.response?.data?.message || error.message || 'Error saving dish. Please try again.');
    }
  };

  const handleDelete = async (dishId) => {
    if (!window.confirm('Are you sure you want to delete this dish?')) return;
    
    try {
      await adminAPI.deleteDish(dishId);
      await loadDishes();
    } catch (error) {
      console.error('Error deleting dish:', error);
      alert('Error deleting dish. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', description: '', price: '', image: '', category: '' });
    setEditingDish(null);
    setShowModal(false);
  };

  const openEditModal = (dish) => {
    setFormData({
      name: dish.name,
      description: dish.description,
      price: dish.price.toString(),
      image: dish.image || '',
      category: dish.category || ''
    });
    setEditingDish(dish);
    setShowModal(true);
  };

  const filteredDishes = dishes.filter(dish =>
    dish.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dish.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
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
        <h2 className="text-2xl font-bold text-white">Dish Management</h2>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-xl hover:from-green-600 hover:to-green-700 transition-all"
        >
          <FaPlus /> Add New Dish
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search dishes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400"
        />
      </div>

      {/* Dishes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDishes.map((dish) => (
          <div key={dish.id} className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 hover:from-white/15 hover:to-white/10 transition-all">
            <div className="aspect-video bg-gray-700 rounded-xl mb-4 overflow-hidden">
              {dish.image ? (
                <img src={dish.image} alt={dish.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <FaImage className="text-gray-500 text-2xl" />
                </div>
              )}
            </div>
            
            <h3 className="text-lg font-bold text-white mb-2">{dish.name}</h3>
            <p className="text-gray-300 text-sm mb-3 line-clamp-2">{dish.description}</p>
            
            <div className="flex items-center justify-between mb-4">
              <span className="text-xl font-bold text-yellow-400">${dish.price.toFixed(2)}</span>
              {dish.category && (
                <span className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded-lg text-xs">
                  {dish.category}
                </span>
              )}
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => openEditModal(dish)}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-500/20 text-blue-300 py-2 rounded-lg hover:bg-blue-500/30 transition-all"
              >
                <FaEdit /> Edit
              </button>
              <button
                onClick={() => handleDelete(dish.id)}
                className="flex-1 flex items-center justify-center gap-2 bg-red-500/20 text-red-300 py-2 rounded-lg hover:bg-red-500/30 transition-all"
              >
                <FaTrash /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredDishes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No dishes found</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-white/10 rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">
                {editingDish ? 'Edit Dish' : 'Add New Dish'}
              </h3>
              <button
                onClick={resetForm}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-white text-sm font-medium mb-2">Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400"
                  placeholder="Enter dish name"
                />
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">Description *</label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 resize-none"
                  placeholder="Enter dish description"
                />
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">Price *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">Image URL</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <label className="block text-white text-sm font-medium mb-2">Category</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400"
                  placeholder="e.g., Main Course, Appetizer, Dessert"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all"
                >
                  <FaSave /> {editingDish ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DishManagement;
