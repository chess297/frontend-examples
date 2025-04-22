import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import type { CreatePermissionDto } from "@/services/api/api";
import { PermissionAction } from "@/services/api/api";
import { Plus } from "lucide-react";

// 将引用从 services/modules/permission 改为本地 api.ts
import * as api from "./api";

// 表单验证模式
const formSchema = z.object({
  name: z.string().min(1, "权限名称不能为空"),
  description: z.string().min(1, "权限描述不能为空"),
  resource: z.string().min(1, "资源名称不能为空"),
  actions: z.array(z.string()).min(1, "至少选择一个操作权限"),
});

export default function AddDialog() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  // 初始化表单
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      resource: "",
      actions: [],
    },
  });

  // 提交表单
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const permissionData: CreatePermissionDto = {
        name: values.name,
        description: values.description,
        resource: values.resource,
        actions: values.actions as PermissionAction[],
      };

      await api.create(permissionData);
      toast.success("权限创建成功");

      // 重置表单和关闭对话框
      form.reset();
      setOpen(false);

      // 刷新权限列表
      queryClient.invalidateQueries({ queryKey: ["permissions"] });
    } catch (error) {
      console.error("创建权限失败:", error);
      toast.error("创建权限失败");
    }
  };

  const availableActions = [
    { id: PermissionAction.Manage, label: "管理" },
    { id: PermissionAction.Create, label: "创建" },
    { id: PermissionAction.Read, label: "读取" },
    { id: PermissionAction.Update, label: "更新" },
    { id: PermissionAction.Delete, label: "删除" },
  ];

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button>
          <Plus className="mr-1 h-4 w-4" />
          新建权限
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader>
          <AlertDialogTitle>新建权限</AlertDialogTitle>
          <AlertDialogDescription>
            创建一个新的权限，填写下面的表单并提交。
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>权限名称</FormLabel>
                  <FormControl>
                    <Input placeholder="输入权限名称" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="resource"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>资源名称</FormLabel>
                  <FormControl>
                    <Input placeholder="输入资源名称" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>权限描述</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="输入权限描述"
                      className="resize-none h-20"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="actions"
              render={() => (
                <FormItem>
                  <FormLabel>操作权限</FormLabel>
                  <div className="flex flex-wrap gap-4">
                    {availableActions.map((action) => (
                      <FormField
                        key={action.id}
                        control={form.control}
                        name="actions"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={action.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(action.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([
                                          ...field.value,
                                          action.id,
                                        ])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== action.id
                                          )
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {action.label}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <AlertDialogFooter>
              <Button
                variant="outline"
                type="button"
                onClick={() => setOpen(false)}
              >
                取消
              </Button>
              <Button type="submit">创建</Button>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
