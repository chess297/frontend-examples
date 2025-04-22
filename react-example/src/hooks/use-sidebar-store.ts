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
    try {
      // 1. 先获取菜单分组字典
      const dictionaryRes = await api.findDistByCode("MENU_GROUPS");

      if (dictionaryRes.status !== 200) {
        console.error("获取菜单分组字典失败:", dictionaryRes);
        return;
      }

      // 2. 从字典中获取管理员菜单分组的ID
      const menuGroupItems = dictionaryRes.data?.data?.items || [];
      const adminMenuGroupItem = menuGroupItems.find(
        (item) => item.dictionary_id === "admin" || item.label === "系统管理"
      );

      if (!adminMenuGroupItem || !adminMenuGroupItem.value) {
        console.error("未找到管理员菜单分组字典项");
        return;
      }

      const adminMenuGroupId = adminMenuGroupItem.value;

      // 3. 使用获取到的ID查询菜单分组
      const res = await api.findMenuGroupById(adminMenuGroupId);

      if (res.status === 200) {
        set({ adminMenuGround: res.data.data });
      }
    } catch (error) {
      console.error("获取菜单分组失败:", error);
    }
    return;
  },
}));
