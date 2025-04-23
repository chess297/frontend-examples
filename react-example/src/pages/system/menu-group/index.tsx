import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { ConfigTable } from "@/components/system-config/table-config/config-table";
import { createColumns } from "./columns";
import AddMenuGroupDialog from "./add-dialog";
import { MenuGroupSearchForm } from "./search-form";
import EditMenuGroupDialog from "./edit-dialog";
import * as api from "./api";
import type { MenuGroupSearchParams } from "./api";
import type { MenuGroupEntity } from "@/services/api/api";
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

export default function MenuGroupManager() {
  const queryClient = useQueryClient();

  // 搜索相关状态
  const [searchParams, setSearchParams] = useState<MenuGroupSearchParams>({});
  const [isFiltering, setIsFiltering] = useState(false);
  const [filteredData, setFilteredData] = useState<MenuGroupEntity[]>([]);

  // 分页相关状态
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  // 编辑和删除相关状态
  const [selectedMenuGroup, setSelectedMenuGroup] =
    useState<MenuGroupEntity | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [menuGroupToDelete, setMenuGroupToDelete] = useState<string | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);

  // 使用react-query获取菜单分组数据
  const { data, isLoading } = useQuery({
    queryKey: ["menuGroups", currentPage, pageSize, searchParams.title],
    queryFn: async () => {
      const queryParams = {
        page: currentPage,
        limit: pageSize,
        title: searchParams.title || "",
      };

      return await api.getList(queryParams);
    },
  });

  // 处理编辑菜单分组
  const handleEdit = (menuGroup: MenuGroupEntity) => {
    setSelectedMenuGroup(menuGroup);
    setEditDialogOpen(true);
  };

  // 处理关闭编辑对话框
  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setSelectedMenuGroup(null);
  };

  // 处理删除菜单分组
  const handleDelete = (id: string) => {
    setMenuGroupToDelete(id);
    setDeleteDialogOpen(true);
  };

  // 确认删除菜单分组
  const confirmDelete = async () => {
    if (!menuGroupToDelete) return false;

    setIsDeleting(true);

    return api
      .remove(menuGroupToDelete)
      .then(() => {
        toast.success("菜单分组删除成功");
        // 刷新菜单分组列表
        queryClient.invalidateQueries({ queryKey: ["menuGroups"] });
        // 重置状态
        setMenuGroupToDelete(null);
        return true; // 返回成功状态，对话框可关闭
      })
      .finally(() => {
        setIsDeleting(false);
      });
  };

  // 处理搜索
  const handleSearch = (params: MenuGroupSearchParams) => {
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
        <h2 className="text-2xl font-semibold">菜单分组管理</h2>
        <AddMenuGroupDialog />
      </div>

      {/* 查询表单 */}
      <MenuGroupSearchForm onSearch={handleSearch} />

      {/* 表格信息提示 */}
      <div className="text-sm text-muted-foreground mb-4">
        {isFiltering
          ? `查询结果: 共找到 ${totalRecords} 条记录`
          : `共有 ${totalRecords} 条菜单分组记录`}
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
        searchPlaceholder="搜索分组名称..."
        onPageChange={handlePageChange}
      />

      {/* 编辑菜单分组对话框 */}
      {selectedMenuGroup && (
        <EditMenuGroupDialog
          menuGroup={selectedMenuGroup}
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
              确定要删除此菜单分组吗？此操作不可撤销，可能会影响关联的菜单。
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
