import { create } from "zustand";
import cookies from "js-cookie";
import { devtools } from "zustand/middleware";
const COOKIE_KEY_ACCESS_TOKEN = "react_example_access_token";

type GlobalStoreState = {
  access_token: string;
};

type GlobalStoreActions = {
  login_success(access_token: string): void;
};

export const useGlobalStore = create<GlobalStoreState & GlobalStoreActions>()(
  devtools((set) => ({
    access_token: cookies.get(COOKIE_KEY_ACCESS_TOKEN) ?? "",
    login_success(access_token) {
      set({ access_token });
    },
  }))
);
