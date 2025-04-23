import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type z from "zod";
import { Loader2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

export type FormFieldType =
  | "text"
  | "password"
  | "textarea"
  | "select"
  | "checkbox"
  | "radio"
  | "custom";

export interface FormFieldConfig {
  name: string;
  label: string;
  type: FormFieldType;
  placeholder?: string;
  description?: string;
  options?: Array<{ value: string; label: string }>;
  required?: boolean;
  customComponent?: React.ReactNode;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  validation?: any; // zod validation schema
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  defaultValue?: any;
  layoutProps?: {
    colSpan?: number;
    order?: number;
  };
}

export interface FormConfig<T> {
  title: string;
  description?: string;
  fields: FormFieldConfig[];
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  validationSchema: z.ZodType<any, any>;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  defaultValues: Record<string, any>;
  onSubmit: (values: T) => Promise<void> | void;
  submitButtonText?: string;
  cancelButtonText?: string;
  queryKey?: string[]; // 用于刷新查询
}

interface ConfigFormProps<T> {
  config: FormConfig<T>;
  onClose: () => void;
}

export function ConfigForm<T>({ config, onClose }: ConfigFormProps<T>) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(config.validationSchema),
    defaultValues: config.defaultValues,
  });

  const handleSubmit = async (values: T) => {
    try {
      setIsSubmitting(true);
      await config.onSubmit(values);

      // 成功后关闭表单
      form.reset();
      onClose();

      // 如果指定了查询键，则刷新数据
      if (config.queryKey) {
        queryClient.invalidateQueries({ queryKey: config.queryKey });
      }
    } catch (error) {
      console.error("表单提交错误:", error);
      // const errorMessage =
      //   error instanceof Error ? error.message : "提交表单失败，请重试";
      // toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 根据字段类型渲染不同的表单控件
  const renderFormField = (field: FormFieldConfig) => {
    switch (field.type) {
      case "text":
      case "password":
        return (
          <FormField
            key={field.name}
            control={form.control}
            name={field.name}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>{field.label}</FormLabel>
                <FormControl>
                  <Input
                    type={field.type}
                    placeholder={field.placeholder}
                    {...formField}
                  />
                </FormControl>
                {field.description && (
                  <FormDescription>{field.description}</FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case "textarea":
        return (
          <FormField
            key={field.name}
            control={form.control}
            name={field.name}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>{field.label}</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder={field.placeholder}
                    className="resize-none min-h-[100px]"
                    {...formField}
                  />
                </FormControl>
                {field.description && (
                  <FormDescription>{field.description}</FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case "select":
        return (
          <FormField
            key={field.name}
            control={form.control}
            name={field.name}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>{field.label}</FormLabel>
                <Select
                  onValueChange={formField.onChange}
                  defaultValue={formField.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={field.placeholder} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {field.options?.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {field.description && (
                  <FormDescription>{field.description}</FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case "checkbox":
        return (
          <FormField
            key={field.name}
            control={form.control}
            name={field.name}
            render={({ field: formField }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={formField.value}
                    onCheckedChange={formField.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>{field.label}</FormLabel>
                  {field.description && (
                    <FormDescription>{field.description}</FormDescription>
                  )}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        );

      case "custom":
        return field.customComponent || null;

      default:
        return null;
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {config.fields.map(renderFormField)}

        <DialogFooter className="pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
          >
            {config.cancelButtonText || "取消"}
          </Button>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                提交中...
              </>
            ) : (
              config.submitButtonText || "确认"
            )}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
