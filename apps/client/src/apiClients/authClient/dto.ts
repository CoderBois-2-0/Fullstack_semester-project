interface IUserResponse {
  id: string;
  role: "GUEST" | "ORGANISER" | "ADMIN";
  username: string;
  email: string;
}

export { type IUserResponse };
