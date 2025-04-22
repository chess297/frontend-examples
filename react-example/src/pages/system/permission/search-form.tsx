import { z } from "zod";
import {
  ConfigSearchForm,
  type FieldDefinition,
} from "@/components/system-config/search-config/config-search-form";
import type { PermissionSearchParams } from "./api";
import { PermissionAction } from "@/services/api/api";

// 搜索表单验证模式
const searchSchema = z.object({
  name: z.string().optional(),
  resource: z.string().optional(),
  action: z.string().optional(),
});

// 搜索表单属性类型
interface PermissionSearchFormProps {
  onSearch: (params: PermissionSearchParams) => void;
}

// 权限搜索表单组件
export function PermissionSearchForm({ onSearch }: PermissionSearchFormProps) {
  // 转换 PermissionAction 枚举为选项
  const actionOptions = [
    { label: "选择操作类型", value: "" },
    ...Object.keys(PermissionAction).map((key) => ({
      label: key,
      value: PermissionAction[key as keyof typeof PermissionAction],
    })),
  ];

  // 定义搜索字段
  const searchFields: FieldDefinition[] = [
    {
      name: "name",
      label: "权限名称",
      type: "text",
      placeholder: "请输入权限名称",
    },
    {
      name: "resource",
      label: "资源标识",
      type: "text",
      placeholder: "请输入资源标识",
    },
    {
      name: "action",
      label: "操作类型",
      type: "select",
      options: actionOptions,
      placeholder: "请选择操作类型",
      isAdvanced: true,
    },
  ];

  return (
    <ConfigSearchForm<PermissionSearchParams>
      fields={searchFields}
      validationSchema={searchSchema}
      defaultValues={{}}
      onSearch={onSearch}
    />
  );
}
