import * as React from "react"
import Link from "next/link"
import { LucideIcon } from "lucide-react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/custom/sidebar"
import { NavMainItem } from "@/utils/interface";

interface NavCoreProps extends React.ComponentPropsWithoutRef<typeof SidebarGroup> {
  items: NavMainItem[];
}
export function NavSecondary({ items, ...props }: NavCoreProps) {
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const Icon = item.icon

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton render={<Link href={item.url} />}>
                    <Icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
