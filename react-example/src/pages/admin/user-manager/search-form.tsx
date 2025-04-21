import {
  SearchForm as GenericSearchForm,
  FieldDefinition,
  DateRangeConfig,
} from "@/components/search-form";

// 用户查询参数定义
export interface UserSearchParams {
  username?: string;
  email?: string;
  nickname?: string;
  status?: string;
  createTimeStart?: Date;
  createTimeEnd?: Date;
}

type SearchFormProps = {
  onSearch: (params: UserSearchParams) => void;
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
      name: "username",
      label: "用户名",
      type: "text",
      placeholder: "搜索用户名",
      layout: { order: 1 },
    },
    {
      name: "email",
      label: "邮箱",
      type: "text",
      placeholder: "搜索邮箱",
      layout: { order: 2 },
    },
    {
      name: "nickname",
      label: "昵称",
      type: "text",
      placeholder: "搜索昵称",
      layout: { order: 4 },
      isAdvanced: true,
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
      name: "createTimeRange",
      label: "创建时间",
      type: "dateRange",
      dateRangeConfig: createTimeRangeConfig,
      isAdvanced: true,
      layout: { order: 5, colSpan: 2 },
    },
  ];

  return (
    <GenericSearchForm<UserSearchParams>
      fields={fields}
      onSearch={onSearch}
      storageKey="user-manager" // 记住搜索条件
      layout="flexible" // 使用灵活布局
      rowSize={3} // 每行最多3个字段
    />
  );
}
