import { AppSidebar } from "@/components/sidebar/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useLocation } from "react-router";
import { Outlet } from "react-router";
import { useMemo } from "react";
import type { ReactNode } from "react";
import { useAuthStore } from "@/hooks";

export default function HomeLayout() {
  const location = useLocation();
  const { menus } = useAuthStore();

  // 根据当前路径生成面包屑项
  const breadcrumbItems = useMemo(() => {
    const pathSegments = location.pathname.split("/").filter(Boolean);

    // 如果是根路径，不显示面包屑
    if (pathSegments.length === 0) {
      return null;
    }

    // 生成面包屑项
    const items: ReactNode[] = [];
    let currentPath = "";
    const pathSegmentsToProcess = [...pathSegments];

    // 处理每个路径段
    pathSegmentsToProcess.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === pathSegmentsToProcess.length - 1;

      // 查找对应的菜单项来获取标题
      const menuItem = menus.find((menu) => menu.path === currentPath);
      const title = menuItem ? menuItem.title : segment;

      // 检查路径是否有效
      const isValidPath = !!menus.find((menu) => menu.path === currentPath);

      items.push(
        <BreadcrumbItem key={segment}>
          {isLast || !isValidPath ? (
            <BreadcrumbPage>{title}</BreadcrumbPage>
          ) : (
            <BreadcrumbLink href={currentPath}>{title}</BreadcrumbLink>
          )}
        </BreadcrumbItem>
      );

      // 添加分隔符（最后一项后不加）
      if (!isLast) {
        items.push(<BreadcrumbSeparator key={`${segment}-separator`} />);
      }
    });

    return items;
  }, [location.pathname, menus]);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="overflow-hidden">
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            {breadcrumbItems && (
              <Breadcrumb>
                <BreadcrumbList>{breadcrumbItems}</BreadcrumbList>
              </Breadcrumb>
            )}
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0 overflow-hidden">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
