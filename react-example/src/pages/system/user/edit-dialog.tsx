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
import type { UpdateUserRequest, UserEntity } from "@/services/api/api";

// 表单验证模式
const formSchema = z.object({
  username: z.string().min(1, "用户名不能为空"),
  email: z.string().email("请输入有效的邮箱地址"),
  is_active: z.boolean().optional(),
});

interface EditUserDialogProps {
  user: UserEntity;
  open?: boolean;
  onClose?: () => void;
  children?: React.ReactNode;
}

export default function EditUserDialog({
  user,
  open: controlledOpen,
  onClose: controlledOnClose,
  children,
}: EditUserDialogProps) {
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
    // 创建更新用户数据
    const updateData: UpdateUserRequest = {
      username: values.username,
      email: values.email,
      is_active: values.is_active,
    };

    // 调用更新用户服务
    await api.update(user.id, updateData).finally(() => {
      setIsSubmitting(false);
    });
    toast.success("用户信息更新成功！");

    // 重新获取用户列表
    queryClient.invalidateQueries({ queryKey: ["users"] });

    // 关闭对话框
    onClose();
  };

  // 表单字段定义
  const formFields: FormFieldConfig[] = [
    {
      name: "username",
      label: "用户名",
      type: "text",
      placeholder: "请输入用户名",
      required: true,
    },
    {
      name: "email",
      label: "电子邮箱",
      type: "text",
      placeholder: "请输入电子邮箱",
      required: true,
    },
    {
      name: "status",
      label: "启用状态",
      type: "checkbox",
      description: "设置用户是否启用",
    },
  ];

  // 默认表单值
  const defaultValues = {
    username: user.username,
    email: user.email || "",
    status: Boolean(user.is_active),
  };

  // 如果没有数据则不渲染
  if (!user) return null;

  // 如果是受控模式且没有trigger，直接返回内容
  if (controlledOpen !== undefined && !children) {
    return (
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>编辑用户</DialogTitle>
            <DialogDescription>修改用户信息</DialogDescription>
          </DialogHeader>

          <ConfigForm
            config={{
              title: "编辑用户",
              fields: formFields,
              validationSchema: formSchema,
              defaultValues,
              onSubmit: handleSubmit,
              queryKey: ["users"],
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
          <DialogTitle>编辑用户</DialogTitle>
          <DialogDescription>修改用户信息</DialogDescription>
        </DialogHeader>

        <ConfigForm
          config={{
            title: "编辑用户",
            fields: formFields,
            validationSchema: formSchema,
            defaultValues,
            onSubmit: handleSubmit,
            queryKey: ["users"],
            submitButtonText: isSubmitting ? "提交中..." : "保存",
            cancelButtonText: "取消",
          }}
          onClose={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}
