interface IAPIUser {
  id: string;
  role: "GUEST" | "ORGANISER" | "ADMIN";
  username: string;
  email: string;
}

export { type IAPIUser };
