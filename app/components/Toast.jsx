export default function Toast({ message, type = 'success', onClose }) {
  if (!message) return null;

  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-fade-in-up">
      <div className={`${bgColor} text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2`}>
        <span>{message}</span>
        <button
          onClick={onClose}
          className="ml-2 text-white hover:text-gray-200 focus:outline-none"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

// Add this to your global CSS or tailwind.config.js
// @keyframes fadeInUp {
//   from {
//     opacity: 0;
//     transform: translateY(1rem);
//   }
//   to {
//     opacity: 1;
//     transform: translateY(0);
//   }
// }
// .animate-fade-in-up {
//   animation: fadeInUp 0.3s ease-out;
// } 