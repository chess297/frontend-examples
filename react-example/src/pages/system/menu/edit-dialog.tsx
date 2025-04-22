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
import { useState, useEffect } from "react";
import { api } from "@/services";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, PenIcon } from "lucide-react";
import type { MenuResponse } from "@/services/api/api";

const formSchema = z.object({
  title: z.string().min(1, "菜单名称不能为空"),
  path: z.string().min(1, "菜单路径不能为空"),
  icon: z.string().min(1, "菜单图标不能为空"),
  component: z.string().min(1, "组件路径不能为空"),
});

interface EditDialogProps {
  menu: MenuResponse;
}

export default function EditDialog({ menu }: EditDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: menu.title,
      path: menu.path,
      icon: menu.icon,
      component: menu.component,
    },
  });

  // 当菜单数据变化时重置表单
  useEffect(() => {
    if (menu) {
      form.reset({
        title: menu.title,
        path: menu.path,
        icon: menu.icon,
        component: menu.component,
      });
    }
  }, [form, menu]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);

      // 创建更新的菜单数据
      const updatedMenu = {
        ...menu,
        mate: {
          ...menu,
          title: values.title,
          path: values.path,
          icon: values.icon,
          component: values.component,
        },
      };

      const response = await api.updateMenu(menu.id, updatedMenu);

      if (response.status === 200) {
        toast.success("菜单更新成功！");
        // 关闭弹窗
        setIsOpen(false);
        // 刷新菜单列表
        queryClient.invalidateQueries({ queryKey: ["menus"] });
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || "更新菜单失败，请重试");
      } else {
        toast.error("更新菜单失败，请重试");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <PenIcon className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>编辑菜单</AlertDialogTitle>
          <AlertDialogDescription>修改菜单信息</AlertDialogDescription>
        </AlertDialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>菜单名称</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
              name="title"
            />
            <FormField
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>菜单路径</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
              name="path"
            />
            <FormField
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>菜单图标</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
              name="icon"
            />
            <FormField
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>组件路径</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
              name="component"
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
                  "保存"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
