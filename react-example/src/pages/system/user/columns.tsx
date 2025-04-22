import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Edit, Trash, Eye, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import type { UserResponse } from "@/services/api/api";

export function createColumns(
  onEdit: (user: UserResponse) => void,
  onDelete: (id: string) => void,
  onResetPassword: (id: string) => void,
  onView?: (id: string) => void
): ColumnDef<UserResponse>[] {
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
      accessorKey: "username",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            用户名
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="font-medium">{row.original.username}</div>
      ),
    },
    {
      accessorKey: "email",
      header: "电子邮箱",
      cell: ({ row }) => <div>{row.original.email}</div>,
    },
    {
      accessorKey: "status",
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
        const user = row.original;

        return (
          <div className="flex items-center gap-2">
            {onView && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onView(user.id)}
                title="查看"
              >
                <Eye className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(user)}
              title="编辑"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onResetPassword(user.id)}
              title="重置密码"
            >
              <Key className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(user.id)}
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
