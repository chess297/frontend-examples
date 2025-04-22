import { api } from "@/services";
import type {
  CreateRoleRequest,
  PaginationData,
  RoleResponse,
  UpdateRoleRequest,
} from "@/services/api/api";

export interface RoleSearchParams {
  name?: string;
  description?: string;
}

/**
 * 获取列表数据
 */
export async function getList(params?: {
  page?: number;
  limit?: number;
  name?: string;
  description?: string;
}) {
  const response = await api.roleControllerFindAllV1(params);
  return response.data.data as PaginationData & { records: RoleResponse[] };
}

/**
 * 获取详情
 */
export async function getById(id: string) {
  const response = await api.roleControllerFindOneV1(id);
  return response.data.data;
}

/**
 * 创建
 */
export async function create(data: CreateRoleRequest) {
  const response = await api.roleControllerCreateV1(data);
  return response.data.data;
}

/**
 * 更新
 */
export async function update(id: string, data: UpdateRoleRequest) {
  const response = await api.roleControllerUpdateV1(id, data);
  return response.data.data;
}

/**
 * 删除
 */
export async function remove(id: string) {
  const response = await api.roleControllerRemoveV1(id);
  return response;
}

/**
 * 本地筛选数据
 */
export function filterData(
  items: RoleResponse[],
  searchParams: RoleSearchParams
): RoleResponse[] {
  if (Object.keys(searchParams).length === 0) {
    return items;
  }

  return items.filter((item) => {
    return Object.entries(searchParams).every(([key, value]) => {
      if (!value) return true; // 忽略空值

      // 根据不同字段进行模糊匹配
      switch (key) {
        case "name":
          return item.name.toLowerCase().includes(value.toLowerCase());
        case "description":
          return item.description?.toLowerCase().includes(value.toLowerCase());
        default:
          return true;
      }
    });
  });
}
