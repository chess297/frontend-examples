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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import * as api from "./api";
import {
  type MenuGroupEntity,
  type UpdateMenuGroupRequest,
} from "@/services/api/api";

// 表单验证模式
const formSchema = z.object({
  title: z.string().min(1, "分组名称不能为空"),
  description: z.string().optional(),
  icon: z.string().optional(),
});

interface EditDialogProps {
  menuGroup: MenuGroupEntity;
  open: boolean;
  onClose: () => void;
}

export default function EditMenuGroupDialog({
  menuGroup,
  open,
  onClose,
}: EditDialogProps) {
  const queryClient = useQueryClient();

  // 初始化表单
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: menuGroup.title || "",
      description: menuGroup.description || "",
      icon: menuGroup.icon || "",
    },
  });

  // 当菜单分组数据变化时，重置表单
  useEffect(() => {
    if (open && menuGroup) {
      form.reset({
        title: menuGroup.title || "",
        description: menuGroup.description || "",
        icon: menuGroup.icon || "",
      });
    }
  }, [menuGroup, open, form]);

  // 提交表单
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const updateData: UpdateMenuGroupRequest = {
        title: values.title,
        description: values.description || "",
        icon: values.icon || "",
        menus: menuGroup.menus?.map((menu) => menu.id) || [],
      };

      await api.update(menuGroup.id, updateData);
      toast.success("菜单分组更新成功");
      queryClient.invalidateQueries({ queryKey: ["menuGroups"] });
      onClose();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "更新菜单分组失败，请重试";
      toast.error(errorMessage);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="sm:max-w-[500px]">
        <AlertDialogHeader>
          <AlertDialogTitle>编辑菜单分组</AlertDialogTitle>
          <AlertDialogDescription>
            修改菜单分组的信息和关联。
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 py-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>分组名称</FormLabel>
                  <FormControl>
                    <Input placeholder="请输入分组名称" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>图标</FormLabel>
                  <FormControl>
                    <Input placeholder="请输入图标名称或代码" {...field} />
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
                  <FormLabel>描述</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="请输入分组描述"
                      className="resize-none h-20"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <AlertDialogFooter>
              <Button variant="outline" type="button" onClick={onClose}>
                取消
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "保存中..." : "保存更改"}
              </Button>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
