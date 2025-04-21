import {
  SearchForm as GenericSearchForm,
  FieldDefinition,
  DateRangeConfig,
} from "@/components/search-form";

// 权限查询参数的定义
export interface PermissionSearchParams {
  name?: string;
  resource?: string;
  description?: string;
  type?: string;
  createTimeStart?: Date;
  createTimeEnd?: Date;
}

type SearchFormProps = {
  onSearch: (params: PermissionSearchParams) => void;
};

export function SearchForm({ onSearch }: SearchFormProps) {
  // 定义权限类型选项
  const typeOptions = [
    { label: "全部", value: "all" }, // 修改空字符串为"all"
    { label: "菜单", value: "menu" },
    { label: "操作", value: "action" },
    { label: "数据", value: "data" },
  ];

  // 定义日期范围配置
  const createTimeRangeConfig: DateRangeConfig = {
    startName: "createTimeStart",
    endName: "createTimeEnd",
  };

  // 定义搜索字段
  const fields: FieldDefinition[] = [
    {
      name: "name",
      label: "权限名称",
      type: "text",
      placeholder: "搜索权限名称",
      layout: { order: 1 },
    },
    {
      name: "resource",
      label: "资源名称",
      type: "text",
      placeholder: "搜索资源名称",
      layout: { order: 2 },
    },
    {
      name: "type",
      label: "权限类型",
      type: "select",
      options: typeOptions,
      placeholder: "请选择权限类型",
      layout: { order: 3 },
    },
    {
      name: "description",
      label: "权限描述",
      type: "text",
      placeholder: "搜索权限描述",
      isAdvanced: true,
      layout: { order: 4 },
    },
    {
      name: "createTimeRange",
      label: "创建时间",
      type: "dateRange",
      dateRangeConfig: createTimeRangeConfig,
      isAdvanced: true,
      layout: { order: 5, colSpan: 2 },
    },
  ];

  return (
    <GenericSearchForm<PermissionSearchParams>
      fields={fields}
      onSearch={onSearch}
      storageKey="permission-manager" // 记住搜索条件
      layout="flexible" // 使用灵活布局
      rowSize={3} // 每行最多3个字段
    />
  );
}
