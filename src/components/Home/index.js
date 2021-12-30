import React, { useState, useEffect } from "react";

import withAuth from "../../wrappers/withAuth";
import useStorage from "../../hooks/useStorage";
import io from "socket.io-client";

const ChatWindow = ({ me, user, socket, onclose = () => {} }) => {
  const [chatmessages, setChatMessages] = useStorage("EX_USER_CHATS", []);
  const [currentText, setCurrentText] = useState("");
  const [currentMessages, setCurrentMessages] = useState([]);

  const getChatMessages = (user) => {
    const messages = chatmessages.find((u) => u.name === user);
    if (messages) {
      setCurrentMessages(messages.messages);
    }
  };

  const save = () => {
    const idx = chatmessages.findIndex((u) => u.name === user.name);
    if (idx !== -1) {
      const copy = [...chatmessages];
      copy.splice(idx, 1, { name: user.name, messages: currentMessages });
      setChatMessages(copy);
    }
  };

  useEffect(() => {
    if (chatmessages && Array.isArray(chatmessages) && chatmessages.length) {
      getChatMessages(user.name);
    }
  }, [chatmessages, user]);

  useEffect(() => {
    socket.on("message", (data) => {
      setCurrentMessages((prev) => [...prev, { ...data }]);
    });
    return () => {
      save();
    };
  }, []);

  const handleSendMessage = () => {
    if (!currentText.length) return;
    const message = {
      name: me,
      to: user.id,
      body: currentText,
      created_at: new Date().toLocaleString(),
    };
    socket.emit("message", message);
    setCurrentText("");
  };

  return (
    <div className="bg-gray-100 p-4 rounded-md mt-16 max-w-screen-md">
      <div className="flex justify-between content-center">
        <h1>{user.name}</h1>
        <div onClick={onclose}>
          <span className="text-3xl cursor-pointer" title="close">
            &times;
          </span>
        </div>
      </div>
      <div className="bg-white border-2 border-gray-100 border-solid h-100 overflow-hidden overflow-y-auto">
        <ul className="flex flex-col p-4">
          {currentMessages.length ? (
            currentMessages.map((messageBlock) => {
              const isMe = messageBlock.name === user.name;
              return (
                <div
                  className={`px-2 py-r-8 mb-4 rounded-md inline-block ${
                    !isMe
                      ? "bg-gray-100 self-start"
                      : "bg-blue-500 text-white self-end"
                  }`}
                >
                  {messageBlock.body}
                </div>
              );
            })
          ) : (
            <li className="self-center text-muted pt-16">
              start chating with {user.name}...
            </li>
          )}
        </ul>
      </div>
      <div className="flex content-center mt-8">
        <div className="flex-1 border-b-2 border-b-black border-b-solid">
          <input
            className="w-full bg-transparent outline-none"
            value={currentText}
            onChange={(e) => setCurrentText(e.target.value)}
            placeholder="type message..."
          />
        </div>
        <div>
          <button
            className="bg-blue-500 px-8 rounded-md text-white"
            type="button"
            onClick={handleSendMessage}
          >
            send
          </button>
        </div>
      </div>
    </div>
  );
};

const User = ({ me, user, active, onclick }) => {
  return (
    <div
      onClick={() => !active && onclick(user)}
      className={`cursor-pointer flex px-2 content-center hover:bg-blue-500 hover:text-white justify-between py-2 ${
        active ? "bg-teal-100 text-white" : ""
      }`}
    >
      <span>
        {user.name}
        {me === user.name ? "(you)" : null}
      </span>
      <span
        title="online"
        className="self-center inline-block bg-green-500 rounded-full h-4 w-4"
      />
    </div>
  );
};

const Home = withAuth(({ auth }) => {
  const [users, setUsers] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [socket, setSocket] = useState(null);

  const openChat = (user) => {
    setCurrentChat(user);
  };

  useEffect(() => {
    const newSocket = io("http://localhost:8080", {
      query: {
        token: auth.user.token,
      },
    });
    setSocket(newSocket);
    return () => newSocket.close();
  }, [setSocket, auth]);

  useEffect(() => {
    if (socket) {
      return () => {
        socket.close();
      };
    }
  }, [socket]);

  useEffect(() => {
    if (socket && auth.user.name) {
      console.log("emitting join...");
      socket.emit("join", { name: auth.user.name });
      socket.on("users", (data) => {
        console.log("users new in the collection ", data);
        setUsers(data);
      });
    }
  }, [socket, auth]);

  return (
    <div>
      <section className="flex min-h-screen">
        <aside className="bg-gray-100 py-8 flex-[0.2_1_0%]">
          {auth.loading ? (
            <p>loading...</p>
          ) : (
            <>
              {users.length ? (
                <>
                  <div>
                    <h1>Online</h1>
                  </div>
                  <div>
                    {users.map((user) => {
                      return (
                        <User
                          me={auth.user.name}
                          active={currentChat?.name === user.name}
                          user={user}
                          key={user.name}
                          onclick={openChat}
                        />
                      );
                    })}
                  </div>
                </>
              ) : (
                <div>no active users yet...</div>
              )}
            </>
          )}
        </aside>
        <main className="flex-1 flex-[0.8_1_0%] p-8">
          {auth.loading ? (
            <p>loading...</p>
          ) : (
            <>
              <div>
                <h1 className="text-3xl">Hello, {auth.user.name}!</h1>
              </div>
              <div>
                {currentChat ? (
                  <ChatWindow
                    me={auth.user.name}
                    user={currentChat}
                    socket={socket}
                    onclose={() => setCurrentChat(null)}
                  />
                ) : (
                  <p>Click on a user to start chatting...</p>
                )}
              </div>
            </>
          )}
        </main>
      </section>
    </div>
  );
});

export default Home;
