import { createClient } from "../http";

class UserService {
  constructor() {
    this.client = createClient();
    this.login = this.login.bind(this);
  }

  async login(username, password) {
    console.log("logging in...");
    const { client } = this;
    return client
      .post("/users", { username, password })
      .then((res) => res.data)
      .then((data) => data);
  }
}

export default new UserService();
