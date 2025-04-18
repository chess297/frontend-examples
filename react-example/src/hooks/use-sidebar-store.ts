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
    const res = await api.queryMenuGroup({
      title: "Admin",
    });
    if (res.status === 200) {
      set({ adminMenuGround: res.data.data.records[0] });
    }
    return;
  },
}));
