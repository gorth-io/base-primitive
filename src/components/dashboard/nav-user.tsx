"use client";

import React, { JSX } from "react";
import Link from "next/link";
import { cn } from "cn";
import { formatUserInitials } from "@/utils/formatter";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/custom/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/custom/dropdown";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/custom/sidebar";
import { Button } from "@/components/custom/button";
import {
  BadgeCheck,
  Bell,
  EllipsisVertical,
  CreditCard,
  LogOut,
  Sparkles,
  Bolt,
  LogIn,
  KeySquare,
  LucideIcon,
} from "lucide-react";

import type {
  AppSidebarUserProps,
  AuthSidebarProps,
  NavDropdown,
  NavMainItem,
  UserProps,
} from "@/utils/interface";

export function NavUserX({ user }: { user: UserProps }) {
  const { isMobile } = useSidebar();
  const initials = formatUserInitials(user.name);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              />
            }
          >
            <Avatar className="">
              <AvatarImage src={user.avatar || undefined} alt={user.name} />
              <AvatarFallback className="rounded-md">{initials}</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{user.name}</span>
              <span className="truncate text-xs">{user.email}</span>
            </div>
            <EllipsisVertical className="ml-auto size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <Avatar className="">
                    <AvatarImage
                      src={user.avatar || undefined}
                      alt={user.name}
                    />
                    <AvatarFallback className="">{initials}</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{user.name}</span>
                    <span className="truncate text-xs">{user.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Sparkles />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheck />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

export function NavUserDropdown({
  user,
  nav,
  auth,
}: {
  user: UserProps;
  nav: NavDropdown;
  auth: AuthSidebarProps;
}): JSX.Element {
  return (
    <>
      <DropdownMenuGroup>
        <NavAccount user={user} />
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        {auth.authenticated
          ? nav.main.map((item) => (
              <NavDropdownItem
                key={item.url}
                icon={item.icon}
                title={item.title}
                link={item.url}
              />
            ))
          : null}
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        {auth.authenticated ? (
          <NavDropdownItem
            icon={LogOut}
            title="Sign out"
            action={auth.logout}
          />
        ) : (
          nav.secondary.map((item) => {
            const isSignIn = item.url.endsWith("/sign-in");
            const isSignUp = item.url.endsWith("/sign-up");
            return (
              <NavDropdownItem
                key={item.url}
                icon={item.icon}
                title={item.title}
                action={
                  isSignIn ? auth.login : isSignUp ? auth.register : undefined
                }
                link={!isSignIn && !isSignUp ? item.url : undefined}
              />
            );
          })
        )}
      </DropdownMenuGroup>
    </>
  );
}

export function NavUser({
  user,
  nav,
  auth,
  type,
  size = "icon",
  side = "bottom",
  align = "end",
}: AppSidebarUserProps) {
  const { isMobile } = useSidebar();

  return (
    <>
      {type === "navbar" ? (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={<Button variant="ghost" size="icon" className="p-0" />}
            >
              <NavAvatar user={user} />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="min-w-56 rounded-lg"
              side="bottom"
              align="end"
              sideOffset={4}
            >
              <NavUserDropdown user={user} nav={nav} auth={auth} />
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      ) : type === "sidebar" ? (
        <>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <NavAccount
                      user={user}
                      className={
                        size === "icon"
                          ? "group-data-[collapsible=icon]:p-0!"
                          : undefined
                      }
                      trailing={
                        <EllipsisVertical className="ml-auto size-4 shrink-0" />
                      }
                    />
                  }
                />
                <DropdownMenuContent
                  className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                  // side={isMobile ? "bottom" : "right"}
                  side={isMobile ? "bottom" : side}
                  align={align}
                  sideOffset={4}
                >
                  <NavUserDropdown user={user} nav={nav} auth={auth} />
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </>
      ) : (
        <></>
      )}
    </>
  );
}

export interface NavIdentityProps extends React.ComponentProps<"div"> {
  user: UserProps;
  showName?: boolean;
}

export interface NavAccountProps extends React.ComponentProps<
  typeof SidebarMenuButton
> {
  user: UserProps;
  trailing?: React.ReactNode;
}

export function NavAccount({
  user,
  trailing,
  className,
  ...props
}: NavAccountProps) {
  return (
    <SidebarMenuButton
      {...props}
      size="lg"
      className={cn(
        "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        className,
        "h-14 w-full gap-2 focus:bg-sidebar-accent focus:text-sidebar-accent-foreground not-data-[variant=destructive]:focus:**:text-sidebar-accent-foreground",
      )}
    >
      <NavIdentity user={user} />
      {trailing}
    </SidebarMenuButton>
  );
}

export function NavIdentity({
  user,
  showName = true,
  className,
  ...props
}: NavIdentityProps) {
  return (
    <div
      className={cn(
        "flex min-w-0 items-center gap-2",
        showName && "flex-1",
        className,
      )}
      {...props}
    >
      <NavAvatar user={user} />
      {showName ? <NavName user={user} /> : null}
    </div>
  );
}

export function NavAvatar({ user }: { user: UserProps }) {
  const initials = formatUserInitials(user.name);

  return (
    <Avatar>
      <AvatarImage src={user.avatar || undefined} alt={user.name} />
      <AvatarFallback
        className="bg-muted-foreground text-primary-foreground"
        suppressHydrationWarning
      >
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}

export function NavName({ user }: { user: UserProps }) {
  return (
    <>
      <div className="grid min-w-0 flex-1 text-left text-sm leading-tight">
        <span className="truncate font-medium" suppressHydrationWarning>
          {user.name}
        </span>
        <span className="truncate text-xs" suppressHydrationWarning>
          {user.email}
        </span>
      </div>
    </>
  );
}

export function NavDropdownItem({
  icon: Icon,
  title,
  link,
  action,
}: {
  icon: LucideIcon;
  title: string;
  link?: string;
  action?: () => void;
}) {
  return (
    <>
      <DropdownMenuItem className="" onClick={action}>
        <Icon className="size-4" />
        {link ? <Link href={link}>{title}</Link> : <span>{title}</span>}
      </DropdownMenuItem>
    </>
  );
}
