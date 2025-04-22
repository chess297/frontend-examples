import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Search, X, ChevronDown, ChevronUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

// 搜索字段类型定义
export type FieldType =
  | "text"
  | "select"
  | "checkbox"
  | "date"
  | "number"
  | "radio"
  | "cascader";

// 级联选择器选项类型
export interface OptionType {
  label: string;
  value: string;
  children?: OptionType[];
}

// 搜索字段定义
export interface FieldDefinition {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  options?: OptionType[];
  defaultValue?: any;
  isAdvanced?: boolean; // 是否为高级搜索字段
  validation?: any; // zod validation schema
  layout?: {
    colSpan?: number;
    order?: number;
  };
}

// 搜索表单配置
export interface SearchFormConfig<T> {
  fields: FieldDefinition[];
  defaultValues?: Partial<T>;
  validationSchema?: z.ZodType<any, any>;
  onSearch: (values: T) => void;
  onReset?: () => void;
}

// 通用搜索表单组件
export function ConfigSearchForm<T extends Record<string, any>>(
  props: SearchFormConfig<T>
) {
  const {
    fields,
    defaultValues = {},
    validationSchema,
    onSearch,
    onReset,
  } = props;

  const [showAdvanced, setShowAdvanced] = useState(false);

  // 创建 zod schema 或使用传入的 schema
  const schema =
    validationSchema ||
    z.object(
      fields.reduce((acc, field) => {
        acc[field.name] = field.validation || z.any().optional();
        return acc;
      }, {} as Record<string, z.ZodTypeAny>)
    );

  // 初始化表单
  const form = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as any,
  });

  // 提交处理函数
  const handleSubmit = (values: T) => {
    onSearch(values);
  };

  // 重置表单
  const handleReset = () => {
    form.reset(defaultValues as any);
    if (onReset) {
      onReset();
    } else {
      onSearch(defaultValues as T);
    }
  };

  // 获取基本字段和高级字段
  const basicFields = fields.filter((field) => !field.isAdvanced);
  const advancedFields = fields.filter((field) => field.isAdvanced);

  // 判断是否有高级字段
  const hasAdvancedFields = advancedFields.length > 0;

  // 根据字段类型渲染不同的表单控件
  const renderField = (field: FieldDefinition) => {
    const { name, label, type, placeholder, options } = field;

    switch (type) {
      case "text":
        return (
          <FormField
            key={name}
            control={form.control}
            name={name as any}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>{label}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={placeholder}
                    {...formField}
                    value={formField.value || ""}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        );

      case "select":
        return (
          <FormField
            key={name}
            control={form.control}
            name={name as any}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>{label}</FormLabel>
                <Select
                  onValueChange={formField.onChange}
                  defaultValue={formField.value}
                  value={formField.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={placeholder} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {options?.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        );

      case "checkbox":
        return (
          <FormField
            key={name}
            control={form.control}
            name={name}
            render={({ field: formField }) => (
              <FormItem className="flex flex-row items-center gap-2 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={formField.value}
                    onCheckedChange={formField.onChange}
                  />
                </FormControl>
                <Label htmlFor={name}>{label}</Label>
              </FormItem>
            )}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            {/* 基本搜索字段 */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {basicFields.map(renderField)}

              <div className="flex items-end gap-2">
                <Button type="submit" className="flex gap-2 items-center">
                  <Search className="h-4 w-4" />
                  搜索
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                  className="flex gap-2 items-center"
                >
                  <X className="h-4 w-4" />
                  重置
                </Button>
                {hasAdvancedFields && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="flex gap-2 items-center"
                  >
                    {showAdvanced ? (
                      <>
                        <ChevronUp className="h-4 w-4" />
                        收起
                      </>
                    ) : (
                      <>
                        <ChevronDown className="h-4 w-4" />
                        高级搜索
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>

            {/* 高级搜索字段 */}
            {showAdvanced && hasAdvancedFields && (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-4 border-t">
                {advancedFields.map(renderField)}
              </div>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
