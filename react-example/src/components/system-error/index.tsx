import { useGlobalStore } from "@/hooks/use-global-store";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";
import { useEffect } from "react";

export const SystemErrorOverlay: React.FC = () => {
  const { error, clearError } = useGlobalStore();

  const handleReload = () => {
    clearError();
    window.location.reload();
  };

  // 当组件挂载时，添加全局错误捕获
  useEffect(() => {
    const handleGlobalError = (event: ErrorEvent) => {
      useGlobalStore.getState().setError(`发生了系统错误: ${event.message}`);
      event.preventDefault();
    };

    // 添加全局错误监听
    window.addEventListener("error", handleGlobalError);

    // 添加未处理的Promise错误监听
    // const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
    //   useGlobalStore
    //     .getState()
    //     .setError(`未处理的Promise错误: ${event.reason}`);
    // };

    // window.addEventListener("unhandledrejection", handleUnhandledRejection);

    return () => {
      window.removeEventListener("error", handleGlobalError);
      //   window.removeEventListener(
      //     "unhandledrejection",
      //     handleUnhandledRejection
      //   );
    };
  }, []);

  if (!error) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-4">
      <div className="bg-card border shadow-lg rounded-lg max-w-md w-full p-6 animate-in fade-in-50 zoom-in-95">
        <div className="flex items-center gap-3 mb-4 text-destructive">
          <AlertCircle className="h-7 w-7" />
          <h2 className="text-xl font-semibold">系统异常</h2>
        </div>

        <div className="bg-muted/50 rounded-md p-4 mb-6 text-muted-foreground break-all overflow-auto max-h-60">
          {error}
        </div>

        <div className="flex flex-col gap-3">
          <Button onClick={handleReload} className="w-full" variant="default">
            <RefreshCw className="mr-2 h-4 w-4" />
            重新加载页面
          </Button>

          <Button onClick={clearError} variant="outline" className="w-full">
            关闭此提示
          </Button>
        </div>
      </div>
    </div>
  );
};
