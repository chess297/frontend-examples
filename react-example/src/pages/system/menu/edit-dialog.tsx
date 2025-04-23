import { useState } from "react";
import * as z from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Edit } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ConfigForm,
  type FormFieldConfig,
} from "@/components/system-config/form-config/config-form";

import * as api from "./api";
import type { MenuResponse, UpdateMenuDto } from "@/services/api/api";

// 表单验证模式
const formSchema = z.object({
  title: z.string().min(1, "菜单名称不能为空"),
  path: z.string().min(1, "菜单路径不能为空"),
  icon: z.string().min(1, "菜单图标不能为空"),
  component: z.string().optional(),
  parent_id: z.string().optional(),
});

interface EditMenuDialogProps {
  menu: MenuResponse;
  onClose?: () => void;
  children?: React.ReactNode;
}

export default function EditMenuDialog({
  menu,
  children,
}: EditMenuDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const handleOpenChange = (open: boolean) => {
    if (!isSubmitting) {
      setIsOpen(open);
    }
  };

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);

    // 创建更新菜单数据
    const updateData: UpdateMenuDto = {
      title: values.title,
      path: values.path,
      icon: values.icon,
      component: values.component,
      parent_id: values.parent_id,
    };

    // 调用更新菜单服务
    return api
      .updateMenu(menu.id, updateData)
      .then(() => {
        toast.success("菜单更新成功！");
        // 重新获取菜单列表
        queryClient.invalidateQueries({ queryKey: ["menus"] });
        return true;
      })
      .catch((error) => {
        const errorMessage =
          error instanceof Error ? error.message : "更新菜单失败，请重试";
        toast.error(errorMessage);
        return false;
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  // 表单字段定义
  const formFields: FormFieldConfig[] = [
    {
      name: "title",
      label: "菜单名称",
      type: "text",
      placeholder: "请输入菜单名称",
      required: true,
    },
    {
      name: "path",
      label: "菜单路径",
      type: "text",
      placeholder: "请输入菜单路径，例如：/admin/users",
      required: true,
    },
    {
      name: "icon",
      label: "菜单图标",
      type: "text",
      placeholder: "请输入图标名称",
      required: true,
      description: "菜单图标名称，例如：user, settings, home 等",
    },
    {
      name: "component",
      label: "组件路径",
      type: "text",
      placeholder: "请输入组件路径",
      description: "组件的实际路径，例如：/pages/admin/users/index.tsx",
    },
  ];

  // 默认表单值
  const defaultValues = {
    title: menu.title,
    path: menu.path,
    icon: menu.icon,
    component: menu.component,
    parent_id: menu.parent_id ? String(menu.parent_id) : "",
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="ghost" size="icon" title="编辑">
            <Edit className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>编辑菜单</DialogTitle>
          <DialogDescription>修改菜单信息</DialogDescription>
        </DialogHeader>

        <ConfigForm
          config={{
            title: "编辑菜单",
            fields: formFields,
            validationSchema: formSchema,
            defaultValues,
            onSubmit: handleSubmit,
            queryKey: ["menus"],
            submitButtonText: isSubmitting ? "提交中..." : "保存",
            cancelButtonText: "取消",
          }}
          onClose={() => setIsOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
