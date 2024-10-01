import { api } from "./api";
const matchId = "60b8f2d87e4a8a12345678b5";

export const getBatters = async () => {
  // const response = await api.post("/login", { email, password });
  return [
    { name: "Select", value: "" },
    { name: "Sanjeev", value: "1" },
    { name: "Omkar", value: "2" },
  ];
};
export const getBowlers = async () => {
  return [
    { name: "Select", value: "" },
    { name: "One", value: "1" },
    { name: "Two", value: "2" },
    { name: "Three", value: "3" },
  ];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const sendBallData = async (data: any) => {
  const response = await api.post("/ball-by-ball-commentary", data);
  return response;
};

export const getMatch = async () => {
  const response = await api.get(`/match/${matchId}`);
  return response?.data;
};

export const getCommentary = async () => {
  const response = await api.get(`/ball-by-ball-commentary/match/${matchId}`);
  return response?.data;
};
