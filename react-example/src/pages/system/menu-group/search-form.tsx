import { z } from "zod";
import {
  ConfigSearchForm,
  type FieldDefinition,
} from "@/components/system-config/search-config/config-search-form";
import type { MenuGroupSearchParams } from "./api";

// 搜索表单验证模式
const searchSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  icon: z.string().optional(),
});

// 搜索表单属性类型
interface MenuGroupSearchFormProps {
  onSearch: (params: MenuGroupSearchParams) => void;
}

// 菜单分组搜索表单组件
export function MenuGroupSearchForm({ onSearch }: MenuGroupSearchFormProps) {
  // 定义搜索字段
  const searchFields: FieldDefinition[] = [
    {
      name: "title",
      label: "分组名称",
      type: "text",
      placeholder: "请输入分组名称",
    },
    {
      name: "description",
      label: "分组描述",
      type: "text",
      placeholder: "请输入描述关键字",
    },
    {
      name: "icon",
      label: "图标",
      type: "text",
      placeholder: "请输入图标名称",
      isAdvanced: true,
    },
  ];

  return (
    <ConfigSearchForm<MenuGroupSearchParams>
      fields={searchFields}
      validationSchema={searchSchema}
      defaultValues={{}}
      onSearch={onSearch}
    />
  );
}
