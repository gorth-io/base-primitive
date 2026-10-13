"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { Command } from "lucide-react"

import { NavMaster } from "@/components/dashboard/nav-main"
import { NavProjects } from "@/components/dashboard/nav-projects"
import { NavSecondary } from "@/components/dashboard/nav-secondary"
import { NavUser } from "@/components/dashboard/nav-user"
import { AccountSwitcher, type AccountSwitcherProps } from "@/components/dashboard/account-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem, SidebarSeparator,
} from "@/components/custom/sidebar"

import { TeamSwitcher } from "@/components/dashboard/team-switcher"
import { AppSidebarProps } from "@/utils/interface";
import { useLayout } from "@/providers/layout"

export interface AppSidebarAccountSwitcherProps extends Omit<
  AccountSwitcherProps,
  "user" | "nav" | "auth" | "type" | "side" | "size" | "align"
> {}

export function AppSidebar({ data, auth, accountSwitcher, ...props }: AppSidebarProps & {
  accountSwitcher?: AppSidebarAccountSwitcherProps
}) {
  const { collapsible, variant } = useLayout()

  return (
    <Sidebar collapsible={collapsible} variant={variant} {...props}>
      {/*<Sidebar variant="inset" {...props}>*/}
      <SidebarHeader>
        {data.teams?.length ? (
          <TeamSwitcher teams={data.teams} />
        ) : (
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" className="h-14" render={<Link href="/" />}>
                {data.brand && data.brand.logo ? (
                  <>
                    <div className="flex aspect-square size-9 items-center justify-center rounded-md text-sidebar-primary-foreground">
                      <Image
                        src={data.brand.logo}
                        className="size-9"
                        alt={data.brand.name}
                        width={36}
                        height={36}
                      />
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      {data.brand.plan ? (
                        <>
                          <span className="truncate text-2xl font-bold tracking-tight text-foreground">{data.brand.name}</span>
                          <span className="truncate text-xs">{data.brand.plan}</span>
                        </>
                      ) : (
                        <span className="truncate text-2xl font-bold tracking-tight text-foreground">{data.brand.name}</span>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex aspect-square size-9 items-center justify-center rounded-md bg-professional-main text-sidebar-primary-foreground">
                      <Command className="size-4" />
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate text-2xl font-bold tracking-tight text-foreground">Gorth Inc</span>
                      <span className="truncate text-xs">Enterprise</span>
                    </div>
                  </>
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        )}
      </SidebarHeader>
      <SidebarSeparator className="mx-0" />
      <SidebarContent>
        <NavMaster items={data.navMain} />
        <SidebarSeparator className="mx-0 -my-2" />
        <NavSecondary items={data.navSecondary} />
        <SidebarSeparator className="mx-0 -my-2" />
        <NavProjects projects={data.projects} className="mt-auto" />
      </SidebarContent>
      <SidebarSeparator className="mx-0" />
      <SidebarFooter>
        {accountSwitcher ? (
          <AccountSwitcher
            {...accountSwitcher}
            user={data.user}
            type="sidebar"
            side="right"
            size="lg"
            auth={auth}
            nav={{ main: data.navDropdown, secondary: data.navSignal }}
          />
        ) : (
        <NavUser
          user={data.user}
          type="sidebar"
          side="right"
          size="lg"
          auth={auth}
          nav={{
            main: data.navDropdown,
            secondary: data.navSignal
          }}
        />
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
