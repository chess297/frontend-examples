import { type ReactNode, useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, Calendar as CalendarIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";

// 字段类型
export type FieldType =
  | "text"
  | "select"
  | "date"
  | "dateRange"
  | "number"
  | "cascader"
  | "custom";

// 选择项
export interface OptionType {
  label: string;
  value: string | number | boolean;
  children?: OptionType[]; // 用于级联选择器
  disabled?: boolean;
}

// 字段布局配置
export interface FieldLayoutConfig {
  colSpan?: number; // 列宽（默认为1）
  order?: number; // 排序顺序
  className?: string; // 自定义类名
}

// 依赖项配置（用于级联选择器）
export interface DependencyConfig {
  field: string; // 依赖的字段名
  loadOptions?: (value: any) => Promise<OptionType[]>; // 动态加载选项
  mapping?: Record<string | number, OptionType[]>; // 静态映射选项
}

// 日期范围字段配置
export interface DateRangeConfig {
  startName: string; // 开始日期字段名
  endName: string; // 结束日期字段名
}

// 字段定义
export interface FieldDefinition {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: OptionType[];
  defaultValue?: any;
  isAdvanced?: boolean;
  layout?: FieldLayoutConfig;
  dependency?: DependencyConfig;
  dateRangeConfig?: DateRangeConfig;
  render?: (field: any, formValues: any) => ReactNode;
}

// 存储键名
const STORAGE_KEY_PREFIX = "search_form_values_";

// 搜索表单属性
export interface SearchFormProps<T extends Record<string, any>> {
  fields: FieldDefinition[];
  onSearch: (values: T) => void;
  defaultExpanded?: boolean;
  initialValues?: Partial<T>;
  className?: string;
  storageKey?: string; // 用于本地存储表单值的键名
  layout?: "default" | "compact" | "flexible"; // 布局模式
  rowSize?: number; // 每行显示的字段数（默认为不限制）
}

export function SearchForm<T extends Record<string, any>>({
  fields,
  onSearch,
  defaultExpanded = false,
  initialValues = {},
  className = "",
  storageKey,
  layout = "default",
  rowSize,
}: SearchFormProps<T>) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [cascaderOptions, setCascaderOptions] = useState<
    Record<string, OptionType[]>
  >({});

  const storageKeyFull = storageKey
    ? `${STORAGE_KEY_PREFIX}${storageKey}`
    : undefined;

  // 动态构建zod验证模式
  const generateSearchFormSchema = () => {
    const schemaObject: any = {};

    fields.forEach((field) => {
      // 根据字段类型设置不同的验证规则
      switch (field.type) {
        case "number":
          schemaObject[field.name] = z.number().optional();
          break;
        case "date":
          schemaObject[field.name] = z.date().nullable().optional();
          break;
        case "dateRange":
          if (field.dateRangeConfig) {
            schemaObject[field.dateRangeConfig.startName] = z
              .date()
              .nullable()
              .optional();
            schemaObject[field.dateRangeConfig.endName] = z
              .date()
              .nullable()
              .optional();
          }
          break;
        case "cascader":
          schemaObject[field.name] = z.array(z.string()).optional();
          break;
        default:
          schemaObject[field.name] = z.string().optional();
      }
    });

    return z.object(schemaObject);
  };

  const searchFormSchema = generateSearchFormSchema();

  // 尝试从本地存储恢复表单值
  const getStoredValues = (): Partial<T> => {
    if (!storageKeyFull) return {};

    try {
      const stored = localStorage.getItem(storageKeyFull);
      if (stored) {
        const values = JSON.parse(stored);

        // 将日期字符串转换回Date对象
        fields.forEach((field) => {
          if (field.type === "date" && values[field.name]) {
            values[field.name] = new Date(values[field.name]);
          } else if (field.type === "dateRange" && field.dateRangeConfig) {
            const { startName, endName } = field.dateRangeConfig;
            if (values[startName])
              values[startName] = new Date(values[startName]);
            if (values[endName]) values[endName] = new Date(values[endName]);
          }
        });

        return values;
      }
    } catch (error) {
      console.error("Error restoring form values from storage:", error);
    }

    return {};
  };

  // 构建默认值
  const buildDefaultValues = () => {
    // 优先从本地存储中恢复值
    const storedValues = getStoredValues();
    const defaultValues: Record<string, any> = {};

    fields.forEach((field) => {
      if (field.type === "dateRange" && field.dateRangeConfig) {
        const { startName, endName } = field.dateRangeConfig;
        defaultValues[startName] =
          storedValues[startName as keyof T] ??
          initialValues[startName as keyof T] ??
          field.defaultValue?.[0] ??
          null;

        defaultValues[endName] =
          storedValues[endName as keyof T] ??
          initialValues[endName as keyof T] ??
          field.defaultValue?.[1] ??
          null;
      } else {
        const fieldName = field.name as keyof T;
        defaultValues[field.name] =
          storedValues[fieldName] ??
          initialValues[fieldName] ??
          field.defaultValue ??
          (field.type === "cascader" ? [] : "");
      }
    });

    return defaultValues;
  };

  const form = useForm<z.infer<typeof searchFormSchema>>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: buildDefaultValues(),
  });

  // 获取所有表单值（用于级联选择器的依赖）
  const formValues = form.watch();

  // 提交查询并存储表单值
  const handleSubmit = (values: z.infer<typeof searchFormSchema>) => {
    // 过滤掉空值
    const filteredParams: Record<string, any> = {};
    for (const [key, value] of Object.entries(values)) {
      if (
        value !== undefined &&
        value !== null &&
        value !== "" &&
        !(Array.isArray(value) && value.length === 0)
      ) {
        filteredParams[key] = value;
      }
    }

    // 存储到本地存储
    if (storageKeyFull) {
      try {
        localStorage.setItem(storageKeyFull, JSON.stringify(values));
      } catch (error) {
        console.error("Error saving form values to storage:", error);
      }
    }

    onSearch(filteredParams as T);
  };

  // 重置表单
  const handleReset = () => {
    // 清除本地存储
    if (storageKeyFull) {
      try {
        localStorage.removeItem(storageKeyFull);
      } catch (error) {
        console.error("Error removing form values from storage:", error);
      }
    }

    const emptyValues = {};
    fields.forEach((field) => {
      if (field.type === "dateRange" && field.dateRangeConfig) {
        (emptyValues as any)[field.dateRangeConfig.startName] = null;
        (emptyValues as any)[field.dateRangeConfig.endName] = null;
      } else {
        (emptyValues as any)[field.name] = field.type === "cascader" ? [] : "";
      }
    });

    form.reset(emptyValues);
    onSearch({} as T);
  };

  // 切换展开/收起
  const toggleExpand = () => {
    setExpanded((prev) => !prev);
  };

  // 处理级联选择器的依赖关系
  useEffect(() => {
    const loadDependentOptions = async () => {
      for (const field of fields) {
        if (field.dependency && field.type === "select") {
          const { dependency } = field;
          const dependencyValue = formValues[dependency.field];

          if (!dependencyValue) {
            // 如果依赖值为空，清空选项
            form.setValue(field.name, "");
            continue;
          }

          // 处理动态加载选项
          if (dependency.loadOptions) {
            try {
              const options = await dependency.loadOptions(dependencyValue);
              setCascaderOptions((prev) => ({
                ...prev,
                [field.name]: options,
              }));
            } catch (error) {
              console.error(`Error loading options for ${field.name}:`, error);
            }
          }
          // 处理静态映射选项
          else if (dependency.mapping) {
            const options = dependency.mapping[dependencyValue] || [];
            setCascaderOptions((prev) => ({
              ...prev,
              [field.name]: options,
            }));
          }
        }
      }
    };

    loadDependentOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fields, formValues]);

  // 检查是否有高级字段
  const hasAdvancedFields = fields.some((field) => field.isAdvanced);

  // 对字段进行排序
  const sortedFields = [...fields].sort((a, b) => {
    const orderA = a.layout?.order ?? 0;
    const orderB = b.layout?.order ?? 0;
    return orderA - orderB;
  });

  // 渲染表单字段
  const renderField = (field: FieldDefinition) => {
    // 如果是高级字段但未展开，则不渲染
    if (field.isAdvanced && !expanded) {
      return null;
    }

    // 计算列宽
    const colSpan = field.layout?.colSpan ?? 1;
    const fieldClassName = cn(
      "flex-1 min-w-[200px]",
      {
        "md:w-full": colSpan === 3,
        "md:w-1/2": colSpan === 2,
        "md:w-1/3": colSpan === 1 && layout === "flexible",
      },
      field.layout?.className
    );

    if (field.type === "dateRange" && field.dateRangeConfig) {
      // 渲染日期范围选择器
      const { startName, endName } = field.dateRangeConfig;

      return (
        <div key={`${startName}-${endName}`} className={fieldClassName}>
          <FormLabel>{field.label}</FormLabel>
          <div className="flex gap-2 items-center mt-2">
            <FormField
              control={form.control}
              name={startName}
              render={({ field: startField }) => (
                <FormItem className="flex-1">
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !startField.value && "text-muted-foreground"
                          )}
                        >
                          {startField.value ? (
                            format(startField.value, "yyyy-MM-dd", {
                              locale: zhCN,
                            })
                          ) : (
                            <span>开始日期</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={startField.value}
                        onSelect={startField.onChange}
                        disabled={(date) =>
                          (formValues[endName] &&
                            date > new Date(formValues[endName])) ||
                          date > new Date()
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <span className="text-muted-foreground">至</span>

            <FormField
              control={form.control}
              name={endName}
              render={({ field: endField }) => (
                <FormItem className="flex-1">
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !endField.value && "text-muted-foreground"
                          )}
                        >
                          {endField.value ? (
                            format(endField.value, "yyyy-MM-dd", {
                              locale: zhCN,
                            })
                          ) : (
                            <span>结束日期</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                      <Calendar
                        mode="single"
                        selected={endField.value}
                        onSelect={endField.onChange}
                        disabled={(date) =>
                          (formValues[startName] &&
                            date < new Date(formValues[startName])) ||
                          date > new Date()
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      );
    }

    return (
      <FormField
        key={field.name}
        control={form.control}
        name={field.name}
        render={({ field: formField }) => {
          // 自定义渲染
          if (field.type === "custom" && field.render) {
            return (
              <FormItem className={fieldClassName}>
                <FormLabel>{field.label}</FormLabel>
                <FormControl>{field.render(formField, formValues)}</FormControl>
              </FormItem>
            );
          }

          // 根据字段类型渲染不同的输入控件
          switch (field.type) {
            case "select":
              return (
                <FormItem className={fieldClassName}>
                  <FormLabel>{field.label}</FormLabel>
                  <Select
                    onValueChange={formField.onChange}
                    value={formField.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            field.placeholder || `请选择${field.label}`
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {/* 优先使用级联选项，如果有的话 */}
                      {(cascaderOptions[field.name] || field.options || []).map(
                        (option) => (
                          <SelectItem
                            key={option.value.toString()}
                            value={option.value.toString()}
                            disabled={option.disabled}
                          >
                            {option.label}
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                </FormItem>
              );
            case "cascader":
              return (
                <FormItem className={fieldClassName}>
                  <FormLabel>{field.label}</FormLabel>
                  <div className="flex gap-2">
                    {field.options?.map((level1, index) => (
                      <Select
                        key={`${field.name}-level-${index}`}
                        onValueChange={(value) => {
                          const newValues = [...(formField.value || [])];
                          newValues[index] = value;
                          // 选择上级后，清空下级
                          if (index < newValues.length - 1) {
                            newValues.length = index + 1;
                          }
                          formField.onChange(newValues);
                        }}
                        value={(formField.value || [])[index] || ""}
                      >
                        <FormControl>
                          <SelectTrigger className="flex-1">
                            <SelectValue
                              placeholder={`请选择${
                                index === 0 ? field.label : ""
                              }`}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {(index === 0
                            ? level1
                            : // 获取当前级别的选项
                              (() => {
                                let options = field.options || [];
                                for (let i = 0; i < index; i++) {
                                  const selectedValue = (formField.value || [])[
                                    i
                                  ];
                                  const selectedOption = options.find(
                                    (opt) =>
                                      opt.value.toString() === selectedValue
                                  );
                                  options = selectedOption?.children || [];
                                }
                                return options;
                              })()
                          ).map((option) => (
                            <SelectItem
                              key={option.value.toString()}
                              value={option.value.toString()}
                              disabled={option.disabled}
                            >
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ))}
                  </div>
                </FormItem>
              );
            case "date":
              return (
                <FormItem className={fieldClassName}>
                  <FormLabel>{field.label}</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !formField.value && "text-muted-foreground"
                          )}
                        >
                          {formField.value ? (
                            format(formField.value, "yyyy-MM-dd", {
                              locale: zhCN,
                            })
                          ) : (
                            <span>
                              {field.placeholder || `选择${field.label}`}
                            </span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formField.value}
                        onSelect={formField.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              );
            case "number":
              return (
                <FormItem className={fieldClassName}>
                  <FormLabel>{field.label}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={field.placeholder}
                      type="number"
                      {...formField}
                      onChange={(e) => {
                        const value = e.target.value
                          ? Number(e.target.value)
                          : "";
                        formField.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            default:
              return (
                <FormItem className={fieldClassName}>
                  <FormLabel>{field.label}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={field.placeholder || `搜索${field.label}`}
                      {...formField}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
          }
        }}
      />
    );
  };

  // 根据布局模式决定栅格类名
  let gridClassName = "flex flex-wrap gap-4";
  if (layout === "compact") {
    gridClassName =
      "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4";
  } else if (layout === "flexible" && rowSize) {
    gridClassName = `grid grid-cols-1 ${
      rowSize === 2
        ? "sm:grid-cols-2"
        : rowSize === 3
        ? "sm:grid-cols-2 md:grid-cols-3"
        : rowSize === 4
        ? "sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        : "sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
    } gap-4`;
  }

  return (
    <Card className={`mb-4 ${className}`}>
      <CardContent className="pt-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <div className={gridClassName}>{sortedFields.map(renderField)}</div>

            <div className="flex items-center justify-between">
              {hasAdvancedFields && (
                <Button type="button" variant="ghost" onClick={toggleExpand}>
                  {expanded ? "收起" : "更多筛选"}
                </Button>
              )}
              {!hasAdvancedFields && <div />}

              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={handleReset}>
                  <X className="mr-2 h-4 w-4" />
                  重置
                </Button>
                <Button type="submit">
                  <Search className="mr-2 h-4 w-4" />
                  查询
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
