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
      .then(async (res) => {
        if (res.stateInstance === "authorized") {
          const settings = {
            webhookUrl: "",
            incomingWebhook: "yes",
          };
          const settingsRes = await fetch(
            `https://api.green-api.com/waInstance${idInstance.current.value}/setSettings/${apiTokenInstance.current.value}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(settings),
            }
          );

          return settingsRes.json();
        } else throw new Error("Unauthorized!");
      })
      .then((res) => {
        if (res.saveSettings) {
          localStorage.setItem(
            "user",
            JSON.stringify({
              idInstance: idInstance.current.value,
              apiTokenInstance: apiTokenInstance.current.value,
            })
          );
          navigate("/home");
        } else throw new Error("Unable to save settings!");
      })
      .catch((err) => console.log(err.message || err));
  };

  return (
    <div className="w-fit m-auto bg-white p-16 py-12 rounded-sm">
      <h2 className="text-4xl mb-8">Sign In</h2>
      <div className="flex flex-col gap-5">
        <label>
          <p className="text-left pb-2 text-lg pl-1">idInstance</p>
          <input type="text" ref={idInstance} className="text-input w-72" />
        </label>
        <label>
          <p className="text-left pb-2 text-lg pl-1">apiTokenInstance</p>
          <input type="text" ref={apiTokenInstance} className="text-input w-72" />
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
