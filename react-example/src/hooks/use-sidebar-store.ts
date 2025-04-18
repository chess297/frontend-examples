import { api } from "@/services";
import type { MenuGroupEntity } from "@/services/api/api";
import { create } from "zustand";

type SidebarState = {
  adminMenuGround: MenuGroupEntity | null;
};

type SidebarAction = {
  fetchAdminMenuGround: () => Promise<void>;
};

export const useSidebarStore = create<SidebarState & SidebarAction>((set) => ({
  adminMenuGround: null,
  async fetchAdminMenuGround() {
    const res = await api.findMenuGroupById(
      "3a49c084-12e4-4a11-bd87-372d2ea36a36"
    );
    if (res.status === 200) {
      set({ adminMenuGround: res.data.data });
    }
    return;
  },
}));
