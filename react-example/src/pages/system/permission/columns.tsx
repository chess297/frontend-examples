import { PermissionAction, type PermissionEntity } from "@/services/api/api";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";

// 创建表格列定义
export const createColumns = (
  onEdit: (permission: PermissionEntity) => void,
  onDelete: (id: string) => void
): ColumnDef<PermissionEntity, unknown>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="全选"
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
    accessorKey: "name",
    header: "权限名称",
    cell: ({ row }) => <div>{row.original.name}</div>,
  },
  {
    accessorKey: "resource",
    header: "资源名称",
    cell: ({ row }) => <div>{row.original.resource}</div>,
  },
  {
    accessorKey: "description",
    header: "权限描述",
    cell: ({ row }) => (
      <div className="max-w-[300px] truncate" title={row.original.description}>
        {row.original.description}
      </div>
    ),
  },
  {
    accessorKey: "actions",
    header: "操作权限",
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1">
        {row.original.actions.map((action) => (
          <Badge key={action} variant="outline" className="text-xs">
            {getActionLabel(action)}
          </Badge>
        ))}
      </div>
    ),
  },
  {
    id: "actions-2",
    header: "操作",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onEdit(row.original)}
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(row.original.id)}
        >
          <Trash className="h-4 w-4 text-destructive" />
        </Button>
      </div>
    ),
  },
];

// 显示权限操作的中文标签
function getActionLabel(action: string): string {
  switch (action) {
    case PermissionAction.Create:
      return "创建";
    case PermissionAction.Read:
      return "读取";
    case PermissionAction.Update:
      return "更新";
    case PermissionAction.Delete:
      return "删除";
    case PermissionAction.Manage:
      return "管理";
    default:
      return action;
  }
}
