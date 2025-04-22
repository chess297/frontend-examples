import { useState } from "react";
import { toast } from "sonner";
import { Camera, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Button } from "./button";
import { api } from "@/services";

interface AvatarUploadProps {
  userId: string;
  currentAvatarUrl?: string | null;
  userName?: string;
  size?: "sm" | "md" | "lg";
  onAvatarChange?: (url: string) => void;
}

// 获取用户头像的初始值
const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

// 获取头像尺寸
const getSizeClass = (size: "sm" | "md" | "lg") => {
  switch (size) {
    case "sm":
      return "h-16 w-16";
    case "lg":
      return "h-32 w-32";
    case "md":
    default:
      return "h-24 w-24";
  }
};

export function AvatarUpload({
  userId,
  currentAvatarUrl,
  userName = "用户",
  size = "md",
  onAvatarChange,
}: AvatarUploadProps) {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(
    currentAvatarUrl || null
  );

  // 处理头像上传
  const handleAvatarUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !userId) return;

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
      formData.append("userId", userId);
      formData.append("type", "avatar");

      // 模拟上传进度
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          const newProgress = prev + Math.random() * 10;
          return newProgress > 90 ? 90 : newProgress;
        });
      }, 300);

      // 调用上传接口
      // 注意：根据实际API调整此处请求方式
      const response = await api.http.request({
        path: "/api/v1/upload/avatar",
        method: "POST",
        body: formData,
        type: "multipart/form-data",
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      // 假设接口返回头像URL
      const newAvatarUrl = response.data?.url || null;
      if (newAvatarUrl) {
        setAvatarUrl(newAvatarUrl);
        if (onAvatarChange) {
          onAvatarChange(newAvatarUrl);
        }
        toast.success("头像上传成功");
      } else {
        toast.error("头像上传成功，但未获取到URL");
      }
    } catch (error) {
      console.error("上传头像失败:", error);
      toast.error("上传头像失败");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Avatar className={getSizeClass(size)}>
        <AvatarImage src={avatarUrl || currentAvatarUrl || ""} />
        <AvatarFallback className={size === "lg" ? "text-2xl" : "text-lg"}>
          {getInitials(userName)}
        </AvatarFallback>
      </Avatar>

      {isUploading && (
        <div className="w-full">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full"
              style={{ width: `${uploadProgress}%` }}
            ></div>
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
          size="sm"
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
        <p className="text-xs text-muted-foreground text-center">
          支持 JPG, PNG, GIF 格式
          <br />
          大小不超过 2MB
        </p>
      </div>
    </div>
  );
}
