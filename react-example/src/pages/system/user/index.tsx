import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import type { UserEntity } from "@/services/api/api"; // Assume UserEntity exists
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
import { createColumns } from "./columns"; // To be created

import AddDialog from "./add-dialog"; // To be created
import EditDialog from "./edit-dialog"; // To be created
import { toast } from "sonner";
import { SearchForm } from "./search-form"; // To be created
import type { UserSearchParams } from "./search-form"; // To be created

export default function UserManager() {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useState<UserSearchParams>({});
  const [isFiltering, setIsFiltering] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10); // Or make it configurable

  // Edit user related state
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserEntity | null>(null);

  // Delete confirmation dialog related state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  // Fetch user data using react-query
  const { data, isLoading } = useQuery({
    // Add searchParams to queryKey if API supports server-side filtering
    queryKey: ["users", currentPage, pageSize, searchParams],
    queryFn: async () => {
      // Construct API query parameters
      const queryParams = {
        page: currentPage,
        limit: pageSize,
        // Add other search params based on UserSearchParams
        username: searchParams.username || "",
        email: searchParams.email || "",
        // ... other fields
      };

      // Assume api.findManyUser exists and accepts pagination/filtering params
      const response = await api.queryUsers(queryParams);
      return response.data.data; // Adjust based on actual API response structure
    },
    // Keep previous data while fetching new data for smoother pagination
    // keepPreviousData: true, // Uncomment if using server-side pagination/filtering primarily
  });

  // Handle editing a user
  const handleEdit = (user: UserEntity) => {
    setSelectedUser(user);
    setEditDialogOpen(true);
  };

  // Handle closing the edit dialog
  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setSelectedUser(null);
  };

  // Handle deleting a user
  const handleDelete = (id: string) => {
    setUserToDelete(id);
    setDeleteDialogOpen(true);
  };

  // Confirm user deletion
  const confirmDelete = async () => {
    if (!userToDelete) return;

    try {
      // Assume api.removeUser exists
      await api.removeUser(userToDelete);
      toast.success("用户删除成功");

      // Refresh user list
      queryClient.invalidateQueries({ queryKey: ["users"] });

      // Reset state
      setUserToDelete(null);
      setDeleteDialogOpen(false);

      // Optional: Check if the deleted user was the last one on the current page
      if (data?.records?.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (error) {
      console.error("删除用户失败:", error);
      toast.error("删除用户失败");
    }
  };

  // Handle search/filtering
  const handleSearch = (params: UserSearchParams) => {
    setSearchParams(params);
    setCurrentPage(1); // Reset to the first page on new search

    // Determine if filtering is active
    setIsFiltering(
      Object.keys(params).some((key) => !!params[key as keyof UserSearchParams])
    );

    // Invalidate query to refetch data with new search params
    // This is needed if filtering/searching is done server-side
    queryClient.invalidateQueries({ queryKey: ["users"] });

    // If filtering is purely client-side (not recommended for large datasets):
    // You would filter the 'data?.records' here and update a separate state variable
    // like in the menu-manager example. For user management, server-side is better.
  };

  // Create table column definitions
  const columns = createColumns(handleEdit, handleDelete); // Pass handlers to columns

  if (isLoading && !data) return <Loading />; // Show loading only on initial load

  // Calculate total pages for pagination
  const totalRecords = data?.total || 0;
  const totalPages = Math.ceil(totalRecords / pageSize);

  // Data to display in the table
  const recordsToDisplay = data?.records || [];

  return (
    <div className="space-y-4 p-4 md:p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">用户管理</h2>
        <AddDialog />
      </div>

      {/* 查询表单 */}
      <SearchForm onSearch={handleSearch} />

      <div className="text-sm text-muted-foreground mb-4 flex justify-between items-center">
        <div>
          {isFiltering
            ? `查询结果: 共找到 ${totalRecords} 条记录`
            : `共有 ${totalRecords} 条用户记录`}
        </div>
        {/* 可以在这里添加其他操作按钮，如批量导入导出等 */}
      </div>

      {/* 数据表格 */}
      <DataTable<UserEntity, unknown>
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

            {/* Dynamically generate page links */}
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
                aria-disabled={currentPage === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
      {/* Edit User Dialog */}
      <EditDialog
        user={selectedUser}
        open={editDialogOpen}
        onClose={handleCloseEditDialog}
      />
      {/* Delete Confirmation Dialog */}
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
