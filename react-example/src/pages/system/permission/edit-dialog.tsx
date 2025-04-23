import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { PermissionAction } from "@/services/api/api";
import type { PermissionEntity, UpdatePermissionDto } from "@/services/api/api";
import * as api from "./api";

// 表单验证模式
const formSchema = z.object({
  name: z.string().min(1, "权限名称不能为空"),
  description: z.string().min(1, "权限描述不能为空"),
  resource: z.string().min(1, "资源名称不能为空"),
  actions: z.array(z.string()).min(1, "至少选择一个操作权限"),
  roles: z.array(z.string()).optional(),
});

interface EditDialogProps {
  permission: PermissionEntity | null;
  open: boolean;
  onClose: () => void;
}

export default function EditDialog({
  permission,
  open,
  onClose,
}: EditDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const handleOpenChange = (isOpen: boolean) => {
    if (!isSubmitting && !isOpen) {
      onClose();
    }
  };

  // 初始化表单
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      resource: "",
      actions: [],
      roles: [],
    },
  });

  // 当权限数据变化时，重置表单
  useEffect(() => {
    if (permission && open) {
      form.reset({
        name: permission.name,
        description: permission.description,
        resource: permission.resource,
        actions: permission.actions as string[],
        roles: [], // 如果API返回了roles信息，可以在这里设置
      });
    }
  }, [permission, open, form]);

  // 提交表单
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!permission) return;

    setIsSubmitting(true);

    const permissionData: UpdatePermissionDto = {
      name: values.name,
      description: values.description,
      resource: values.resource,
      actions: values.actions as PermissionAction[],
      roles: values.roles || [],
    };

    await api
      .update(permission.id, permissionData)
      .then(() => {
        toast.success("权限更新成功");
        // 关闭对话框
        onClose();
        // 刷新权限列表
        queryClient.invalidateQueries({ queryKey: ["permissions"] });
      })
      .catch((error) => {
        console.error("更新权限失败:", error);
        toast.error("更新权限失败");
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const availableActions = [
    { id: PermissionAction.Manage, label: "管理" },
    { id: PermissionAction.Create, label: "创建" },
    { id: PermissionAction.Read, label: "读取" },
    { id: PermissionAction.Update, label: "更新" },
    { id: PermissionAction.Delete, label: "删除" },
  ];

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>编辑权限</DialogTitle>
          <DialogDescription>
            编辑权限信息，修改下面的表单并保存。
          </DialogDescription>
        </DialogHeader>

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

            <DialogFooter>
              <Button
                variant="outline"
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
              >
                取消
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "提交中..." : "保存"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
