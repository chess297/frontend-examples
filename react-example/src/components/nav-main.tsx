"use client";

import { DynamicIcon, type IconName } from "lucide-react/dynamic";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "react-router";

export function NavMain({
  items,
}: {
  items: {
    name: string;
    path: string;
    icon: string;
    isActive?: boolean;
  }[];
}) {
  return (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.name}>
          <SidebarMenuButton asChild isActive={item.isActive}>
            <Link to={item.path}>
              <DynamicIcon name={item.icon as IconName} />
              <span>{item.name}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
