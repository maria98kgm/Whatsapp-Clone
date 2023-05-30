import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";

const SignIn = () => {
  const idInstance = useRef(null);
  const apiTokenInstance = useRef(null);
  const navigate = useNavigate();

  const handleSignIn = () => {
    fetch(
      `https://api.green-api.com/waInstance${idInstance.current.value}/getStateInstance/${apiTokenInstance.current.value}`
    )
      .then((res) => res.json())
      .then((res) => {
        if (res.stateInstance === "authorized") {
          localStorage.setItem(
            "user",
            JSON.stringify({
              idInstance: idInstance.current.value,
              apiTokenInstance: apiTokenInstance.current.value,
            })
          );
          navigate("/home");
        } else throw new Error("Unauthorized!");
      })
      .catch((err) => console.log(err.message || err));
  };

  return (
    <div>
      <h2 className="text-4xl mb-8">Sign In</h2>
      <div className="flex flex-col gap-5">
        <label>
          <p className="text-left pb-2 text-lg pl-1">idInstance</p>
          <input type="text" ref={idInstance} className="text-input" />
        </label>
        <label>
          <p className="text-left pb-2 text-lg pl-1">apiTokenInstance</p>
          <input type="text" ref={apiTokenInstance} className="text-input" />
        </label>
        <button
          onClick={handleSignIn}
          className="bg-whatsapp-main text-white px-4 py-2 w-fit m-auto mt-4 rounded-sm"
        >
          Sign In
        </button>
      </div>
    </div>
  );
};

export default SignIn;
