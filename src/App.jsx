import { Route, Routes, Navigate } from "react-router-dom";
import SignIn from "./components/SignIn";
import Home from "./components/Home";

const App = () => {
  const user = localStorage.getItem("user");

  return (
    <div className="w-full min-h-full">
      <div className="absolute w-full h-52 bg-teal-600 inset-0 z-0" />
      <main className="relative z-10 h-full flex justify-center">
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
