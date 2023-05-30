import { Route, Routes, Navigate } from "react-router-dom";
import SignIn from "./components/SignIn";
import Home from "./components/Home";

const App = () => {
  const user = localStorage.getItem("user");

  return (
    <div>
      <div className="absolute w-full h-52 bg-teal-600 inset-0 z-0" />
      <main className="relative bg-white p-16 py-12 z-10 rounded-sm">
        <Routes>
          <Route path="/" element={<Navigate to={user ? "/home" : "/signin"} />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
