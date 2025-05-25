import { create } from "zustand";
import AuthClient from "@/apiClients/authClient";
import type { IUserResponse } from "@/apiClients/authClient/dto";

interface IAuthStore {
  state: "init" | "signed-in" | "signed-out";
  user: IUserResponse | null;
  isAuthenticated: () => Promise<boolean>;
  setUser: (user: IUserResponse) => void;
  removeUser: () => void;
}

const authClient = new AuthClient();

const useAuthStore = create<IAuthStore>((set, get) => ({
  state: "init",
  user: null,
  isAuthenticated: async () => {
    let user = get().user;
    if (!user && get().state === "init") {
      user = await authClient.validate();
      set({ user, state: user ? "signed-in" : "signed-out" });
    }

    return user !== null;
  },
  setUser: (user) => {
    set({ user, state: "signed-in" });
  },
  removeUser: async () => {
    await authClient.signOut();

    set({ user: null, state: "signed-out" });
  },
}));

export default useAuthStore;

export { type IAuthStore };
