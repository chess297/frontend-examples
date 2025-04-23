import { useState } from "react";
import * as z from "zod";
import { toast } from "sonner";
import { Key } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ConfigForm,
  type FormFieldConfig,
} from "@/components/system-config/form-config/config-form";

import * as api from "./api";

// 表单验证模式
const formSchema = z
  .object({
    password: z.string().min(6, "密码至少需要6个字符"),
    confirm_password: z.string().min(6, "确认密码至少需要6个字符"),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "两次输入的密码不一致",
    path: ["confirm_password"],
  });

interface ResetPasswordDialogProps {
  userId: string;
  username: string;
  open: boolean;
  onClose: () => void;
}

export default function ResetPasswordDialog({
  userId,
  username,
  open,
  onClose,
}: ResetPasswordDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenChange = (open: boolean) => {
    if (!isSubmitting) {
      onClose();
    }
  };

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);

    // 调用重置密码服务
    await api
      .resetPassword(userId, values.password)
      .then(() => {
        toast.success(`用户 ${username} 的密码已重置成功！`);
        onClose();
        return true;
      })
      .catch((error) => {
        const errorMessage =
          error instanceof Error ? error.message : "重置密码失败，请重试";
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
      name: "password",
      label: "新密码",
      type: "password",
      placeholder: "请输入新密码",
      required: true,
    },
    {
      name: "confirm_password",
      label: "确认新密码",
      type: "password",
      placeholder: "请再次输入新密码",
      required: true,
    },
  ];

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>重置密码</DialogTitle>
          <DialogDescription>
            为用户 <strong>{username}</strong> 设置新密码
          </DialogDescription>
        </DialogHeader>

        <ConfigForm
          config={{
            title: "重置密码",
            fields: formFields,
            validationSchema: formSchema,
            defaultValues: {
              password: "",
              confirm_password: "",
            },
            onSubmit: handleSubmit,
            submitButtonText: isSubmitting ? "提交中..." : "重置密码",
            cancelButtonText: "取消",
          }}
          onClose={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}
