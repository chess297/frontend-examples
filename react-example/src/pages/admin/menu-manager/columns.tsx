import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { MenuEntity } from "@/services/api/api";
import { createColumnHelper } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { DynamicIcon } from "lucide-react/dynamic";
import EditDialog from "./edit-dialog";

const columnHelper = createColumnHelper<MenuEntity>();

export const columns = [
  // columnHelper.display({
  //   id: "id",
  // }),
  columnHelper.accessor((row) => row.mate.title, {
    id: "title",
    header: "title",
  }),
  columnHelper.accessor((row) => row.mate.path, {
    id: "path",
    header: "path",
  }),
  columnHelper.accessor((row) => row.mate.icon, {
    id: "icon",
    header: "icon",
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    cell: (info) => <DynamicIcon name={info.getValue() as any} />,
  }),
  columnHelper.accessor((row) => row.mate.component, {
    id: "component",
    header: "component",
  }),
  columnHelper.accessor((row) => row, {
    id: "actions",
    header: "操作",
    enableHiding: false,
    cell: ({ row }) => {
      const menu = row.original;

      return (
        <div className="flex items-center">
          <EditDialog menu={menu} />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {/* <DropdownMenuLabel>Actions</DropdownMenuLabel> */}
              {/* <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText("test")}
              >
                Copy Menu ID
              </DropdownMenuItem> */}
              {/* <DropdownMenuSeparator /> */}
              <DropdownMenuItem
                onClick={() => {
                  console.log(row);
                }}
              >
                删除
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  }),
];
