import ChatBot from './components/ChatBot';
import ThemeToggle from './components/ThemeToggle';
import './index.css';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-purple-100 to-teal-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center relative p-4">
      <ChatBot />
    </div>
  );
}

export default App; 
