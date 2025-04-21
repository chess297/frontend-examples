import { useNavigate } from "react-router";
import { useAuthStore } from "@/hooks/use-auth-store";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, LogIn, Sparkles, Users, Code } from "lucide-react";

export default function Welcome() {
  const { is_login } = useAuthStore();
  console.log("🚀 ~ Welcome ~ is_login:", is_login);
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-12 md:py-24">
      <div className="flex flex-col items-center text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent animate-gradient">
          欢迎来到我们的平台
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
          探索无限可能，体验非凡创新，让我们一起构建未来
        </p>
      </div>

      {!is_login && (
        <Card className="mb-12 border-2 border-amber-200 dark:border-amber-900 shadow-lg welcome-card">
          <CardHeader className="bg-amber-50 dark:bg-amber-950/30 rounded-t-xl">
            <CardTitle className="flex items-center gap-2">
              <LogIn className="h-5 w-5" /> 登录提示
            </CardTitle>
            <CardDescription>
              您当前尚未登录，登录后可体验更多功能和个性化内容
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <p className="text-muted-foreground">
              登录您的账户以解锁完整的平台体验，包括个性化设置、数据同步和专属功能。
            </p>
          </CardContent>
          <CardFooter className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => navigate("/auth/signup")}>
              注册账户
            </Button>
            <Button onClick={() => navigate("/auth/signin")}>
              立即登录 <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-md transition-all welcome-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" /> 卓越功能
            </CardTitle>
            <CardDescription>探索我们提供的强大功能</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              我们提供直观的用户界面、高效的工作流程和创新的解决方案，满足您的各种需求。
            </p>
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate("/home")}
            >
              开始探索
            </Button>
          </CardFooter>
        </Card>

        <Card className="hover:shadow-md transition-all welcome-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" /> 社区协作
            </CardTitle>
            <CardDescription>加入我们的专业社区</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              与志同道合的专业人士交流，分享想法，共同创新，拓展您的职业网络。
            </p>
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate("/home")}
            >
              加入社区
            </Button>
          </CardFooter>
        </Card>

        <Card className="hover:shadow-md transition-all welcome-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5 text-primary" /> 技术支持
            </CardTitle>
            <CardDescription>获取专业的技术帮助</CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              我们的技术专家团队随时准备解答您的问题，提供及时有效的支持和解决方案。
            </p>
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate("/home")}
            >
              获取支持
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
