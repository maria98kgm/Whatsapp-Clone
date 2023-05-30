import React, { useEffect, useState } from "react";

const Home = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedPhoneNum, setSelectedPhoneNum] = useState("");
  const [chat, setChat] = useState([]);

  // useEffect(() => {
  //   console.log(localStorage.getItem("user"));
  //   setUser(JSON.parse(localStorage.getItem("user")));

  //   return () => {
  //     localStorage.setItem("user", JSON.stringify(user));
  //   };
  // }, []);

  const handleInputChange = (event) => {
    setPhoneNumber(event.target.value.replace(/[^0-9]/g, ""));
  };

  const handlePhoneSubmit = (event) => {
    if (event.key === "Enter") {
      setSelectedPhoneNum(phoneNumber);
      getChat();
    }
  };

  const getChat = () => {
    if (user[phoneNumber]) {
      const chatInfo = {
        chatId: `${phoneNumber}@c.us`,
        count: user[phoneNumber],
      };

      fetch(
        `https://api.green-api.com/waInstance${user.idInstance}/getChatHistory/${user.apiTokenInstance}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(chatInfo),
        }
      )
        .then((res) => res.json())
        .then((res) => {
          setChat(res.reverse());
        });
    } else {
      const newUserData = { ...user, [phoneNumber]: 0 };
      localStorage.setItem("user", JSON.stringify(newUserData));
    }
  };

  const handleMessageSubmit = (event) => {
    if (event.key === "Enter") {
      if (event.target.value) {
        const message = {
          chatId: `${selectedPhoneNum}@c.us`,
          message: event.target.value,
        };

        fetch(
          `https://api.green-api.com/waInstance${user.idInstance}/sendMessage/${user.apiTokenInstance}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(message),
          }
        )
          .then((res) => res.json())
          .then((res) => {
            if (res.idMessage) {
              res.textMessage = event.target.value;
              res.type = "outgoing";

              setUser((prev) => {
                const newUserData = { ...prev, [selectedPhoneNum]: prev[selectedPhoneNum] + 1 };
                localStorage.setItem("user", JSON.stringify(newUserData));
                return newUserData;
              });
              setChat((prev) => [...prev, res]);
            } else throw new Error("Unable to send message!");
          })
          .catch((err) => console.log(err.message || err));
      }
    }
  };

  return (
    <div className="w-full h-full bg-white p-6 rounded-sm flex">
      <div className="border-r pr-4 w-96">
        <input
          type="text"
          value={phoneNumber}
          onChange={handleInputChange}
          onKeyDown={handlePhoneSubmit}
          className="text-input w-full"
          placeholder="Enter phone number..."
        />
        {/* <div>
          <p>Contact 1</p>
          <p>Contact 1</p>
          <p>Contact 1</p>
          <p>Contact 1</p>
          <p>Contact 1</p>
        </div> */}
      </div>
      <div className="px-8 w-full flex flex-col justify-between gap-4">
        <p>{selectedPhoneNum || "No phone number selected"}</p>
        <div className="h-full max-h-500 flex flex-col px-4 overflow-auto gap-4">
          {chat.length ? (
            chat.map((message) => (
              <p
                key={message.idMessage}
                className={message.type === "outgoing" ? "outgoing-message" : "incoming-message"}
              >
                {message.textMessage}
              </p>
            ))
          ) : (
            <p className="italic mt-4">No messages</p>
          )}
        </div>
        <div className="flex gap-4">
          <input
            type="text"
            onKeyDown={handleMessageSubmit}
            className="text-input w-full"
            placeholder="Enter text message..."
          />
          {/* <button className="bg-whatsapp-main text-white px-4 py-2 w-fit rounded-sm">Send</button> */}
        </div>
      </div>
    </div>
  );
};

export default Home;
