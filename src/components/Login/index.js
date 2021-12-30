import React, { useState } from "react";

import withAuth from "../../wrappers/withAuth";

const Login = withAuth(({ auth }) => {
  const [formData, setFormData] = useState({});
  const [messages, setMessages] = useState([]);

  console.log(auth);

  const handleUpdateForm = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validate = () => {
    const msgs = [];
    if (formData.username?.length < 3) {
      msgs.push("username should be at least 3 characters long");
    }
    if (formData.password?.length < 5) {
      msgs.push("password must be at least 5 characters long!");
    }
    if (msgs.length) {
      return [false, msgs];
    }
    return [true, null];
  };

  const handleSubmit = async (e) => {
    console.log("csasds");
    if (auth.loading) return;
    e.preventDefault();
    console.log("check 1");
    const [isvalid, errors] = validate();
    if (!isvalid && errors && errors.length) {
      setMessages(errors);
      return;
    }
    const { username, password } = formData;
    console.log("check 2");
    auth.login({ username, password }, () => {
      console.log("logged in success!");
      window.location.href = "/home";
    });
  };

  return (
    <div className="absolute top-2/4 left-2/4">
      {auth.loading === true ? (
        <p>loading...</p>
      ) : (
        <section className="relative bg-gray-100 p-4 -translate-x-1/2 -translate-y-1/2 rounded-md">
          {messages?.length ? (
            <div className="absolute left-2/4 top-0 -translate-y-full">
              {messages.map((message) => {
                return (
                  <div
                    className="relative -translate-x-1/2 mb-4 p-4 bg-gray-100 border-4 border-solid border-red-100 rounded-md"
                    key={message}
                  >
                    {message}
                  </div>
                );
              })}
            </div>
          ) : null}
          <div>
            <h1 className="text-2xl">Welcome to the login page</h1>
          </div>
          <div>
            <form onSubmit={handleSubmit}>
              <div className="my-4">
                <input
                  name="username"
                  value={formData.username || ""}
                  onChange={handleUpdateForm}
                  className="outline-none w-full rounded-md"
                  placeholder={"username"}
                />
              </div>
              <div>
                <input
                  name="password"
                  value={formData.password || ""}
                  onChange={handleUpdateForm}
                  className="outline-none w-full rounded-md"
                  type={"password"}
                  placeholder={"password"}
                />
              </div>
              <div>
                <input
                  className="bg-blue-500 px-8 py-2 block w-full mt-8 text-white rounded-md"
                  type={"submit"}
                  value={`${auth.loading ? "loading..." : "login"}`}
                />
              </div>
            </form>
          </div>
        </section>
      )}
    </div>
  );
});

export default Login;
