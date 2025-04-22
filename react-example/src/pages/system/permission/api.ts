import { api } from "@/services";
import type {
  PermissionEntity,
  CreatePermissionDto,
  UpdatePermissionDto,
  PaginationData,
  PermissionAction,
} from "@/services/api/api";

export interface PermissionSearchParams {
  name?: string;
  resource?: string;
  action?: PermissionAction;
}

/**
 * 获取列表数据
 */
export async function getList(params?: {
  page?: number;
  limit?: number;
  name?: string;
  resource?: string;
  description?: string;
}) {
  const response = await api.findManyPermission(params);
  return response.data.data as PaginationData & { records: PermissionEntity[] };
}

/**
 * 获取详情
 */
export async function getById(id: string) {
  const response = await api.findOnePermission(id);
  return response.data.data;
}

/**
 * 创建
 */
export async function create(data: CreatePermissionDto) {
  const response = await api.createPermission(data);
  return response.data.data;
}

/**
 * 更新
 */
export async function update(id: string, data: UpdatePermissionDto) {
  const response = await api.updatePermission(id, data);
  return response.data.data;
}

/**
 * 删除
 */
export async function remove(id: string) {
  const response = await api.removePermission(id);
  return response;
}

/**
 * 本地筛选数据
 */
export function filterData(
  items: PermissionEntity[],
  searchParams: PermissionSearchParams
): PermissionEntity[] {
  if (Object.keys(searchParams).length === 0) {
    return items;
  }

  return items.filter((item) => {
    return Object.entries(searchParams).every(([key, value]) => {
      if (!value) return true; // 忽略空值

      // 根据不同字段进行模糊匹配
      switch (key) {
        case "name":
          return item.name
            .toLowerCase()
            .includes(value.toString().toLowerCase());
        case "resource":
          return item.resource
            .toLowerCase()
            .includes(value.toString().toLowerCase());
        case "action":
          return item.actions?.includes(value as PermissionAction);
        default:
          return true;
      }
    });
  });
}
