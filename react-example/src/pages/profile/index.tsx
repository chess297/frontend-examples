import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Camera, Loader2 } from "lucide-react";
import { api, uploadFile } from "@/services";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAuthStore } from "@/hooks";

// 表单验证模式
const profileFormSchema = z.object({
  username: z.string().min(2, "用户名至少需要2个字符"),
  email: z.string().email("请输入有效的电子邮件地址"),
  phone: z.string().optional(),
  country_code: z.string().optional(),
  address: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

// 获取用户头像的初始值
const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

export default function Profile() {
  const { user_info } = useAuthStore();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  // 初始化表单
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: user_info?.username || "",
      email: user_info?.email || "",
      phone: user_info?.phone || "",
      country_code: user_info?.country_code || "+86",
      address: user_info?.address || "",
    },
  });

  // 当用户数据加载时更新表单
  useEffect(() => {
    if (user_info) {
      form.reset({
        username: user_info.username || "",
        email: user_info.email || "",
        phone: user_info.phone || "",
        country_code: user_info.country_code || "+86",
        address: user_info.address || "",
      });
    }
  }, [user_info, form]);

  // 保存个人资料
  const onSubmit = async (data: ProfileFormValues) => {
    if (!user_info) return;

    setIsLoading(true);
    try {
      await api.updateUserInfo({
        username: data.username,
        email: data.email,
        phone: data.phone || "",
        country_code: data.country_code || "",
        address: data.address || "",
        avatar_url: avatarUrl || user_info.avatar_url,
      });

      // 刷新用户信息
      queryClient.invalidateQueries({ queryKey: ["userInfo"] });
      toast.success("个人信息更新成功");
    } catch (error) {
      console.error("更新个人信息失败:", error);
      toast.error("更新个人信息失败");
    } finally {
      setIsLoading(false);
    }
  };

  // 处理头像上传
  const handleAvatarUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !user_info) return;

    // 验证文件类型
    if (!file.type.startsWith("image/")) {
      toast.error("请上传图片文件");
      return;
    }

    // 验证文件大小 (不超过 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("图片大小不能超过 2MB");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // 创建表单数据
      const formData = new FormData();
      formData.append("file", file);

      // 模拟上传进度
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          const newProgress = prev + Math.random() * 10;
          return newProgress > 90 ? 90 : newProgress;
        });
      }, 300);
      console.log("🚀 ~ Profile ~ formData:", formData);

      // 调用上传接口
      // 注意：根据实际API调整此处请求方式
      const response = await uploadFile(file);

      clearInterval(progressInterval);
      setUploadProgress(100);

      // 假设接口返回头像URL
      const avatarUrl = response.data?.data.avatar_url || null;
      if (avatarUrl) {
        setAvatarUrl(avatarUrl);
        toast.success("头像上传成功");
      } else {
        toast.error("头像上传成功，但未获取到URL");
      }
    } catch (error) {
      // console.error("上传头像失败:", error);
      // toast.error("上传头像失败");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  if (!user_info) {
    return (
      <div className="container mx-auto py-10">
        <AlertDialog open={true}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>需要登录</AlertDialogTitle>
              <AlertDialogDescription>
                请先登录以访问个人资料页面。
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction>确认</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="grid gap-6 lg:grid-cols-3">
        {/* 左侧用户头像卡片 */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>个人头像</CardTitle>
            <CardDescription>上传或更新您的个人头像</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <Avatar className="h-32 w-32">
              <AvatarImage src={avatarUrl || user_info.avatar_url} />
              <AvatarFallback className="text-2xl">
                {getInitials(user_info.username || "用户")}
              </AvatarFallback>
            </Avatar>

            {isUploading && (
              <div className="w-full">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-1 text-center">
                  上传中...{Math.round(uploadProgress)}%
                </p>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                className="relative"
                disabled={isUploading}
              >
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleAvatarUpload}
                  disabled={isUploading}
                />
                {isUploading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Camera className="mr-2 h-4 w-4" />
                )}
                {isUploading ? "上传中..." : "更换头像"}
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between px-6 py-4">
            <p className="text-xs text-muted-foreground">
              支持 JPG, PNG, GIF 格式，大小不超过 2MB
            </p>
          </CardFooter>
        </Card>

        {/* 右侧个人信息表单 */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>个人资料</CardTitle>
            <CardDescription>更新您的个人资料信息</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>用户名</FormLabel>
                      <FormControl>
                        <Input placeholder="请输入用户名" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>电子邮箱</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="请输入电子邮箱"
                          type="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="country_code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>国家代码</FormLabel>
                        <FormControl>
                          <Input placeholder="+86" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>电话号码</FormLabel>
                        <FormControl>
                          <Input placeholder="请输入电话号码" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>地址</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="请输入您的地址"
                          className="resize-none h-20"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="pt-4">
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        保存中...
                      </>
                    ) : (
                      "保存修改"
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      {/* 密码更改部分 */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>账户安全</CardTitle>
            <CardDescription>管理您的密码和账户安全设置</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-sm font-medium">修改密码</h4>
                <p className="text-sm text-muted-foreground">
                  定期更改密码可以提高账户安全性
                </p>
              </div>
              <Button variant="outline">修改密码</Button>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-sm font-medium">两步验证</h4>
                <p className="text-sm text-muted-foreground">
                  增加一层额外的安全保护
                </p>
              </div>
              <Button variant="outline" disabled>
                未启用
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
