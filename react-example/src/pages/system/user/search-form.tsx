import { z } from "zod";
import {
  ConfigSearchForm,
  type FieldDefinition,
} from "@/components/system-config/search-config/config-search-form";
import type { UserSearchParams } from "./api";

// 搜索表单验证模式
const searchSchema = z.object({
  username: z.string().optional(),
  email: z.string().optional(),
  status: z.string().optional(),
});

// 搜索表单属性类型
interface UserSearchFormProps {
  onSearch: (params: UserSearchParams) => void;
}

// 用户搜索表单组件
export function UserSearchForm({ onSearch }: UserSearchFormProps) {
  // 状态选项
  const statusOptions = [
    { label: "选择状态", value: "" },
    { label: "启用", value: "1" },
    { label: "禁用", value: "0" },
  ];

  // 定义搜索字段
  const searchFields: FieldDefinition[] = [
    {
      name: "username",
      label: "用户名",
      type: "text",
      placeholder: "请输入用户名",
    },
    {
      name: "email",
      label: "电子邮箱",
      type: "text",
      placeholder: "请输入邮箱地址",
    },
    {
      name: "status",
      label: "状态",
      type: "select",
      options: statusOptions,
      placeholder: "请选择状态",
      isAdvanced: true,
    },
  ];

  return (
    <ConfigSearchForm<UserSearchParams>
      fields={searchFields}
      validationSchema={searchSchema}
      defaultValues={{}}
      onSearch={onSearch}
    />
  );
}
