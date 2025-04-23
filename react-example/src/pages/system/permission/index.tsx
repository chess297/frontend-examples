import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { ConfigTable } from "@/components/system-config/table-config/config-table";
import { createColumns } from "./columns";
import AddDialog from "./add-dialog";
import EditDialog from "./edit-dialog";
import { PermissionSearchForm } from "./search-form";
import * as api from "./api";
import type { PermissionSearchParams } from "./api";
import type { PermissionEntity } from "@/services/api/api";
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
import { Button } from "@/components/ui/button";

export default function PermissionManager() {
  const queryClient = useQueryClient();

  // 搜索相关状态
  const [searchParams, setSearchParams] = useState<PermissionSearchParams>({});
  const [isFiltering, setIsFiltering] = useState(false);
  const [filteredData, setFilteredData] = useState<PermissionEntity[]>([]);

  // 分页相关状态
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  // 编辑和删除相关状态
  const [selectedPermission, setSelectedPermission] =
    useState<PermissionEntity | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [permissionToDelete, setPermissionToDelete] = useState<string | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);

  // 使用react-query获取权限数据
  const { data, isLoading } = useQuery({
    queryKey: ["permissions", currentPage, pageSize],
    queryFn: async () => {
      const queryParams = {
        page: currentPage,
        limit: pageSize,
        name: searchParams.name || "",
        resource: searchParams.resource || "",
      };

      return await api.getList(queryParams);
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
    if (!permissionToDelete) return false;

    setIsDeleting(true);

    return api
      .remove(permissionToDelete)
      .then(() => {
        toast.success("权限删除成功");
        // 刷新权限列表
        queryClient.invalidateQueries({ queryKey: ["permissions"] });
        // 重置状态
        setPermissionToDelete(null);
        return true; // 返回成功状态，对话框可关闭
      })
      .catch((error) => {
        const errorMessage =
          error instanceof Error ? error.message : "删除权限失败，请重试";
        toast.error(errorMessage);
        return false; // 返回失败状态，对话框不关闭
      })
      .finally(() => {
        setIsDeleting(false);
      });
  };

  // 处理搜索
  const handleSearch = (params: PermissionSearchParams) => {
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
        <h2 className="text-2xl font-semibold">权限管理</h2>
        <AddDialog />
      </div>

      {/* 查询表单 */}
      <PermissionSearchForm onSearch={handleSearch} />

      {/* 表格信息提示 */}
      <div className="text-sm text-muted-foreground mb-4">
        {isFiltering
          ? `查询结果: 共找到 ${totalRecords} 条记录`
          : `共有 ${totalRecords} 条权限记录`}
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
        searchPlaceholder="搜索权限名称..."
        onPageChange={handlePageChange}
      />

      {/* 编辑权限对话框 */}
      {selectedPermission && (
        <EditDialog
          permission={selectedPermission}
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
              确定要删除此权限吗？此操作不可撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>取消</AlertDialogCancel>
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
