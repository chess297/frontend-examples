import { useState } from "react";
import * as z from "zod";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Loader2 } from "lucide-react";

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
import type { CreateUserRequest } from "@/services/api/api";

// 表单验证模式
const formSchema = z
  .object({
    username: z.string().min(1, "用户名不能为空"),
    email: z.string().email("请输入有效的邮箱地址"),
    password: z.string().min(6, "密码至少需要6个字符"),
    confirm_password: z.string().min(6, "确认密码至少需要6个字符"),
    is_active: z.boolean().optional(),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "两次输入的密码不一致",
    path: ["confirm_password"],
  });

// 表单数据类型
type FormSchema = z.infer<typeof formSchema>;

export default function AddUserDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const handleSubmit = async (values: FormSchema) => {
    setIsSubmitting(true);
    // 创建用户数据
    const userData: CreateUserRequest = {
      username: values.username,
      email: values.email,
      password: values.password,
      is_active: values.is_active || true,
      phone: "",
      country_code: "",
      address: "",
      role_ids: [],
      avatar_url: "",
    };

    // 调用创建用户服务
    await api.create(userData).finally(() => {
      setIsSubmitting(false);
    });
    toast.success("用户添加成功！");

    // 重新获取用户列表
    queryClient.invalidateQueries({ queryKey: ["users"] });

    // 关闭对话框
    setIsOpen(false);
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
      name: "password",
      label: "密码",
      type: "password",
      placeholder: "请输入密码",
      required: true,
    },
    {
      name: "confirm_password",
      label: "确认密码",
      type: "password",
      placeholder: "请再次输入密码",
      required: true,
    },
    {
      name: "is_active",
      label: "启用状态",
      type: "checkbox",
      description: "设置用户是否启用",
    },
  ];

  const handleOpenChange = (open: boolean) => {
    if (!isSubmitting) {
      setIsOpen(open);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="flex gap-2 items-center">
          <Plus className="h-4 w-4" />
          添加用户
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>添加用户</DialogTitle>
          <DialogDescription>
            请填写用户信息，创建新的系统用户
          </DialogDescription>
        </DialogHeader>

        <ConfigForm
          config={{
            title: "添加用户",
            fields: formFields,
            validationSchema: formSchema,
            defaultValues: {
              username: "",
              email: "",
              password: "",
              confirm_password: "",
              is_active: true,
            },
            onSubmit: handleSubmit,
            queryKey: ["users"],
            submitButtonText: isSubmitting ? "提交中..." : "添加用户",
            cancelButtonText: "取消",
          }}
          onClose={() => setIsOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
