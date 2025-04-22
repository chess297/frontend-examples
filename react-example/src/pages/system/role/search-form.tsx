import { z } from "zod";
import {
  ConfigSearchForm,
  type FieldDefinition,
} from "@/components/system-config/search-config/config-search-form";
import type { RoleSearchParams } from "./api";

// 搜索表单验证模式
const searchSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  status: z.string().optional(),
});

// 搜索表单属性类型
interface RoleSearchFormProps {
  onSearch: (params: RoleSearchParams) => void;
}

// 角色搜索表单组件
export function RoleSearchForm({ onSearch }: RoleSearchFormProps) {
  // 状态选项
  const statusOptions = [
    { label: "选择状态", value: "" },
    { label: "启用", value: "1" },
    { label: "禁用", value: "0" },
  ];

  // 定义搜索字段
  const searchFields: FieldDefinition[] = [
    {
      name: "name",
      label: "角色名称",
      type: "text",
      placeholder: "请输入角色名称",
    },
    {
      name: "description",
      label: "角色描述",
      type: "text",
      placeholder: "请输入角色描述",
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
    <ConfigSearchForm<RoleSearchParams>
      fields={searchFields}
      validationSchema={searchSchema}
      defaultValues={{}}
      onSearch={onSearch}
    />
  );
}
