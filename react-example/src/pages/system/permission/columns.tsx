import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Edit, Trash, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import type { PermissionEntity } from "@/services/api/api";

export function createColumns(
  onEdit: (permission: PermissionEntity) => void,
  onDelete: (id: string) => void,
  onView?: (id: string) => void
): ColumnDef<PermissionEntity>[] {
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
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            权限名称
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div className="font-medium">{row.original.name}</div>,
    },
    {
      accessorKey: "resource",
      header: "资源标识",
      cell: ({ row }) => (
        <div className="max-w-[200px] truncate" title={row.original.resource}>
          {row.original.resource}
        </div>
      ),
    },
    {
      accessorKey: "action",
      header: "操作类型",
      cell: ({ row }) =>
        row.original.actions.map((action) => (
          <Badge variant="outline" key={action}>
            {action}
          </Badge>
        )),
    },
    {
      accessorKey: "description",
      header: "描述",
      cell: ({ row }) => (
        <div
          className="max-w-[300px] truncate"
          title={row.original.description || ""}
        >
          {row.original.description || (
            <span className="text-muted-foreground">无描述</span>
          )}
        </div>
      ),
    },
    {
      id: "actions",
      header: "操作",
      cell: ({ row }) => {
        const permission = row.original;

        return (
          <div className="flex items-center gap-2">
            {onView && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onView(permission.id)}
                title="查看"
              >
                <Eye className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(permission)}
              title="编辑"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(permission.id)}
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
