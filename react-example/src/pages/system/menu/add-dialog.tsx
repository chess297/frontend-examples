import {
  AlertDialogHeader,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { api } from "@/services";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  path: z.string().min(1, "Path is required"),
  icon: z.string().min(1, "Icon is required"),
});

export default function AddDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      path: "",
      icon: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);

      // 创建菜单实体
      const menuData = {
        id: "", // 后端会生成
        title: values.title,
        path: values.path,
        icon: values.icon,
        component: `/pages${values.path}/index.tsx`, // 默认组件路径
        parent_id: "", // 可以根据需要设置父级菜单ID
        groups: [], // 可以根据需要设置菜单分组
      };

      const response = await api.createMenu(menuData);

      if (response.status === 200) {
        toast.success("菜单添加成功！");
        // 重置表单
        form.reset();
        // 关闭弹窗
        setIsOpen(false);
        // 刷新菜单列表
        queryClient.invalidateQueries({ queryKey: ["menus"] });
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "添加菜单失败，请重试";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button>添加菜单</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>添加菜单</AlertDialogTitle>
          <AlertDialogDescription>
            请填写菜单信息，创建新菜单项
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>菜单名称</FormLabel>
                  <FormControl>
                    <Input placeholder="用户管理" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
              name={"title"}
            />
            <FormField
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>菜单路径</FormLabel>
                  <FormControl>
                    <Input placeholder="/admin/user-manager" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
              name={"path"}
            />
            <FormField
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>菜单图标</FormLabel>
                  <FormControl>
                    <Input placeholder="users" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
              name={"icon"}
            />
            <AlertDialogFooter className="mt-6">
              <AlertDialogCancel disabled={isSubmitting}>
                取消
              </AlertDialogCancel>
              <AlertDialogAction
                type="submit"
                onClick={form.handleSubmit(onSubmit)}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    提交中...
                  </>
                ) : (
                  "确认添加"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
