"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu } from "lucide-react"

import { NavUser } from "@/components/dashboard/nav-user"
import { Button } from "@/components/custom/button"
import { Customizer } from "@/components/element/customizer"
import { ModeSwitcher } from "@/components/element/mode-toggle"
import { Shortcut } from "@/components/element/shortcut"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "cn"
import { HeaderProps, NavMainItem } from "@/utils/interface"
import { useLayout } from "@/providers/layout"

function HeaderNavigation({ items }: { items: NavMainItem[] }) {
  return (
    <NavigationMenu className="hidden lg:flex">
      <NavigationMenuList>
        {items.map((item) => (
          <NavigationMenuItem key={item.url}>
            {item.items?.length ? (
              <>
                <NavigationMenuTrigger className="bg-transparent text-sm">
                  {item.title}
                </NavigationMenuTrigger>
                <NavigationMenuContent className="w-80 p-1 md:w-[500px]">
                  <ul className="grid gap-1 rounded-md md:grid-cols-2">
                    {item.items.map((child) => (
                      <li key={child.url}>
                        <Button
                          nativeButton={false}
                          render={<Link href={child.url} />}
                          variant="ghost"
                          className="h-auto w-full select-none flex-col items-start gap-1 whitespace-normal rounded-md p-3 text-left"
                        >
                          <span className="text-sm font-medium leading-none">
                            {child.title}
                          </span>
                          {child.description ? (
                            <span className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              {child.description}
                            </span>
                          ) : null}
                        </Button>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </>
            ) : (
              <Button
                nativeButton={false}
                render={<Link href={item.url} />}
                variant="ghost"
                className="w-max bg-transparent px-4"
              >
                {item.title}
              </Button>
            )}
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  )
}

function MobileNavigation({ items }: { items: NavMainItem[] }) {
  const [open, setOpen] = useState(false)

  if (!items.length) return null

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        className="lg:hidden"
        render={<Button variant="ghost" size="icon" />}
      >
        <Menu className="size-4" />
        <span className="sr-only">Toggle navigation</span>
      </SheetTrigger>
      <SheetContent side="left" className="gap-4 p-4">
        <SheetHeader className="p-0">
          <SheetTitle>Navigation</SheetTitle>
        </SheetHeader>
        <nav className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto">
          {items.map((item) => (
            <div key={item.url} className="flex flex-col gap-1">
              <Button
                nativeButton={false}
                render={<Link href={item.url} />}
                variant="ghost"
                className="w-full justify-start"
                onClick={() => setOpen(false)}
              >
                <item.icon className="size-4" />
                {item.title}
              </Button>
              {item.items?.map((child) => (
                <Button
                  key={child.url}
                  nativeButton={false}
                  render={<Link href={child.url} />}
                  variant="ghost"
                  className="w-full justify-start pl-10 text-muted-foreground"
                  onClick={() => setOpen(false)}
                >
                  {child.title}
                </Button>
              ))}
            </div>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  )
}

export function Header({
  top,
  bottom,
  left,
  right,
  user,
  auth,
  nav,
  mode = "navbar",
}: HeaderProps) {
  const { navbarBehavior, variant } = useLayout()
  const navigation = nav.navigation ?? []
  const dashboard = mode === "dashboard"
  const floating = variant === "floating"
  const inset = variant === "inset"

  return (
    <header
      data-slot="layout-header"
      data-layout={variant}
      data-behavior={navbarBehavior}
      data-mode={mode}
      className={cn(
        "z-50 w-full shrink-0 data-[behavior=sticky]:sticky data-[behavior=sticky]:top-0",
        !floating &&
        "bg-background/95 shadow-[inset_0_-1px_0_var(--border)] backdrop-blur supports-[backdrop-filter]:bg-background/80",
        inset && "rounded-t-xl",
      )}
    >
      {top}
      <div
        className={cn(
          "w-full",
          floating && "container mx-auto px-6 py-2",
        )}
      >
        <div
          className={cn(
            "h-14 w-full",
            !dashboard && !floating && "container mx-auto",
            floating &&
            "rounded-lg bg-background/95 shadow-sm ring-1 ring-sidebar-border backdrop-blur supports-[backdrop-filter]:bg-background/80",
            inset && "rounded-t-xl",
          )}
        >
          <div
            className={cn(
              "mx-auto flex h-full items-center gap-2 px-6",
              dashboard && !floating && "container",
            )}
          >
            {dashboard ? (
              left
            ) : (
              <>
                <MobileNavigation items={navigation} />
                <div className="mr-2 flex shrink-0 items-center">
                  {bottom ? (
                    bottom
                  ) : (
                    <Button
                      nativeButton={false}
                      render={<Link href="/" />}
                      variant="ghost"
                      className="px-0 text-lg font-bold hover:bg-transparent"
                    >
                      Gorth
                    </Button>
                  )}
                </div>
                {left ?? <HeaderNavigation items={navigation} />}
              </>
            )}

            <div className="ml-auto flex shrink-0 items-center gap-2">
              {right ?? (
                <>
                  <ModeSwitcher />
                  <Customizer />
                  {nav.navigation?.length ? (
                    <Shortcut shortcuts={nav.navigation} />
                  ) : null}
                  <NavUser
                    user={user}
                    type="navbar"
                    side="bottom"
                    align="end"
                    size="icon"
                    auth={auth}
                    nav={{ main: nav.main, secondary: nav.secondary }}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export function HeaderOld({ top, bottom, left, right, user, auth, nav }: HeaderProps) {

  return (
    <header className="flex h-16 items-center justify-between gap-4 border-b px-4">
      <Link href="/" className="flex items-center gap-x-4">
        <svg fill="none" viewBox="0 0 44 44" className="size-9" aria-hidden>
          <path
            fill="currentColor"
            d="M38 0a6 6 0 0 1 6 6v32a6 6 0 0 1-6 6H6a6 6 0 0 1-6-6V6a6 6 0 0 1 6-6h32ZM22.982 9.105c-.208-1.081-1.756-1.081-1.964 0l-.85 4.421a1 1 0 0 1-1.666.541l-3.287-3.077c-.804-.752-2.056.158-1.589 1.155l1.911 4.077a1 1 0 0 1-1.03 1.417l-4.467-.558c-1.093-.136-1.571 1.336-.607 1.868l3.942 2.175a1 1 0 0 1 0 1.752l-3.942 2.175c-.964.532-.486 2.004.607 1.868l4.468-.558a1 1 0 0 1 1.03 1.417l-1.912 4.077c-.467.997.785 1.907 1.589 1.155l3.287-3.077a1 1 0 0 1 1.666.54l.85 4.422c.208 1.081 1.756 1.081 1.964 0l.85-4.421a1 1 0 0 1 1.666-.541l3.287 3.077c.804.752 2.056-.158 1.589-1.155l-1.911-4.077a1 1 0 0 1 1.03-1.417l4.467.558c1.093.136 1.572-1.336.607-1.868l-3.942-2.175a1 1 0 0 1 0-1.752l3.942-2.175c.965-.532.486-2.004-.607-1.868l-4.468.558a1 1 0 0 1-1.03-1.417l1.912-4.077c.467-.997-.785-1.907-1.589-1.155l-3.287 3.077a1 1 0 0 1-1.666-.54l-.85-4.422Z"
          />
        </svg>
        <span className="font-semibold">Acme Co.</span>
      </Link>
      <div className="flex items-center gap-x-4">
      </div>
    </header>
  )
}
