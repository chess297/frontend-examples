import { useQuery } from "@tanstack/react-query";

import type { MenuEntity } from "@/services/api/api";
import { api } from "@/services";
import Loading from "@/components/loading";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { DataTable } from "./data-table";
import { columns } from "./columns";

import AddDialog from "./add-dialog";

export default function MenuManager() {
  // 使用react-query获取菜单数据
  const { data, isLoading } = useQuery({
    queryKey: ["menus"],
    queryFn: async () => {
      const response = await api.findManyMenu();
      return response.data.data;
    },
  });

  if (isLoading) return <Loading />;

  return (
    <div>
      <div className=" py-2">
        <AddDialog />
      </div>
      {/* biome-ignore lint/suspicious/noExplicitAny: <explanation> */}
      <DataTable<MenuEntity, any>
        columns={columns}
        data={data?.records || []}
      />
      <Pagination className=" justify-end mt-5">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
