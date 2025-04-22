import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Edit, Trash, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import type { MenuResponse } from "@/services/api/api";

// 动态图标组件
export function DynamicIcon({ name }: { name: string }) {
  return (
    <span className="flex h-6 w-6 items-center justify-center rounded-md bg-muted text-muted-foreground">
      {name.slice(0, 1).toUpperCase()}
    </span>
  );
}

export function createColumns(
  onEdit: (menu: MenuResponse) => void,
  onDelete: (id: string) => void,
  onView?: (id: string) => void
): ColumnDef<MenuResponse>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="选择所有"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="选择行"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "title",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            菜单名称
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="font-medium">{row.original.title}</div>
      ),
    },
    {
      accessorKey: "path",
      header: "路径",
      cell: ({ row }) => <div>{row.original.path}</div>,
    },
    {
      accessorKey: "icon",
      header: "图标",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <DynamicIcon name={row.original.icon} />
          <span>{row.original.icon}</span>
        </div>
      ),
    },
    {
      accessorKey: "component",
      header: "组件路径",
      cell: ({ row }) => (
        <div className="max-w-[200px] truncate" title={row.original.component}>
          {row.original.component}
        </div>
      ),
    },
    {
      accessorKey: "parent_id",
      header: "父菜单",
      cell: ({ row }) => (
        <div>
          {row.original.parent_id ? (
            <Badge variant="outline">
              {typeof row.original.parent === "object" && row.original.parent
                ? (row.original.parent as any).title
                : "未知"}
            </Badge>
          ) : (
            <Badge>顶级菜单</Badge>
          )}
        </div>
      ),
    },
    {
      id: "actions",
      header: "操作",
      cell: ({ row }) => {
        const menu = row.original;
        return (
          <div className="flex items-center gap-2">
            {onView && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onView(menu.id)}
                title="查看"
              >
                <Eye className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(menu)}
              title="编辑"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(menu.id)}
              title="删除"
            >
              <Trash className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        );
      },
    },
  ];
}
