import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Edit, Trash, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import type { RoleResponse } from "@/services/api/api";

export function createColumns(
  onEdit: (role: RoleResponse) => void,
  onDelete: (id: string) => void,
  onView?: (id: string) => void
): ColumnDef<RoleResponse>[] {
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
            角色名称
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div className="font-medium">{row.original.name}</div>,
    },
    {
      accessorKey: "description",
      header: "角色描述",
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
      accessorKey: "is_active",
      header: "状态",
      cell: ({ row }) => {
        const status = row.original.is_active;
        return status ? (
          <Badge variant="default">启用</Badge>
        ) : (
          <Badge variant="secondary">禁用</Badge>
        );
      },
    },
    {
      accessorKey: "create_at",
      header: "创建时间",
      cell: ({ row }) => {
        const date = row.original.create_at
          ? new Date(row.original.create_at)
          : null;
        return date ? <div>{date.toLocaleString()}</div> : <div>-</div>;
      },
    },
    {
      id: "actions",
      header: "操作",
      cell: ({ row }) => {
        const role = row.original;

        return (
          <div className="flex items-center gap-2">
            {onView && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onView(role.id)}
                title="查看"
              >
                <Eye className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(role)}
              title="编辑"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(role.id)}
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
