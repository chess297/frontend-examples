import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { ConfigTable } from "@/components/system-config/table-config/config-table";
import { createColumns } from "./columns";
import AddUserDialog from "./add-dialog";
import EditUserDialog from "./edit-dialog";
import ResetPasswordDialog from "./reset-password-dialog";
import { UserSearchForm } from "./search-form";
import * as api from "./api";
import type { UserSearchParams } from "./api";
import type { UserEntity } from "@/services/api/api";
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

export default function UserManager() {
  const queryClient = useQueryClient();

  // 搜索相关状态
  const [searchParams, setSearchParams] = useState<UserSearchParams>({});
  const [isFiltering, setIsFiltering] = useState(false);
  const [filteredData, setFilteredData] = useState<UserEntity[]>([]);

  // 分页相关状态
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  // 编辑和删除相关状态
  const [selectedUser, setSelectedUser] = useState<UserEntity | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  // 重置密码相关状态
  const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false);
  const [userToResetPassword, setUserToResetPassword] =
    useState<UserEntity | null>(null);

  // 使用react-query获取用户数据
  const { data, isLoading } = useQuery({
    queryKey: ["users", currentPage, pageSize],
    queryFn: async () => {
      const queryParams = {
        page: currentPage,
        limit: pageSize,
        username: searchParams.username || "",
        email: searchParams.email || "",
      };

      return await api.getList(queryParams);
    },
  });

  // 处理编辑用户
  const handleEdit = (user: UserEntity) => {
    setSelectedUser(user);
    setEditDialogOpen(true);
  };

  // 处理关闭编辑对话框
  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setSelectedUser(null);
  };

  // 处理重置密码
  const handleResetPassword = (id: string) => {
    const user = data?.records.find((user) => user.id === id);
    if (user) {
      setUserToResetPassword(user);
      setResetPasswordDialogOpen(true);
    }
  };

  // 处理关闭重置密码对话框
  const handleCloseResetPasswordDialog = () => {
    setResetPasswordDialogOpen(false);
    setUserToResetPassword(null);
  };

  // 处理删除用户
  const handleDelete = (id: string) => {
    setUserToDelete(id);
    setDeleteDialogOpen(true);
  };

  // 确认删除用户
  const confirmDelete = async () => {
    if (!userToDelete) return;

    try {
      await api.remove(userToDelete);
      toast.success("用户删除成功");

      // 刷新用户列表
      queryClient.invalidateQueries({ queryKey: ["users"] });

      // 重置状态
      setUserToDelete(null);
      setDeleteDialogOpen(false);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "删除用户失败，请重试";
      toast.error(errorMessage);
    }
  };

  // 处理搜索
  const handleSearch = (params: UserSearchParams) => {
    setSearchParams(params);
    setCurrentPage(1); // 重置为第一页

    // 检查是否有搜索条件
    const hasFilters = Object.values(params).some((value) => !!value);
    setIsFiltering(hasFilters);

    if (!hasFilters) {
      setFilteredData([]);
      return;
    }

    // 客户端筛选数据（如果需要可改为服务端筛选）
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
  const columns = createColumns(handleEdit, handleDelete, handleResetPassword);

  // 加载状态
  if (isLoading && !data) return <Loading />;

  // 确定表格数据和分页信息
  const recordsToDisplay = isFiltering ? filteredData : data?.records || [];
  const totalRecords = isFiltering ? filteredData.length : data?.total || 0;
  const totalPages = Math.ceil(totalRecords / pageSize);

  return (
    <div className="space-y-4 p-4 md:p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">用户管理</h2>
        <AddUserDialog />
      </div>

      {/* 查询表单 */}
      <UserSearchForm onSearch={handleSearch} />

      {/* 表格信息提示 */}
      <div className="text-sm text-muted-foreground mb-4">
        {isFiltering
          ? `查询结果: 共找到 ${totalRecords} 条记录`
          : `共有 ${totalRecords} 条用户记录`}
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
        searchKey="username"
        searchPlaceholder="搜索用户名..."
        onPageChange={handlePageChange}
      />

      {/* 编辑用户对话框 */}
      {selectedUser && (
        <EditUserDialog
          user={selectedUser}
          open={editDialogOpen}
          onClose={handleCloseEditDialog}
        />
      )}

      {/* 重置密码对话框 */}
      {userToResetPassword && (
        <ResetPasswordDialog
          userId={userToResetPassword.id}
          username={userToResetPassword.username}
          open={resetPasswordDialogOpen}
          onClose={handleCloseResetPasswordDialog}
        />
      )}

      {/* 删除确认对话框 */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              确定要删除此用户吗？此操作不可撤销。
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
