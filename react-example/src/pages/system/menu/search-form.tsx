import { z } from "zod";
import {
  ConfigSearchForm,
  type FieldDefinition,
} from "@/components/system-config/search-config/config-search-form";
import type { MenuSearchParams } from "./api";

// 搜索表单验证模式
const searchSchema = z.object({
  title: z.string().optional(),
  path: z.string().optional(),
  icon: z.string().optional(),
  component: z.string().optional(),
  parentId: z.string().optional(),
  type: z.string().optional(),
  hidden: z.string().optional(),
});

// 搜索表单属性类型
interface MenuSearchFormProps {
  onSearch: (params: MenuSearchParams) => void;
}

// 菜单搜索表单组件
export function MenuSearchForm({ onSearch }: MenuSearchFormProps) {
  // 菜单类型选项
  const menuTypeOptions = [
    { label: "选择类型", value: "" },
    { label: "目录", value: "directory" },
    { label: "菜单", value: "menu" },
    { label: "按钮", value: "button" },
  ];

  // 显示状态选项
  const hiddenOptions = [
    { label: "选择状态", value: "" },
    { label: "显示", value: "false" },
    { label: "隐藏", value: "true" },
  ];

  // 定义搜索字段
  const searchFields: FieldDefinition[] = [
    {
      name: "title",
      label: "菜单名称",
      type: "text",
      placeholder: "请输入菜单名称",
    },
    {
      name: "path",
      label: "菜单路径",
      type: "text",
      placeholder: "请输入菜单路径",
    },
    {
      name: "type",
      label: "菜单类型",
      type: "select",
      options: menuTypeOptions,
      placeholder: "请选择菜单类型",
      isAdvanced: true,
    },
    {
      name: "hidden",
      label: "显示状态",
      type: "select",
      options: hiddenOptions,
      placeholder: "请选择显示状态",
      isAdvanced: true,
    },
    {
      name: "icon",
      label: "图标",
      type: "text",
      placeholder: "请输入图标名称",
      isAdvanced: true,
    },
    {
      name: "component",
      label: "组件路径",
      type: "text",
      placeholder: "请输入组件路径",
      isAdvanced: true,
    },
  ];

  return (
    <ConfigSearchForm<MenuSearchParams>
      fields={searchFields}
      validationSchema={searchSchema}
      defaultValues={{}}
      onSearch={onSearch}
    />
  );
}
