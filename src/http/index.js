import axios from "axios";

//NOTE::
//only for the demo
//irl we request proxy server
export const createClient = () => {
  const base = process.env.REACT_APP_SERVER_ID;
  const ports = [process.env.REACT_APP_PORT_1, process.env.REACT_APP_PORT_2];
  const port = ports[Math.round(Math.random() * ports.length)];
  // const baseURL = `${base}:${port}`;
  const baseURL = `${base}:${ports[0]}`;
  return axios.create({ baseURL });
};
