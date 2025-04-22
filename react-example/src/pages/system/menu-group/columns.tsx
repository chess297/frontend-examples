import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Edit, Trash2 } from "lucide-react";
import type { MenuGroupEntity } from "@/services/api/api";

// 创建表格列定义
export function createColumns(
  onEdit: (menuGroup: MenuGroupEntity) => void,
  onDelete: (id: string) => void
): ColumnDef<MenuGroupEntity>[] {
  return [
    {
      accessorKey: "title",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="p-0 hover:bg-transparent"
          >
            菜单分组名称
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const title = row.getValue("title") as string;
        return <div className="font-medium">{title}</div>;
      },
    },
    {
      accessorKey: "icon",
      header: "图标",
      cell: ({ row }) => {
        const icon = row.getValue("icon") as string;
        return (
          <div className="flex items-center gap-2">
            {icon && <span className="text-lg">{icon}</span>}
            <span>{icon || "-"}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "description",
      header: "描述",
      cell: ({ row }) => {
        const description = row.getValue("description") as string;
        return (
          <div className="max-w-[300px] truncate" title={description}>
            {description || "-"}
          </div>
        );
      },
    },
    {
      accessorKey: "menus",
      header: "关联菜单数",
      cell: ({ row }) => {
        const menus = row.original.menus || [];
        return <div>{menus.length}</div>;
      },
    },
    {
      accessorKey: "create_at",
      header: "创建时间",
      cell: ({ row }) => {
        const createAt = row.getValue("create_at") as string;
        const formatted = createAt
          ? new Date(createAt).toLocaleString("zh-CN")
          : "-";
        return <div>{formatted}</div>;
      },
    },
    {
      id: "actions",
      header: "操作",
      cell: ({ row }) => {
        const menuGroup = row.original;
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(menuGroup)}
              className="h-8 w-8 p-0"
            >
              <Edit className="h-4 w-4" />
              <span className="sr-only">编辑</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(menuGroup.id)}
              className="h-8 w-8 p-0 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">删除</span>
            </Button>
          </div>
        );
      },
    },
  ];
}
