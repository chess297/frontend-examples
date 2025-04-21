import {
  SearchForm as GenericSearchForm,
  FieldDefinition,
  OptionType,
} from "@/components/search-form";

// 查询参数的定义
export interface MenuSearchParams {
  title?: string;
  path?: string;
  icon?: string;
  component?: string;
  parentId?: string;
  type?: string;
  hidden?: string;
}

type SearchFormProps = {
  onSearch: (params: MenuSearchParams) => void;
};

export function SearchForm({ onSearch }: SearchFormProps) {
  // 菜单类型选项
  const typeOptions: OptionType[] = [
    { label: "全部", value: "all" }, // 修改空字符串为"all"
    { label: "目录", value: "dir" },
    { label: "菜单", value: "menu" },
    { label: "按钮", value: "button" },
  ];

  // 是否隐藏选项
  const hiddenOptions: OptionType[] = [
    { label: "全部", value: "all" }, // 修改空字符串为"all"
    { label: "显示", value: "false" },
    { label: "隐藏", value: "true" },
  ];

  // 顶级菜单选项（示例数据，实际应从API获取）
  const parentMenuOptions: OptionType[] = [
    { label: "全部", value: "all" }, // 修改空字符串为"all"
    { label: "系统管理", value: "1" },
    { label: "用户中心", value: "2" },
    { label: "数据分析", value: "3" },
  ];

  // 级联选择器示例数据
  const menuLevelOptions: OptionType[] = [
    {
      label: "系统管理",
      value: "system",
      children: [
        { label: "用户管理", value: "user-manager" },
        { label: "角色管理", value: "role-manager" },
        { label: "权限管理", value: "permission-manager" },
      ],
    },
    {
      label: "内容管理",
      value: "content",
      children: [
        { label: "文章管理", value: "article-manager" },
        { label: "分类管理", value: "category-manager" },
      ],
    },
  ];

  // 定义搜索字段
  const fields: FieldDefinition[] = [
    {
      name: "title",
      label: "菜单名称",
      type: "text",
      placeholder: "搜索菜单名称",
      layout: { order: 1 },
    },
    {
      name: "path",
      label: "菜单路径",
      type: "text",
      placeholder: "搜索路径",
      layout: { order: 2 },
    },
    {
      name: "type",
      label: "菜单类型",
      type: "select",
      options: typeOptions,
      placeholder: "请选择菜单类型",
      layout: { order: 3 },
    },
    {
      name: "parentId",
      label: "上级菜单",
      type: "select",
      options: parentMenuOptions,
      placeholder: "请选择上级菜单",
      isAdvanced: true,
      layout: { order: 4 },
    },
    {
      name: "menuLevel",
      label: "菜单层级",
      type: "cascader",
      options: menuLevelOptions,
      isAdvanced: true,
      layout: { order: 5 },
    },
    {
      name: "hidden",
      label: "显示状态",
      type: "select",
      options: hiddenOptions,
      placeholder: "请选择显示状态",
      isAdvanced: true,
      layout: { order: 6 },
    },
    {
      name: "icon",
      label: "图标",
      type: "text",
      placeholder: "搜索图标",
      isAdvanced: true,
      layout: { order: 7 },
    },
    {
      name: "component",
      label: "组件路径",
      type: "text",
      placeholder: "搜索组件路径",
      isAdvanced: true,
      layout: { order: 8, colSpan: 2 },
    },
  ];

  return (
    <GenericSearchForm<MenuSearchParams>
      fields={fields}
      onSearch={onSearch}
      storageKey="menu-manager" // 记住搜索条件
      layout="flexible" // 使用灵活布局
      rowSize={3} // 每行最多3个字段
      defaultExpanded={false} // 默认收起高级搜索
    />
  );
}
