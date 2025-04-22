import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useAuthStore } from "@/hooks/use-auth-store";
import { ROUTES } from "@/router";
import { api } from "@/services";
import { useEffect } from "react";

const formSchema = z.object({
  username: z.string().min(3, "用户名至少3个字符"),
  email: z.string().email("请输入有效邮箱格式"),
  password: z.string().min(6, "密码最少6位").max(20, "密码最大20位"),
  systemCode: z.string(),
});

export function SystemInitForm({ className }: React.ComponentProps<"form">) {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "admin",
      email: "admin@example",
      password: "12345678",
      systemCode: "",
    },
  });

  // 系统初始化管理员注册
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // 调用系统初始化API，验证系统码并创建管理员账号
    await api.registerAdmin({
      username: values.username,
      email: values.email,
      password: values.password,
      systemCode: values.systemCode,
    });

    toast.success("系统初始化成功，管理员账号已创建", {
      onAutoClose() {
        navigate(ROUTES.SIGNIN);
      },
    });
  }

  async function generateSystemCode() {
    await api.generateSystemCode().then((res) => {
      toast.success(res.data.message);
    });
  }

  useEffect(() => {
    // 检查是否已经初始化系统
    api.checkSystemInit().then((res) => {
      if (res.data.data.initialized) {
        toast.error("系统已初始化，请直接登录");
        navigate(ROUTES.SIGNIN);
      }
    });
  }, [navigate]);

  return (
    <Form {...form}>
      <form
        className={cn("flex flex-col gap-6", className)}
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <h1 className="text-2xl font-bold">系统初始化</h1>
          <p className="text-muted-foreground text-sm text-balance">
            请输入系统码和管理员信息来初始化系统
          </p>
        </div>
        <div className="grid gap-6">
          <div className="grid gap-3">
            <FormField
              name="systemCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>系统码</FormLabel>
                  <FormControl>
                    <Input placeholder="请输入系统初始化码" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid gap-3">
            <FormField
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>用户名</FormLabel>
                  <FormControl>
                    <Input placeholder="请输入管理员用户名" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid gap-3">
            <FormField
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>邮箱</FormLabel>
                  <FormControl>
                    <Input placeholder="请输入管理员邮箱" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid gap-3">
            <FormField
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>密码</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="请输入管理员密码"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="button" onClick={generateSystemCode} className="w-full">
            生成系统码
          </Button>
          <Button type="submit" className="w-full">
            初始化系统
          </Button>
        </div>
        <div className="text-center text-sm">
          已有账号?{" "}
          <Link to={ROUTES.SIGNIN} className="underline underline-offset-4">
            去登录
          </Link>
        </div>
      </form>
    </Form>
  );
}
