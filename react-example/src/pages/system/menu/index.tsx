import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

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

import { DataTable } from "@/components/data-table"; // Updated import path

import { createColumns } from "./columns";

import AddDialog from "./add-dialog";
import { toast } from "sonner";
import type { Row, Column } from "@tanstack/react-table";
import { SearchForm, type MenuSearchParams } from "./search-form";
import type { MenuResponse } from "@/services/api/api";

export default function MenuManager() {
  const queryClient = useQueryClient();
  const [filteredData, setFilteredData] = useState<MenuResponse[]>([]);
  const [searchParams, setSearchParams] = useState<MenuSearchParams>({});
  const [isFiltering, setIsFiltering] = useState(false);

  // 使用react-query获取菜单数据
  const { data, isLoading } = useQuery({
    queryKey: ["menus"],
    queryFn: async () => {
      const response = await api.findManyMenu();
      return response.data.data;
    },
  });

  // 处理单元格编辑保存
  const handleSaveCell = async (
    row: Row<MenuResponse>,
    column: Column<MenuResponse, unknown>,
    value: string
  ) => {
    try {
      const menu = row.original;
      const columnId = column.id;

      // 根据列ID更新相应的菜单属性
      const updatedMenu = {
        ...menu,
      };

      // 根据列ID更新相应的属性
      switch (columnId) {
        case "title":
          updatedMenu.title = value;
          break;
        case "path":
          updatedMenu.path = value;
          break;
        case "icon":
          updatedMenu.icon = value;
          break;
        case "component":
          updatedMenu.component = value;
          break;
        default:
          break;
      }

      // 调用API更新菜单
      const response = await api.updateMenu(menu.id, updatedMenu);

      if (response.status === 200) {
        toast.success(
          `成功更新菜单${columnId === "title" ? `: ${value}` : ""}`
        );
        // 刷新菜单列表数据
        queryClient.invalidateQueries({ queryKey: ["menus"] });
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "更新菜单失败";
      toast.error(errorMessage);
    }
  };

  // 处理搜索
  const handleSearch = (params: MenuSearchParams) => {
    setSearchParams(params);

    // 如果所有字段为空，显示全部数据
    if (Object.keys(params).length === 0) {
      setIsFiltering(false);
      return;
    }

    setIsFiltering(true);

    // 客户端筛选数据
    const allRecords = data?.records || [];
    const filtered = allRecords.filter((menu) => {
      // 检查每个筛选条件
      return Object.entries(params).every(([key, value]) => {
        if (!value) return true; // 忽略空值

        // 根据不同字段进行模糊匹配
        switch (key) {
          case "title":
            return menu.title.toLowerCase().includes(value.toLowerCase());
          case "path":
            return menu.path.toLowerCase().includes(value.toLowerCase());
          case "icon":
            return menu.icon.toLowerCase().includes(value.toLowerCase());
          case "component":
            return menu.component.toLowerCase().includes(value.toLowerCase());
          default:
            return true;
        }
      });
    });

    setFilteredData(filtered);
  };

  // 创建表格列定义
  const columns = createColumns(handleSaveCell);

  if (isLoading) return <Loading />;

  // 确定要显示的数据
  const recordsToDisplay = isFiltering ? filteredData : data?.records || [];

  return (
    <div className="space-y-4 p-4 md:p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">菜单管理</h2>
        <AddDialog />
      </div>

      {/* 查询表单 */}
      <SearchForm onSearch={handleSearch} />

      <div className="text-sm text-muted-foreground mb-4 flex justify-between items-center">
        <div>
          {isFiltering
            ? `查询结果: 共找到 ${recordsToDisplay.length} 条记录`
            : `共有 ${data?.records?.length || 0} 条菜单记录`}
          {!isFiltering && (
            <span className="ml-4">提示: 双击单元格可以直接编辑菜单项</span>
          )}
        </div>
        {/* 可以在这里添加其他操作按钮，如批量导入导出等 */}
      </div>

      {/* 数据表格 */}
      <DataTable<MenuResponse, unknown>
        columns={columns}
        data={recordsToDisplay}
        isLoading={isLoading}
      />

      <Pagination className="justify-end mt-5">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
