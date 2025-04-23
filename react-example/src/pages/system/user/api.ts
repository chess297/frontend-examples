import { api } from "@/services";
import type {
  UserEntity,
  PaginationData,
  CreateUserRequest,
  UpdateTaskRequest,
} from "@/services/api/api";

export interface UserSearchParams {
  username?: string;
  email?: string;
  status?: string;
}

/**
 * 获取列表数据
 */
export async function getList(params?: {
  page?: number;
  limit?: number;
  username?: string;
  email?: string;
}) {
  const response = await api.queryUsers(params);
  return response.data.data as PaginationData & { records: UserEntity[] };
}

/**
 * 获取详情
 */
export async function getById(id: string) {
  const response = await api.getUser(id);
  return response.data.data;
}

/**
 * 创建
 */
export async function create(data: CreateUserRequest) {
  const response = await api.createUser(data);
  return response.data.data;
}

/**
 * 更新
 */
export async function update(id: string, data: UpdateTaskRequest) {
  const response = await api.taskControllerUpdateV1(id, data);
  return response.data.data;
}

/**
 * 删除
 */
export async function remove(id: string) {
  const response = await api.removeUser(id);
  return response;
}

/**
 * 重置用户密码
 */
export async function resetPassword(id: string, password: string) {
  // 注意：API 中没有明确的重置密码方法，这里是模拟方法
  // 实际实现应该根据后端 API 调整
  const response = await api.taskControllerUpdateV1(id, { password });
  return response.data;
}

/**
 * 本地筛选数据
 */
export function filterData(
  items: UserEntity[],
  searchParams: UserSearchParams
): UserEntity[] {
  if (Object.keys(searchParams).length === 0) {
    return items;
  }

  return items.filter((item) => {
    return Object.entries(searchParams).every(([key, value]) => {
      if (!value) return true; // 忽略空值

      // 根据不同字段进行模糊匹配
      switch (key) {
        case "username":
          return item.username.toLowerCase().includes(value.toLowerCase());
        case "email":
          return item.email.toLowerCase().includes(value.toLowerCase());
        case "status":
          return item.is_active?.toString() === value; // 使用正确的字段 is_active
        default:
          return true;
      }
    });
  });
}
