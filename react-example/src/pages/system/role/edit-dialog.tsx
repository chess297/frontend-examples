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
import type { RoleResponse, UpdateRoleRequest } from "@/services/api/api";

// 表单验证模式
const formSchema = z.object({
  name: z.string().min(1, "角色名称不能为空"),
  description: z.string().optional(),
  is_active: z.boolean().optional(),
});

interface EditRoleDialogProps {
  role: RoleResponse;
  open?: boolean;
  onClose?: () => void;
  children?: React.ReactNode;
}

export default function EditRoleDialog({
  role,
  open: controlledOpen,
  onClose: controlledOnClose,
  children,
}: EditRoleDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  // 支持受控和非受控模式
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const onClose = controlledOnClose || (() => setInternalOpen(false));

  const handleOpenChange = (open: boolean) => {
    if (!isSubmitting) {
      if (controlledOpen === undefined) {
        setInternalOpen(open);
      } else if (controlledOnClose && !open) {
        controlledOnClose();
      }
    }
  };

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);

    // 创建更新角色数据
    const updateData: UpdateRoleRequest = {
      name: values.name,
      description: values.description,
      is_active: values.is_active,
    };

    // 调用更新角色服务
    return api
      .update(role.id, updateData)
      .then(() => {
        toast.success("角色更新成功！");
        // 重新获取角色列表
        queryClient.invalidateQueries({ queryKey: ["roles"] });
        onClose();
        return true;
      })
      .catch((error) => {
        const errorMessage =
          error instanceof Error ? error.message : "更新角色失败，请重试";
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
      name: "name",
      label: "角色名称",
      type: "text",
      placeholder: "请输入角色名称",
      required: true,
    },
    {
      name: "description",
      label: "角色描述",
      type: "textarea",
      placeholder: "请输入角色描述",
      description: "角色的职责和权限范围描述",
    },
    {
      name: "is_active",
      label: "启用状态",
      type: "checkbox",
      description: "设置角色是否启用",
    },
  ];

  // 默认表单值
  const defaultValues = {
    name: role.name,
    description: role.description || "",
    is_active: Boolean(role.is_active),
  };

  // 如果没有数据则不渲染
  if (!role) return null;

  // 如果是受控模式且没有trigger，直接返回内容
  if (controlledOpen !== undefined && !children) {
    return (
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>编辑角色</DialogTitle>
            <DialogDescription>修改角色信息</DialogDescription>
          </DialogHeader>

          <ConfigForm
            config={{
              title: "编辑角色",
              fields: formFields,
              validationSchema: formSchema,
              defaultValues,
              onSubmit: handleSubmit,
              queryKey: ["roles"],
              submitButtonText: isSubmitting ? "提交中..." : "保存",
              cancelButtonText: "取消",
            }}
            onClose={onClose}
          />
        </DialogContent>
      </Dialog>
    );
  }

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
          <DialogTitle>编辑角色</DialogTitle>
          <DialogDescription>修改角色信息</DialogDescription>
        </DialogHeader>

        <ConfigForm
          config={{
            title: "编辑角色",
            fields: formFields,
            validationSchema: formSchema,
            defaultValues,
            onSubmit: handleSubmit,
            queryKey: ["roles"],
            submitButtonText: isSubmitting ? "提交中..." : "保存",
            cancelButtonText: "取消",
          }}
          onClose={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}
