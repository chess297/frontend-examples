import { api } from "@/services";
import type {
  MenuResponse,
  CreateMenuRequest,
  UpdateMenuDto,
  PaginationData,
} from "@/services/api/api";

export interface MenuSearchParams {
  title?: string;
  path?: string;
  icon?: string;
  component?: string;
  parent_id?: string;
}

/**
 * 获取列表数据
 */
export async function getList(params?: {
  page?: number;
  limit?: number;
  group_id?: string;
  parent_id?: object;
}) {
  const response = await api.findManyMenu(params);
  return response.data.data as PaginationData & { records: MenuResponse[] };
}

/**
 * 获取详情
 */
export async function getById(id: string) {
  const response = await api.findOneMenu(id);
  return response.data.data;
}

/**
 * 创建
 */
export async function create(data: CreateMenuRequest) {
  const response = await api.createMenu(data);
  return response.data.data;
}

/**
 * 更新
 */
export async function update(id: string, data: UpdateMenuDto) {
  const response = await api.updateMenu(id, data);
  return response.data.data;
}

/**
 * 删除
 */
export async function remove(id: string) {
  const response = await api.removeMenu(id);
  return response;
}

/**
 * 本地筛选数据
 */
export function filterData(
  items: MenuResponse[],
  searchParams: MenuSearchParams
): MenuResponse[] {
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
        case "path":
          return item.path.toLowerCase().includes(value.toLowerCase());
        case "icon":
          return item.icon.toLowerCase().includes(value.toLowerCase());
        case "component":
          return item.component.toLowerCase().includes(value.toLowerCase());
        case "parent_id":
          // 如果菜单有父ID，则进行匹配；否则，只有当搜索父ID为空或特定值时匹配
          if (item.parent_id) {
            return item.parent_id.toString() === value;
          }
          return value === "null" || value === "root";
        default:
          return true;
      }
    });
  });
}
