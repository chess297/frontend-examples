import { useState } from "react";
import * as z from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus } from "lucide-react";

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
import type { CreateMenuRequest } from "@/services/api/api";

// 表单验证模式
const formSchema = z.object({
  title: z.string().min(1, "菜单名称不能为空"),
  path: z.string().min(1, "菜单路径不能为空"),
  icon: z.string().min(1, "菜单图标不能为空"),
  component: z.string().optional(),
  parent_id: z.string().optional(),
  groups: z.array(z.string()).optional(),
});

export default function AddMenuDialog() {
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

    // 创建菜单数据
    const menuData: CreateMenuRequest = {
      title: values.title,
      path: values.path,
      icon: values.icon,
      component: values.component || `/pages${values.path}`, // 默认组件路径
      parent_id: values.parent_id || "",
      groups: values.groups || [],
    };

    // 调用创建菜单服务
    return api
      .create(menuData)
      .then(() => {
        toast.success("菜单添加成功！");
        // 重新获取菜单列表
        queryClient.invalidateQueries({ queryKey: ["menus"] });
        setIsOpen(false);
        return true;
      })
      .catch((error) => {
        const errorMessage =
          error instanceof Error ? error.message : "添加菜单失败，请重试";
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
      placeholder: "请输入组件路径，例如：/pages/admin/users",
      description: "留空将根据路径自动生成",
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="flex gap-2 items-center">
          <Plus className="h-4 w-4" />
          添加菜单
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>添加菜单</DialogTitle>
          <DialogDescription>请填写菜单信息，创建新的菜单项</DialogDescription>
        </DialogHeader>

        <ConfigForm
          config={{
            title: "添加菜单",
            fields: formFields,
            validationSchema: formSchema,
            defaultValues: {
              title: "",
              path: "",
              icon: "",
              component: "",
            },
            onSubmit: handleSubmit,
            queryKey: ["menus"],
            submitButtonText: isSubmitting ? "提交中..." : "添加菜单",
            cancelButtonText: "取消",
          }}
          onClose={() => setIsOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
