import {
  SearchForm as GenericSearchForm,
  FieldDefinition,
  DateRangeConfig,
} from "@/components/search-form";

// 角色查询参数的定义
export interface RoleSearchParams {
  name?: string;
  description?: string;
  code?: string;
  status?: string;
  createTimeStart?: Date;
  createTimeEnd?: Date;
}

type SearchFormProps = {
  onSearch: (params: RoleSearchParams) => void;
};

export function SearchForm({ onSearch }: SearchFormProps) {
  // 定义状态选项
  const statusOptions = [
    { label: "全部", value: "all" }, // 修改空字符串为"all"
    { label: "启用", value: "active" },
    { label: "禁用", value: "inactive" },
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
      label: "角色名称",
      type: "text",
      placeholder: "搜索角色名称",
      layout: { order: 1 },
    },
    {
      name: "code",
      label: "角色编码",
      type: "text",
      placeholder: "搜索角色编码",
      layout: { order: 2 },
    },
    {
      name: "status",
      label: "状态",
      type: "select",
      options: statusOptions,
      placeholder: "请选择状态",
      layout: { order: 3 },
    },
    {
      name: "description",
      label: "角色描述",
      type: "text",
      placeholder: "搜索角色描述",
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
    <GenericSearchForm<RoleSearchParams>
      fields={fields}
      onSearch={onSearch}
      storageKey="role-manager" // 记住搜索条件
      layout="compact" // 使用紧凑布局
    />
  );
}
