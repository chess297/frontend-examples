import { useState } from "react";
import * as z from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  ConfigForm,
  type FormFieldConfig,
} from "@/components/system-config/form-config/config-form";

import * as api from "./api";
import type { CreateRoleRequest } from "@/services/api/api";

// 表单验证模式
const formSchema = z.object({
  name: z.string().min(1, "角色名称不能为空"),
  description: z.string().optional(),
  is_active: z.boolean().optional(),
});

export default function AddRoleDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      // 创建角色数据
      const roleData: CreateRoleRequest = {
        name: values.name,
        description: values.description || "",
        permission_ids: [],
        user_ids: [],
        is_active: values.is_active || true,
      };

      // 调用创建角色服务
      await api.create(roleData);
      toast.success("角色添加成功！");

      // 重新获取角色列表
      queryClient.invalidateQueries({ queryKey: ["roles"] });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "添加角色失败，请重试";
      toast.error(errorMessage);
      throw error;
    }
  };

  // 表单字段定义
  const formFields: FormFieldConfig[] = [
    {
      name: "name",
      label: "角色名称",
      type: "text",
      placeholder: "请输入角色名称",
      required: true,
      description: "角色名称应该简洁明了，例如：管理员、编辑者等",
    },
    {
      name: "description",
      label: "角色描述",
      type: "textarea",
      placeholder: "请输入角色描述",
      description: "角色的职责和权限范围描述",
    },
    {
      name: "status",
      label: "启用状态",
      type: "checkbox",
      description: "设置角色是否启用",
    },
  ];

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button className="flex gap-2 items-center">
          <Plus className="h-4 w-4" />
          添加角色
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="sm:max-w-[500px]">
        <AlertDialogHeader>
          <AlertDialogTitle>添加角色</AlertDialogTitle>
          <AlertDialogDescription>
            请填写角色信息，创建新的系统角色
          </AlertDialogDescription>
        </AlertDialogHeader>

        <ConfigForm
          config={{
            title: "添加角色",
            fields: formFields,
            validationSchema: formSchema,
            defaultValues: {
              name: "",
              description: "",
              status: true,
            },
            onSubmit: handleSubmit,
            queryKey: ["roles"],
          }}
          onClose={() => setIsOpen(false)}
        />
      </AlertDialogContent>
    </AlertDialog>
  );
}
