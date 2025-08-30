import { FaSpinner } from 'react-icons/fa';

const LoadingSpinner = ({ size = 'medium', message = 'Loading...', fullScreen = false }) => {
  const sizeClasses = {
    small: 'text-lg',
    medium: 'text-2xl',
    large: 'text-4xl'
  };

  const containerClasses = fullScreen 
    ? 'fixed inset-0 bg-primary1/80 backdrop-blur-sm flex items-center justify-center z-50'
    : 'flex items-center justify-center p-8';

  return (
    <div className={containerClasses}>
      <div className="text-center">
        <FaSpinner className={`animate-spin text-amber-400 mx-auto mb-4 ${sizeClasses[size]}`} />
        <p className="text-secondary2 font-fancy">{message}</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
