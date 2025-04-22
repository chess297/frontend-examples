import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import type { RoleEntity } from "@/services/api/api"; // Assume RoleEntity exists
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
// 使用公共DataTable组件
import { DataTable } from "@/components/data-table";
import { createColumns } from "./columns";

import AddDialog from "./add-dialog";
import EditDialog from "./edit-dialog";
import { toast } from "sonner";
import { SearchForm } from "./search-form";
import type { RoleSearchParams } from "./search-form";

export default function RoleManager() {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useState<RoleSearchParams>({});
  const [isFiltering, setIsFiltering] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  // 编辑角色相关状态
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<RoleEntity | null>(null);

  // 删除确认对话框相关状态
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<string | null>(null);

  // 使用react-query获取角色数据
  const { data, isLoading } = useQuery({
    queryKey: ["roles", currentPage, pageSize, searchParams],
    queryFn: async () => {
      const queryParams = {
        page: currentPage,
        limit: pageSize,
        name: searchParams.name || "",
        // 可以根据API添加更多查询参数
      };
      // 调用角色列表API
      const response = await api.roleControllerFindAllV1(queryParams);
      return response.data.data;
    },
  });

  // 处理编辑角色
  const handleEdit = (role: RoleEntity) => {
    setSelectedRole(role);
    setEditDialogOpen(true);
  };

  // 处理关闭编辑对话框
  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setSelectedRole(null);
  };

  // 处理删除角色
  const handleDelete = (id: string) => {
    setRoleToDelete(id);
    setDeleteDialogOpen(true);
  };

  // 确认删除角色
  const confirmDelete = async () => {
    if (!roleToDelete) return;

    try {
      await api.removeRole(roleToDelete);
      toast.success("角色删除成功");

      // 刷新角色列表
      queryClient.invalidateQueries({ queryKey: ["roles"] });

      // 重置状态
      setRoleToDelete(null);
      setDeleteDialogOpen(false);

      // 如果当前页只有一条记录且删除后，回到前一页
      if (data?.records?.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (error) {
      console.error("删除角色失败:", error);
      toast.error("删除角色失败");
    }
  };

  // 处理搜索
  const handleSearch = (params: RoleSearchParams) => {
    setSearchParams(params);
    setCurrentPage(1); // 重置为第一页

    // 如果有搜索参数，设置为过滤模式
    setIsFiltering(
      Object.keys(params).some((key) => !!params[key as keyof RoleSearchParams])
    );

    // 刷新角色列表
    queryClient.invalidateQueries({ queryKey: ["roles"] });
  };

  // 创建表格列定义
  const columns = createColumns(handleEdit, handleDelete);

  if (isLoading && !data) return <Loading />;

  const totalRecords = data?.total || 0;
  const totalPages = Math.ceil(totalRecords / pageSize);
  const recordsToDisplay = data?.records || [];

  return (
    <div className="space-y-4 p-4 md:p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">角色管理</h2>
        <AddDialog />
      </div>

      {/* 查询表单 */}
      <SearchForm onSearch={handleSearch} />

      <div className="text-sm text-muted-foreground mb-4 flex justify-between items-center">
        <div>
          {isFiltering
            ? `查询结果: 共找到 ${totalRecords} 条记录`
            : `共有 ${totalRecords} 条角色记录`}
        </div>
        {/* 可以在这里添加其他操作按钮，如批量导入导出等 */}
      </div>

      {/* 数据表格 */}
      <DataTable<RoleEntity, unknown>
        columns={columns}
        data={recordsToDisplay}
        isLoading={isLoading}
      />

      {/* 分页控件 */}
      {totalPages > 1 && (
        <Pagination className="justify-end mt-4">
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
                aria-disabled={currentPage === 1}
              />
            </PaginationItem>

            {/* 动态生成页码链接 */}
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(
                (page) =>
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 2 && page <= currentPage + 2)
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
            {currentPage < totalPages - 3 && totalPages > 5 && (
              <PaginationItem key="ellipsis-end">
                <PaginationEllipsis />
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
                aria-disabled={currentPage === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {/* 编辑角色对话框 */}
      <EditDialog
        role={selectedRole}
        open={editDialogOpen}
        onClose={handleCloseEditDialog}
      />

      {/* 删除确认对话框 */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              确定要删除此角色吗？此操作不可撤销。
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
