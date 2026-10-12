"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/custom/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu";
import { Separator } from "@/components/ui/separator";
import { NavUser } from "@/components/dashboard/nav-user";
import {
  Menu,
  User,
  LogIn,
  KeySquare,
  Phone,
  Clock,
  MapPin,
  Utensils,
  Calendar,
  Heart,
  Camera,
  Mail,
} from "lucide-react";
import { HeaderProps } from "@/utils/interface";
import { ModeSwitcher } from "@/components/element/mode-toggle";
import { Customizer } from "@/components/element/customizer";

export function Navbar({
  top,
  bottom,
  left,
  right,
  user,
  auth,
  nav,
}: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      {top ? (
        top
      ) : (
        <div className="bg-professional-main text-white py-2 hidden">
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>Hotline: 0123.456.789</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>08:00 AM - 22:00 PM</span>
                </div>
                <div className="hidden md:flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>Gorth Tower, Youth District, Hanoi City, Vietnam</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Button
                  nativeButton={false}
                  render={<Link href="/" />}
                  variant="link"
                  className="h-auto p-0 text-white"
                >
                  Click
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="container mx-auto">
        <div className="flex h-14 items-center px-6">
          {/* Logo */}
          <div className="mr-4 flex items-center">
            {bottom ? (
              bottom
            ) : (
              <Button
                nativeButton={false}
                render={<Link href="/" />}
                variant="ghost"
                className="flex items-center space-x-2"
              >
                {/*<Image*/}
                {/*  className="w-9 h-9"*/}
                {/*  src="/logo/icon.png"*/}
                {/*  alt={"Gorth"}*/}
                {/*  width={36}*/}
                {/*  height={36}*/}
                {/*/>*/}
                <span className="text-lg font-bold hidden md:inline-block">
                  Gorth
                </span>
              </Button>
            )}
          </div>
          {left ? (
            left
          ) : (
            <NavigationMenu className="hidden lg:flex">
              <NavigationMenuList>
                {nav.navigation
                  ? nav.navigation.map((item) => (
                    <NavigationMenuItem key={item.title}>
                      {item.items ? (
                        <>
                          <NavigationMenuTrigger className="text-base bg-transparent">
                            {item.title}
                          </NavigationMenuTrigger>
                          <NavigationMenuContent className="p-1 w-80">
                            <ul className="grid gap-1 md:w-[500px] md:grid-cols-2 rounded-md">
                              {item.items.map((child) => (
                                <li key={child.title}>
                                  <Button
                                    nativeButton={false}
                                    render={<Link href={child.url} />}
                                    variant="ghost"
                                    className="h-auto w-full select-none flex-col items-start space-y-1 whitespace-normal rounded-md p-3 text-left leading-none no-underline"
                                  >
                                    <div className="text-sm font-medium leading-none">
                                      {child.title}
                                    </div>
                                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                      {child.description}
                                    </p>
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
                          className="w-max bg-transparent px-4 text-base"
                        >
                          {item.title}
                        </Button>
                      )}
                    </NavigationMenuItem>
                  ))
                  : null}
              </NavigationMenuList>
            </NavigationMenu>
          )}

          {/* Mobile Menu Button */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger
              className="md:hidden"
              render={<Button variant="ghost" size="icon" className="mr-2" />}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </SheetTrigger>
            <SheetContent side="left" className="">
              {/*w-[300px] sm:w-[400px]*/}
              <SheetHeader className="pb-0">
                <SheetTitle>
                  {/* <Link href="/" className="flex items-center gap-2">
                    <Image
                      src="/logo/logo.png"
                      alt={appGlobal.name}
                      width={48}
                      height={48}
                      className="rounded-lg"
                    />
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">{appGlobal.name}</span>
                      <span className="truncate text-xs">Manager</span>
                    </div>
                  </Link> */}
                </SheetTitle>
              </SheetHeader>
              <Separator />
            </SheetContent>
          </Sheet>

          <div className="flex flex-row ml-auto items-center gap-2">
            {right ? (
              right
            ) : (
              <>
                <ModeSwitcher />
                <Customizer />
                <NavUser
                  user={user}
                  type="navbar"
                  side="bottom"
                  align="end"
                  size="icon"
                  auth={auth}
                  nav={{
                    main: nav.main,
                    secondary: nav.secondary,
                  }}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export function NavbarOld({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const navigation = [
    {
      title: "Thực đơn",
      href: "/menu",
      icon: Utensils,
      description: "Khám phá các món ăn ngon",
    },
    {
      title: "Đặt bàn",
      href: "/booking",
      icon: Calendar,
      description: "Đặt bàn trước để có chỗ ngồi tốt nhất",
    },
    {
      title: "Yêu thích",
      href: "/favorite",
      icon: Heart,
      description: "Xem các món ăn yêu thích của bạn",
    },
    {
      title: "Khám phá",
      href: "#",
      icon: Camera,
      children: [
        {
          title: "Thư viện ảnh",
          href: "/gallery",
          description: "Những khoảnh khắc đẹp tại nhà hàng",
        },
        {
          title: "Blog ẩm thực",
          href: "/blog",
          description: "Câu chuyện và kinh nghiệm ẩm thực",
        },
        {
          title: "Đánh giá",
          href: "/review",
          description: "Đánh giá từ khách hàng",
        },
      ],
    },
    {
      title: "Liên hệ",
      href: "/contact",
      icon: Mail,
      description: "Thông tin liên hệ và hỗ trợ",
    },
    // { name: "Contact", href: "/contact" },
    // { name: "About Us", href: "/about" },
    // { name: "Pages", href: "/pages" },
    // { name: "Components", href: "/manager" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      {/* <div className="bg-professional-main text-white py-2 hidden">
       <div className="container mx-auto px-6">
       <div className="flex items-center justify-between text-sm">
       <div className="flex items-center gap-6">
       <div className="flex items-center gap-2">
       <Phone className="h-4 w-4" />
       <span>Hotline: {appGlobal.hotline}</span>
       </div>
       <div className="flex items-center gap-2">
       <Clock className="h-4 w-4" />
       <span>{appGlobal.times}</span>
       </div>
       <div className="hidden md:flex items-center gap-2">
       <MapPin className="h-4 w-4" />
       <span>{appGlobal.address}</span>
       </div>
       </div>
       <div className="flex items-center gap-4">
       <Link href="/(customer)/booking" className="hover:underline">
       Đặt bàn ngay
       </Link>
       </div>
       </div>
       </div>
       </div> */}
      <div className="container mx-auto">
        <div className="flex h-16 items-center px-6">
          {/* Logo */}
          <div className="mr-4 flex items-center">
            {/* <Link href="/" className="flex items-center space-x-2">
             <Image
             className="w-9 h-9"
             src="/logo/icon.png"
             alt={appGlobal.name}
             width={36}
             height={36}
             />
             <span className="text-lg font-bold hidden md:inline-block">{appGlobal.name}</span>
             </Link> */}
          </div>
          {/* <NavigationMenu className="hidden lg:flex">
           <NavigationMenuList>
           {navigation.map((item) => (
           <NavigationMenuItem key={item.title}>
           {item.children ? (
           <>
           <NavigationMenuTrigger className="text-base bg-transparent">
           {item.title}
           </NavigationMenuTrigger>
           <NavigationMenuContent className="p-1 w-80">
           <ul className="grid gap-1 md:w-[500px] md:grid-cols-2 rounded-md">
           {item.children.map((child) => (
           <li key={child.title}>
           <NavigationMenuLink asChild>
           <Link
           href={child.href}
           className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
           >
           <div className="text-sm font-medium leading-none">
           {child.title}
           </div>
           <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
           {child.description}
           </p>
           </Link>
           </NavigationMenuLink>
           </li>
           ))}
           </ul>
           </NavigationMenuContent>
           </>
           ) : (
           <NavigationMenuLink asChild className="bg-transparent rounded-md">
           <Link
           href={item.href}
           className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
           >
           {item.title}
           </Link>
           </NavigationMenuLink>
           )}
           </NavigationMenuItem>
           ))}
           </NavigationMenuList>
           </NavigationMenu> */}

          {/* Mobile Menu Button */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger
              className="md:hidden"
              render={<Button variant="ghost" size="icon" className="mr-2" />}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </SheetTrigger>
            <SheetContent side="left" className="">
              {/*w-[300px] sm:w-[400px]*/}
              <SheetHeader className="pb-0">
                <SheetTitle>
                  {/* <Link href="/" className="flex items-center gap-2">
                   <Image
                   src="/logo/logo.png"
                   alt={appGlobal.name}
                   width={48}
                   height={48}
                   className="rounded-lg"
                   />
                   <div className="grid flex-1 text-left text-sm leading-tight">
                   <span className="truncate font-medium">{appGlobal.name}</span>
                   <span className="truncate text-xs">Manager</span>
                   </div>
                   </Link> */}
                </SheetTitle>
              </SheetHeader>
              <Separator />
            </SheetContent>
          </Sheet>

          <div className="ml-auto flex items-center space-x-2">
            {/*<NavElement user={user}/>*/}

            {/*{user ? (*/}
            {/*  <>*/}
            {/*    <DropdownMenu>*/}
            {/*      <DropdownMenuTrigger asChild>*/}
            {/*        <Button*/}
            {/*          variant="ghost"*/}
            {/*          size="icon"*/}
            {/*          className="h-9 w-9 p-0 cursor-pointer"*/}
            {/*        >*/}
            {/*          <NavAvatar user={user} />*/}
            {/*        </Button>*/}
            {/*      </DropdownMenuTrigger>*/}
            {/*      <DropdownMenuContent*/}
            {/*        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"*/}
            {/*        // side={isMobile ? "bottom" : "right"}*/}
            {/*        align="end"*/}
            {/*        sideOffset={4}*/}
            {/*      >*/}
            {/*        <NavUserDropdown user={user}/>*/}
            {/*      </DropdownMenuContent>*/}
            {/*    </DropdownMenu>*/}
            {/*  </>*/}
            {/*) : (*/}
            {/*  <>*/}
            {/*    <DropdownMenu>*/}
            {/*      <DropdownMenuTrigger asChild>*/}
            {/*        <Button variant="ghost" size="icon" className="relative">*/}
            {/*          <User className="h-6 w-6" />*/}
            {/*        </Button>*/}
            {/*      </DropdownMenuTrigger>*/}
            {/*      <DropdownMenuContent*/}
            {/*        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"*/}
            {/*        // side={isMobile ? "bottom" : "right"}*/}
            {/*        align="end"*/}
            {/*        sideOffset={4}*/}
            {/*      >*/}
            {/*        <DropdownMenuLabel className="p-0 font-normal">*/}
            {/*          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">*/}
            {/*            <NavAvatar />*/}
            {/*            <NavName />*/}
            {/*          </div>*/}
            {/*        </DropdownMenuLabel>*/}
            {/*        <DropdownMenuSeparator />*/}
            {/*        <DropdownMenuGroup>*/}
            {/*          <NavDropdownItem*/}
            {/*            icon={LogIn}*/}
            {/*            title="Đăng nhập"*/}
            {/*            link="/sign-in"*/}
            {/*          />*/}
            {/*          <NavDropdownItem*/}
            {/*            icon={KeySquare}*/}
            {/*            title="Đăng ký"*/}
            {/*            link="/sign-up"*/}
            {/*          />*/}
            {/*        </DropdownMenuGroup>*/}
            {/*      </DropdownMenuContent>*/}
            {/*    </DropdownMenu>*/}
            {/*  </>*/}
            {/*)}*/}
          </div>
        </div>
      </div>
    </header>
  );
}
