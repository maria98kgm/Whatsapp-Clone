import React, { useEffect, useState, useRef } from "react";

const Home = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [phoneNumber, setPhoneNumber] = useState("");
  const [selectedPhoneNum, setSelectedPhoneNum] = useState("");
  const [chat, setChat] = useState([]);

  useEffect(() => {
    let interval = "";
    if (selectedPhoneNum) {
      clearInterval(interval);
      (async function () {
        const receivedChat = await getChat();
        interval = setInterval(() => checkNotification(receivedChat), 7000);
      })();
    }

    return () => {
      clearInterval(interval);
    };
  }, [selectedPhoneNum]);

  const handleInputChange = (event) => {
    setPhoneNumber(event.target.value.replace(/[^0-9]/g, ""));
  };

  const handlePhoneSubmit = (event) => {
    if (event.key === "Enter") {
      setSelectedPhoneNum(phoneNumber);
    }
  };

  const getChat = () => {
    const date = user[selectedPhoneNum] || Date.now();

    if (!user[selectedPhoneNum]) {
      const newUserData = { ...user, [selectedPhoneNum]: date };
      localStorage.setItem("user", JSON.stringify(newUserData));
      setUser(newUserData);
    }

    const chatInfo = {
      chatId: `${selectedPhoneNum}@c.us`,
    };

    return fetch(
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
        const index = res.findIndex((item) => item.timestamp * 1000 < date);
        const newChat = res.slice(0, index);
        const reversedChat = newChat.reverse();
        setChat(reversedChat);
        return reversedChat;
      })
      .catch((err) => console.log(err));
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

  const checkNotification = (chat) => {
    fetch(
      `https://api.green-api.com/waInstance${user.idInstance}/receiveNotification/${user.apiTokenInstance}`
    )
      .then((res) => res.json())
      .then((res) => {
        if (res && res.receiptId && res.body.senderData.sender === `${selectedPhoneNum}@c.us`) {
          if (res.body.messageData.textMessageData) {
            const newMessage = {
              idMessage: res.body.idMessage,
              type: "incoming-message",
              textMessage: res.body.messageData.textMessageData.textMessage,
            };
            const findMessage = chat.filter((item) => item.idMessage === newMessage.idMessage);

            if (!findMessage.length) {
              setChat((prev) => [...prev, newMessage]);
            }
          }

          fetch(
            `https://api.green-api.com/waInstance${user.idInstance}/deleteNotification/${user.apiTokenInstance}/${res.receiptId}`,
            {
              method: "DELETE",
            }
          ).catch((err) => console.log(err));
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="w-full h-full bg-whatsapp-main p-6 rounded-sm flex">
      <div className="border-r border-gray-700 pr-4 w-96">
        <input
          type="text"
          value={phoneNumber}
          onChange={handleInputChange}
          onKeyDown={handlePhoneSubmit}
          className="text-input w-full bg-whatsapp-light"
          placeholder="Enter phone number..."
        />
      </div>
      <div className="px-8 w-full flex flex-col justify-between gap-4">
        <p className="mb-4 pb-4 border-b border-gray-700 text-left">
          {selectedPhoneNum ? (
            <span className="font-bold">{selectedPhoneNum}</span>
          ) : (
            <span className="italic">No phone number selected</span>
          )}
        </p>
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
            className="text-input w-full bg-whatsapp-light"
            placeholder="Enter text message..."
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
