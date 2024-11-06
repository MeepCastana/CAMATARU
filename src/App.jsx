import "./App.css";

function App() {
  return (
    <div className="wip-container flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6">
      <h1 className="text-4xl md:text-5xl font-bold text-blue-600 mb-4 animate-pulse">
        🚧 Work in Progress 🚧
      </h1>
      <p className="text-lg md:text-xl text-gray-700 text-center max-w-lg mb-8">
        We're building something awesome! Please check back soon for updates.
      </p>
      <div className="loader border-t-4 border-blue-600 border-solid rounded-full w-16 h-16 animate-spin"></div>
    </div>
  );
}

export default App;
