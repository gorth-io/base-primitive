"use client"

import React from "react"
import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"
import { Command } from "lucide-react"

import { NavUser } from "@/components/dashboard/nav-user"
import { Label } from "@/components/ui/label"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/custom/sidebar"
import { Switch } from "@/components/ui/switch"
import { MessSidebarProps } from "@/utils/interface"
import { cn } from "cn"

export function MessSidebar({ data, auth, ...props }: MessSidebarProps) {
  // Note: I'm using state to show active item.
  // IRL you should use the url/router.
  const [activeItem, setActiveItem] = React.useState(data.navMain[0])
  const [messages, setMessages] = React.useState(data.navMessage)
  const params = useParams<{ id?: string }>()
  const activeMessageId = typeof params.id === "string" ? decodeURIComponent(params.id) : ""
  const { setOpen } = useSidebar()
  return (
    <Sidebar
      collapsible="icon"
      className="overflow-hidden *:data-[sidebar=sidebar]:flex-row"
      {...props}
    >
      {/* This is the first sidebar */}
      {/* We disable collapsible and adjust width to icon. */}
      {/* This will make the sidebar appear as icons. */}
      <Sidebar
        collapsible="none"
        className="w-[calc(var(--sidebar-width-icon)+1px)]! border-r"
      >
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="default" className="md:p-0" render={<Link href="/" />}>
                {data.brand && data.brand.logo ? (
                  <>
                    <div className="flex aspect-square size-9 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                      <Image
                        src={data.brand.logo}
                        width={36}
                        height={36}
                        className="size-9"
                        alt={data.brand.name}
                      />
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      {data.brand.plan ? (
                        <>
                          <span className="truncate font-medium">{data.brand.name}</span>
                          <span className="truncate text-xs">{data.brand.plan}</span>
                        </>
                      ) : (
                        <span className="truncate font-medium text-xl">{data.brand.name}</span>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex aspect-square size-9 items-center justify-center rounded-md bg-professional-main text-sidebar-primary-foreground">
                      <Command className="size-4" />
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">Gorth Inc</span>
                      <span className="truncate text-xs">Enterprise</span>
                    </div>
                  </>
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent className="px-1.5 md:px-0">
              <SidebarMenu>
                {data.navMain.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={{
                        children: item.title,
                        hidden: false,
                      }}
                      onClick={() => {
                        setActiveItem(item)
                        const mail = [...data.navMessage].sort(() => Math.random() - 0.5)
                        setMessages(
                          mail.slice(
                            0,
                            Math.max(5, Math.floor(Math.random() * 10) + 1)
                          )
                        )
                        setOpen(true)
                      }}
                      isActive={activeItem?.title === item.title}
                      className="px-2.5"
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <NavUser
            user={data.user}
            type="sidebar"
            side="right"
            size="icon"
            auth={auth}
            nav={{
              main: data.navDropdown,
              secondary: data.navSignal
            }}
          />
        </SidebarFooter>
      </Sidebar>
      {/* This is the second sidebar */}
      {/* We disable collapsible and let it fill remaining space */}
      <Sidebar collapsible="none" className="hidden flex-1 md:flex">
        <SidebarHeader className="gap-3.5 border-b p-4">
          <div className="flex w-full items-center justify-between">
            <div className="text-base font-medium text-foreground">
              {activeItem?.title}
            </div>
            <Label className="flex items-center gap-2 text-sm">
              <span>Unreads</span>
              <Switch className="shadow-none" />
            </Label>
          </div>
          <SidebarInput placeholder="Type to search..." />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup className="p-0">
            <SidebarGroupContent>
              {messages.map((mail) => (
                <Link
                  href={`/message/${encodeURIComponent(mail.email)}`}
                  key={mail.email}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex flex-col items-start gap-2 border-b p-4 text-sm leading-tight whitespace-nowrap last:border-b-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    activeMessageId === mail.email && "bg-sidebar-accent text-sidebar-accent-foreground"
                  )}
                >
                  <div className="flex w-full items-center gap-2">
                    <span>{mail.name}</span>{" "}
                    <span className="ml-auto text-xs">{mail.date}</span>
                  </div>
                  <span className="font-medium">{mail.subject}</span>
                  <span className="line-clamp-2 w-full text-xs whitespace-break-spaces">
                    {mail.teaser}
                  </span>
                </Link>
              ))}
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </Sidebar>
  )
}
