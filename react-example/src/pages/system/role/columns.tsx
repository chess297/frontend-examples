import { ColumnDef } from "@tanstack/react-table";
import type { RoleEntity } from "@/services/api/api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react"; // 引入图标
import { Checkbox } from "@/components/ui/checkbox";
import { EditableCell } from "@/components/data-table/editable-cell";

export const createColumns = (
  onEdit: (role: RoleEntity) => void,
  onDelete: (id: string) => void,
  onSaveCell?: (
    id: string,
    field: keyof RoleEntity,
    value: any
  ) => Promise<void>
): ColumnDef<RoleEntity>[] => {
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
      header: "角色名称",
      cell: ({ row }) => {
        const id = row.original.id;
        const name = row.original.name;

        if (!onSaveCell) {
          return <span className="font-medium">{name}</span>;
        }

        return (
          <EditableCell
            value={name}
            row={row.original}
            column={{ id: "name" }}
            onSave={(value) => onSaveCell(id, "name", value)}
          />
        );
      },
    },
    {
      accessorKey: "description",
      header: "描述",
      cell: ({ row }) => {
        const id = row.original.id;
        const description = row.original.description || "";

        if (!onSaveCell) {
          return (
            <div className="max-w-[300px] truncate" title={description}>
              {description || "-"}
            </div>
          );
        }

        return (
          <EditableCell
            value={description}
            row={row.original}
            column={{ id: "description" }}
            onSave={(value) => onSaveCell(id, "description", value)}
          />
        );
      },
    },
    {
      accessorKey: "permissions",
      header: "权限",
      cell: ({ row }) => {
        const permissions = row.original.permissions || [];
        // 显示权限数量和部分权限名称
        return permissions.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {permissions.length > 3 ? (
              <>
                {permissions.slice(0, 3).map((perm, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {typeof perm === "string" ? perm : perm.name}
                  </Badge>
                ))}
                <Badge variant="outline" className="text-xs">
                  +{permissions.length - 3} more
                </Badge>
              </>
            ) : (
              permissions.map((perm, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  {typeof perm === "string" ? perm : perm.name}
                </Badge>
              ))
            )}
          </div>
        ) : (
          <span className="text-gray-400">No permissions</span>
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
        const role = row.original;
        return (
          <div className="flex items-center gap-2">
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
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        );
      },
    },
  ];
};
