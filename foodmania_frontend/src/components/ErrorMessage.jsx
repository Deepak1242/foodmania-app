import { FaExclamationTriangle, FaTimes } from 'react-icons/fa';

const ErrorMessage = ({ 
  message, 
  onClose, 
  type = 'error', 
  showIcon = true,
  className = '' 
}) => {
  const typeStyles = {
    error: 'bg-red-500/20 border-red-500 text-red-300',
    warning: 'bg-yellow-500/20 border-yellow-500 text-yellow-300',
    info: 'bg-blue-500/20 border-blue-500 text-blue-300'
  };

  return (
    <div className={`p-4 border rounded-lg flex items-center gap-3 ${typeStyles[type]} ${className}`}>
      {showIcon && <FaExclamationTriangle className="flex-shrink-0" />}
      <p className="flex-1 font-fancy">{message}</p>
      {onClose && (
        <button 
          onClick={onClose}
          className="flex-shrink-0 hover:opacity-70 transition-opacity"
        >
          <FaTimes />
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
