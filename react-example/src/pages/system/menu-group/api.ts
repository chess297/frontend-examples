import { api } from "@/services";
import type {
  MenuGroupEntity,
  CreateMenuGroupRequest,
  UpdateMenuGroupRequest,
  PaginationData,
} from "@/services/api/api";

export interface MenuGroupSearchParams {
  title?: string;
  description?: string;
  icon?: string;
}

/**
 * 获取菜单分组列表
 */
export async function getList(params?: {
  page?: number;
  limit?: number;
  title?: string;
}) {
  const response = await api.queryMenuGroup(params);
  return response.data.data as PaginationData & { records: MenuGroupEntity[] };
}

/**
 * 获取菜单分组详情
 */
export async function getById(id: string) {
  const response = await api.findMenuGroupById(id);
  return response.data.data;
}

/**
 * 创建菜单分组
 */
export async function create(data: CreateMenuGroupRequest) {
  const response = await api.createMenuGroup(data);
  return response.data.data;
}

/**
 * 更新菜单分组
 */
export async function update(id: string, data: UpdateMenuGroupRequest) {
  const response = await api.updateMenuGroup(id, data);
  return response.data.data;
}

/**
 * 删除菜单分组
 */
export async function remove(id: string) {
  const response = await api.deleteMenuGroup(id);
  return response;
}

/**
 * 本地筛选数据
 */
export function filterData(
  items: MenuGroupEntity[],
  searchParams: MenuGroupSearchParams
): MenuGroupEntity[] {
  if (Object.keys(searchParams).length === 0) {
    return items;
  }

  return items.filter((item) => {
    return Object.entries(searchParams).every(([key, value]) => {
      if (!value) return true; // 忽略空值

      // 根据不同字段进行模糊匹配
      switch (key) {
        case "title":
          return item.title.toLowerCase().includes(value.toLowerCase());
        case "description":
          return item.description.toLowerCase().includes(value.toLowerCase());
        case "icon":
          return item.icon.toLowerCase().includes(value.toLowerCase());
        default:
          return true;
      }
    });
  });
}
