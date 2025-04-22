import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { ConfigTable } from "@/components/system-config/table-config/config-table";
import { createColumns } from "./columns";
import AddMenuDialog from "./add-dialog";
import { MenuSearchForm } from "./search-form";
import * as api from "./api";
import type { MenuSearchParams } from "./api";
import Loading from "@/components/loading";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import type { MenuResponse } from "@/services/api/api";

export default function MenuManager() {
  const queryClient = useQueryClient();

  // 搜索相关状态
  const [searchParams, setSearchParams] = useState<MenuSearchParams>({});
  const [isFiltering, setIsFiltering] = useState(false);
  const [filteredData, setFilteredData] = useState<MenuResponse[]>([]);

  // 分页相关状态
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  // 删除确认对话框相关状态
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [menuIdToDelete, setMenuIdToDelete] = useState<string | null>(null);

  // 使用react-query获取菜单数据
  const { data, isLoading } = useQuery({
    queryKey: ["menus", currentPage, pageSize],
    queryFn: async () => {
      const params = {
        page: currentPage,
        limit: pageSize,
      };
      return await api.getList(params);
    },
  });

  // 处理菜单编辑
  const handleEdit = (menu: MenuResponse) => {
    // 编辑操作由 EditMenuDialog 组件处理
    // 此处无需额外逻辑
  };

  // 处理菜单删除
  const handleDelete = (id: string) => {
    setMenuIdToDelete(id);
    setDeleteDialogOpen(true);
  };

  // 确认删除菜单
  const confirmDelete = async () => {
    if (!menuIdToDelete) return;

    try {
      await api.remove(menuIdToDelete);
      toast.success("菜单删除成功");

      // 重新获取菜单列表
      queryClient.invalidateQueries({ queryKey: ["menus"] });

      // 重置状态
      setMenuIdToDelete(null);
      setDeleteDialogOpen(false);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "删除菜单失败，请重试";
      toast.error(errorMessage);
    }
  };

  // 处理搜索
  const handleSearch = (params: MenuSearchParams) => {
    setSearchParams(params);

    // 检查是否有搜索条件
    const hasFilters = Object.values(params).some((value) => !!value);
    setIsFiltering(hasFilters);

    if (!hasFilters) {
      setFilteredData([]);
      return;
    }

    // 客户端筛选数据 (如果需要可改为服务端筛选)
    if (data?.records) {
      const filtered = api.filterData(data.records, params);
      setFilteredData(filtered);
    }
  };

  // 处理页码变化
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // 创建表格列定义
  const columns = createColumns(handleEdit, handleDelete);

  // 加载状态
  if (isLoading && !data) return <Loading />;

  // 确定表格数据和分页信息
  const recordsToDisplay = isFiltering ? filteredData : data?.records || [];
  const totalRecords = isFiltering ? filteredData.length : data?.total || 0;
  const totalPages = Math.ceil(totalRecords / pageSize);

  return (
    <div className="space-y-4 p-4 md:p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">菜单管理</h2>
        <AddMenuDialog />
      </div>

      {/* 搜索表单 */}
      <MenuSearchForm onSearch={handleSearch} />

      {/* 表格信息提示 */}
      <div className="text-sm text-muted-foreground">
        {isFiltering
          ? `搜索结果: 共找到 ${filteredData.length} 条记录`
          : `共有 ${data?.total || 0} 条菜单记录`}
      </div>

      {/* 数据表格 */}
      <ConfigTable
        columns={columns}
        data={recordsToDisplay}
        isLoading={isLoading}
        currentPage={currentPage}
        pageSize={pageSize}
        totalItems={totalRecords}
        totalPages={totalPages}
        searchKey="title"
        searchPlaceholder="搜索菜单名称..."
        onPageChange={handlePageChange}
      />

      {/* 删除确认对话框 */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              确定要删除此菜单吗？此操作不可撤销，可能会影响系统功能。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
