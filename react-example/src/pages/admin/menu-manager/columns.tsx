import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { MenuEntity } from "@/services/api/api";
import type { ColumnDef, Row, Column } from "@tanstack/react-table";
import { Edit, Trash, FileEdit } from "lucide-react";
import { DynamicIcon } from "lucide-react/dynamic";
import EditDialog from "./edit-dialog";
import { EditableCell } from "./editable-cell";

export const createColumns = (
  onSaveCell: (
    row: Row<MenuEntity>,
    column: Column<MenuEntity, unknown>,
    value: string
  ) => Promise<void>,
  onDelete: (id: string) => void
): ColumnDef<MenuEntity>[] => [
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
    accessorFn: (row) => row.mate.title,
    id: "title",
    header: "菜单名称",
    cell: ({ row, column, getValue }) => (
      <EditableCell
        value={getValue() as string}
        row={row}
        column={column}
        onSave={onSaveCell}
      />
    ),
  },
  {
    accessorFn: (row) => row.mate.path,
    id: "path",
    header: "菜单路径",
    cell: ({ row, column, getValue }) => (
      <EditableCell
        value={getValue() as string}
        row={row}
        column={column}
        onSave={onSaveCell}
      />
    ),
  },
  {
    accessorFn: (row) => row.mate.icon,
    id: "icon",
    header: "图标",
    cell: ({ row, column, getValue }) => (
      <div className="flex items-center gap-2">
        <DynamicIcon name={getValue() as string} />
        <EditableCell
          value={getValue() as string}
          row={row}
          column={column}
          onSave={onSaveCell}
        />
      </div>
    ),
  },
  {
    accessorFn: (row) => row.mate.component,
    id: "component",
    header: "组件路径",
    cell: ({ row, column, getValue }) => (
      <EditableCell
        value={getValue() as string}
        row={row}
        column={column}
        onSave={onSaveCell}
      />
    ),
  },
  {
    id: "actions",
    header: "操作",
    enableHiding: false,
    cell: ({ row }) => {
      const menu = row.original;

      return (
        <div className="flex items-center gap-2">
          {/* 使用EditDialog组件，但通过Button触发 */}
          <EditDialog menu={menu}>
            <Button variant="ghost" size="icon" title="编辑">
              <Edit className="h-4 w-4" />
            </Button>
          </EditDialog>

          {/* 删除按钮 */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(menu.id)}
            title="删除"
          >
            <Trash className="h-4 w-4 text-destructive" />
          </Button>

          {/* 直接编辑按钮 */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => console.log("快速编辑", menu.id)}
            title="快速编辑"
          >
            <FileEdit className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];

// 为了保持兼容性，也导出默认的columns
export const columns = createColumns(
  () => Promise.resolve(),
  (id) => console.log("删除菜单", id)
);
