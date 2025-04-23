import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { ConfigTable } from "@/components/system-config/table-config/config-table";
import { createColumns } from "./columns";
import AddRoleDialog from "./add-dialog";
import EditRoleDialog from "./edit-dialog";
import { RoleSearchForm } from "./search-form";
import * as api from "./api";
import type { RoleSearchParams } from "./api";
import Loading from "@/components/loading";
import { Button } from "@/components/ui/button";
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
import type { RoleResponse } from "@/services/api/api";

export default function RoleManager() {
  const queryClient = useQueryClient();

  // 搜索相关状态
  const [searchParams, setSearchParams] = useState<RoleSearchParams>({});
  const [isFiltering, setIsFiltering] = useState(false);
  const [filteredData, setFilteredData] = useState<RoleResponse[]>([]);

  // 分页相关状态
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  // 编辑和删除相关状态
  const [selectedRole, setSelectedRole] = useState<RoleResponse | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [roleIdToDelete, setRoleIdToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // 使用react-query获取角色数据
  const { data, isLoading } = useQuery({
    queryKey: ["roles", currentPage, pageSize],
    queryFn: async () => {
      const params = {
        page: currentPage,
        limit: pageSize,
      };
      return await api.getList(params);
    },
  });

  // 处理角色编辑
  const handleEdit = (role: RoleResponse) => {
    setSelectedRole(role);
    setEditDialogOpen(true);
  };

  // 处理关闭编辑对话框
  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setSelectedRole(null);
  };

  // 处理角色删除
  const handleDelete = (id: string) => {
    setRoleIdToDelete(id);
    setDeleteDialogOpen(true);
  };

  // 确认删除角色
  const confirmDelete = async () => {
    if (!roleIdToDelete) return false;

    setIsDeleting(true);

    return api
      .remove(roleIdToDelete)
      .then(() => {
        toast.success("角色删除成功");
        // 重新获取角色列表
        queryClient.invalidateQueries({ queryKey: ["roles"] });
        // 重置状态
        setRoleIdToDelete(null);
        return true; // 返回成功状态，对话框可关闭
      })
      .catch((error) => {
        const errorMessage =
          error instanceof Error ? error.message : "删除角色失败，请重试";
        toast.error(errorMessage);
        return false; // 返回失败状态，对话框不关闭
      })
      .finally(() => {
        setIsDeleting(false);
      });
  };

  // 处理搜索
  const handleSearch = (params: RoleSearchParams) => {
    setSearchParams(params);

    // 检查是否有搜索条件
    const hasFilters = Object.values(params).some((value) => !!value);
    setIsFiltering(hasFilters);

    if (!hasFilters) {
      setFilteredData([]);
      return;
    }

    // 客户端筛选数据
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
        <h2 className="text-2xl font-semibold">角色管理</h2>
        <AddRoleDialog />
      </div>

      {/* 搜索表单 */}
      <RoleSearchForm onSearch={handleSearch} />

      {/* 表格信息提示 */}
      <div className="text-sm text-muted-foreground">
        {isFiltering
          ? `搜索结果: 共找到 ${filteredData.length} 条记录`
          : `共有 ${data?.total || 0} 条角色记录`}
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
        searchKey="name"
        searchPlaceholder="搜索角色名称..."
        onPageChange={handlePageChange}
      />

      {/* 编辑角色对话框 */}
      {selectedRole && (
        <EditRoleDialog
          role={selectedRole}
          open={editDialogOpen}
          onClose={handleCloseEditDialog}
        />
      )}

      {/* 删除确认对话框 */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              确定要删除此角色吗？此操作不可撤销，可能会影响已分配此角色的用户。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <Button
              variant="destructive"
              onClick={async (event) => {
                event.preventDefault();
                const success = await confirmDelete();
                // 只有成功时才关闭对话框
                if (success) {
                  setDeleteDialogOpen(false);
                }
              }}
              disabled={isDeleting}
            >
              {isDeleting ? "删除中..." : "删除"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
