import { Routes } from "react-router-dom";

const App = () => {
  return (
    <div>
      <div className="absolute w-full h-52 bg-teal-600 inset-0 z-0" />
      <main className="relative bg-white p-16 pt-12 z-10">
        <Routes></Routes>
      </main>
    </div>
  );
};

export default App;
