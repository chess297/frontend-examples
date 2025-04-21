import { useEffect } from "react";
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
} from "@/components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import type { RoleEntity, UpdateRoleDto } from "@/services/api/api";
import { api } from "@/services";

// 表单验证模式
const formSchema = z.object({
  name: z.string().min(1, "角色名称不能为空"),
  description: z.string().min(1, "角色描述不能为空"),
  // 可以添加更多字段，如 permissions 等
});

interface EditDialogProps {
  role: RoleEntity | null;
  open: boolean;
  onClose: () => void;
}

export default function EditDialog({ role, open, onClose }: EditDialogProps) {
  const queryClient = useQueryClient();

  // 初始化表单
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  // 当角色数据变化时，重置表单
  useEffect(() => {
    if (role && open) {
      form.reset({
        name: role.name,
        description: role.description,
        // 可以添加其他字段的初始化
      });
    }
  }, [role, open, form]);

  // 提交表单
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!role) return;

    try {
      const roleData: UpdateRoleDto = {
        name: values.name,
        description: values.description,
        // 可以添加其他字段
      };

      await api.updateRole(role.id, roleData);
      toast.success("角色更新成功");

      // 关闭对话框
      onClose();

      // 刷新角色列表
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    } catch (error) {
      console.error("更新角色失败:", error);
      toast.error("更新角色失败");
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="sm:max-w-[425px]">
        <AlertDialogHeader>
          <AlertDialogTitle>编辑角色</AlertDialogTitle>
          <AlertDialogDescription>
            编辑角色信息，修改下面的表单并保存。
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
                  <FormLabel>角色名称</FormLabel>
                  <FormControl>
                    <Input placeholder="输入角色名称" {...field} />
                  </FormControl>
                  <FormDescription>
                    角色名称应该简洁明了，例如：管理员、编辑者等
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>角色描述</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="输入角色描述"
                      className="resize-none h-20"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 可以在此处添加权限选择器 */}

            <AlertDialogFooter>
              <Button variant="outline" type="button" onClick={onClose}>
                取消
              </Button>
              <Button type="submit">保存</Button>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
