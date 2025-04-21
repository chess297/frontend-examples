import { ColumnDef } from "@tanstack/react-table";
import type { UserEntity } from "@/services/api/api";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash } from "lucide-react";

export const createColumns = (
  onEdit: (user: UserEntity) => void,
  onDelete: (id: string) => void
): ColumnDef<UserEntity>[] => {
  // Define columns based on UserEntity properties
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
      header: "用户名",
      cell: ({ row }) => {
        const name = row.original.name;
        return <span className="font-medium">{name}</span>;
      },
    },
    {
      accessorKey: "email",
      header: "邮箱",
      cell: ({ row }) => {
        const email = row.original.email;
        return <span className="text-muted-foreground">{email || "-"}</span>;
      },
    },
    {
      accessorKey: "nickname",
      header: "昵称",
      cell: ({ row }) => {
        return row.original.nickname || "-";
      },
    },
    {
      accessorKey: "roles",
      header: "角色",
      cell: ({ row }) => {
        const roles = row.original.roles || [];
        return roles.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {roles.length > 3 ? (
              <>
                {roles.slice(0, 3).map((role, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {typeof role === "string" ? role : role.name}
                  </Badge>
                ))}
                <Badge variant="secondary" className="text-xs">
                  +{roles.length - 3}
                </Badge>
              </>
            ) : (
              roles.map((role, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  {typeof role === "string" ? role : role.name}
                </Badge>
              ))
            )}
          </div>
        ) : (
          <span className="text-muted-foreground text-sm">无角色</span>
        );
      },
    },
    {
      accessorKey: "status",
      header: "状态",
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <Badge variant={status === "active" ? "success" : "destructive"}>
            {status === "active" ? "启用" : "禁用"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "创建时间",
      cell: ({ row }) => {
        const date = row.original.createdAt;
        if (!date) return "-";
        return new Date(date).toLocaleString("zh-CN", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        });
      },
    },
    {
      id: "actions",
      header: "操作",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex items-center gap-2">
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
};
