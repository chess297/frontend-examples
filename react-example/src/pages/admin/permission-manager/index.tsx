import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import type { PermissionEntity } from "@/services/api/api";
import { api } from "@/services";
import Loading from "@/components/loading";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { DataTable } from "@/components/data-table"; // Updated import path
import { createColumns } from "./columns";

import AddDialog from "./add-dialog";
import EditDialog from "./edit-dialog";
import { toast } from "sonner";
import { SearchForm } from "./search-form";
import type { PermissionSearchParams } from "./search-form";

export default function PermissionManager() {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useState<PermissionSearchParams>({});
  const [isFiltering, setIsFiltering] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  // 编辑权限相关状态
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedPermission, setSelectedPermission] =
    useState<PermissionEntity | null>(null);

  // 删除确认对话框相关状态
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [permissionToDelete, setPermissionToDelete] = useState<string | null>(
    null
  );

  // 使用react-query获取权限数据
  const { data, isLoading } = useQuery({
    queryKey: ["permissions", currentPage, pageSize, searchParams], // Added searchParams to queryKey
    queryFn: async () => {
      // 构建API查询参数
      const queryParams = {
        page: currentPage,
        limit: pageSize,
        name: searchParams.name || "",
        resource: searchParams.resource || "",
      };

      const response = await api.findManyPermission(queryParams);
      return response.data.data;
    },
  });

  // 处理编辑权限
  const handleEdit = (permission: PermissionEntity) => {
    setSelectedPermission(permission);
    setEditDialogOpen(true);
  };

  // 处理关闭编辑对话框
  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setSelectedPermission(null);
  };

  // 处理删除权限
  const handleDelete = (id: string) => {
    setPermissionToDelete(id);
    setDeleteDialogOpen(true);
  };

  // 确认删除权限
  const confirmDelete = async () => {
    if (!permissionToDelete) return;

    try {
      await api.removePermission(permissionToDelete);
      toast.success("权限删除成功");

      // 刷新权限列表
      queryClient.invalidateQueries({ queryKey: ["permissions"] });

      // 重置状态
      setPermissionToDelete(null);
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("删除权限失败:", error);
      toast.error("删除权限失败");
    }
  };

  // 处理搜索
  const handleSearch = (params: PermissionSearchParams) => {
    setSearchParams(params);
    setCurrentPage(1); // 重置为第一页

    // 如果有搜索参数，设置为过滤模式
    setIsFiltering(
      Object.keys(params).some(
        (key) => !!params[key as keyof PermissionSearchParams]
      )
    );

    // 刷新权限列表
    queryClient.invalidateQueries({ queryKey: ["permissions"] });
  };

  // 创建表格列定义
  const columns = createColumns(handleEdit, handleDelete);

  if (isLoading && !data) return <Loading />; // Show loading only on initial load

  // 计算总页数
  const totalRecords = data?.total || 0; // Use totalRecords for clarity
  const totalPages = Math.ceil(totalRecords / pageSize);

  // 确定要显示的数据
  const recordsToDisplay = data?.records || [];

  return (
    <div className="space-y-4 p-4 md:p-6">
      {" "}
      {/* Added consistent padding and spacing */}
      <div className="flex justify-between items-center">
        {" "}
        {/* Changed query py-2 to flex */}
        <h2 className="text-2xl font-semibold">权限管理</h2>{" "}
        {/* Consistent heading */}
        <AddDialog />
      </div>
      {/* 查询表单 */}
      <SearchForm onSearch={handleSearch} />
      <div className="text-sm text-muted-foreground mb-4 flex justify-between items-center">
        <div>
          {isFiltering
            ? `查询结果: 共找到 ${totalRecords} 条记录`
            : `共有 ${totalRecords} 条权限记录`}
        </div>
      </div>
      {/* 数据表格 */}
      <DataTable<PermissionEntity, unknown>
        columns={columns}
        data={recordsToDisplay}
        isLoading={isLoading} // Pass loading state
      />
      {/* 分页控件 */}
      {totalPages > 1 && ( // Only show pagination if more than one page
        <Pagination className="justify-end mt-4">
          {" "}
          {/* Consistent margin */}
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage > 1) setCurrentPage(currentPage - 1);
                }}
                className={
                  currentPage === 1 ? "pointer-events-none opacity-50" : ""
                }
                aria-disabled={currentPage === 1} // Added aria-disabled
              />
            </PaginationItem>

            {/* Dynamically generate page links (improved example) */}
            {/* Consider extracting pagination logic into a reusable component */}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(
                (page) =>
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 2 && page <= currentPage + 2) // Show current +/- 2 pages
              )
              .map((page, index, arr) => (
                <>
                  {index > 0 && page - arr[index - 1] > 1 && (
                    <PaginationItem key={`ellipsis-start-${page}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  )}
                  <PaginationItem key={page}>
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(page);
                      }}
                      isActive={currentPage === page}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                </>
              ))}
            {currentPage < totalPages - 3 &&
              totalPages > 5 && ( // Adjust ellipsis logic
                <PaginationItem key="ellipsis-end">
                  <PaginationEllipsis />
                </PaginationItem>
              )}
            {/* Ensure last page is shown if not already included and needed */}
            {totalPages > 1 &&
              !Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(
                  (page) =>
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 2 && page <= currentPage + 2)
                )
                .includes(totalPages) && (
                <PaginationItem key={totalPages}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPage(totalPages);
                    }}
                    isActive={currentPage === totalPages}
                  >
                    {totalPages}
                  </PaginationLink>
                </PaginationItem>
              )}

            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                }}
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : ""
                }
                aria-disabled={currentPage === totalPages} // Added aria-disabled
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
      {/* 编辑权限对话框 */}
      <EditDialog
        permission={selectedPermission}
        open={editDialogOpen}
        onClose={handleCloseEditDialog}
      />
      {/* 删除确认对话框 */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              确定要删除此权限吗？此操作不可撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90" // Consistent destructive style
            >
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
