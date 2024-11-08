import "./App.css";

function App() {
  return (
    <>
      <div className="wip-container flex flex-col items-center justify-center rounded-3xl bg-gradient-to-br from-red-100 to-blue-200 p-6">
        <h1 className="text-4xl md:text-5xl font-bold text-red-600 mb-4 animate-pulse pt-12">
          🚧 Work in Progress 🚧
        </h1>
        <p className="text-lg md:text-xl text-gray-700 text-center max-w-lg ">
          Seems like the page you are looking for is under construction. Please
          check back later 🎉.
        </p>
        <div className="loader border-t-4 border-blue-600 border-solid rounded-full w-16 h-16 animate-spin"></div>
      </div>
    </>
  );
}

export default App;
