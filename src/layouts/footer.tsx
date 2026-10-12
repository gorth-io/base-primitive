"use client"

import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/custom/button";
import { useLayout } from "@/providers/layout"
import { cn } from "cn"
import { FooterProps } from "@/utils/interface"

export function Footer({
  top,
  middle,
  bottom,
  nav,
  mode = "navbar",
}: FooterProps) {
  const { variant } = useLayout()
  const dashboard = mode === "dashboard"
  const floating = variant === "floating"
  const inset = variant === "inset"

  const footerTop = !dashboard ? (
    <div
      className={cn(
        "w-full",
        !floating &&
        "bg-background/95 shadow-[inset_0_1px_0_var(--border)] backdrop-blur supports-[backdrop-filter]:bg-background/80",
        floating &&
        "rounded-lg bg-background/95 shadow-sm ring-1 ring-sidebar-border backdrop-blur supports-[backdrop-filter]:bg-background/80",
      )}
    >
      <div data-slot="footer-top" className="py-6">
        <div
          className={cn(
            "mx-auto grid w-full grid-cols-1 gap-8 px-6 sm:grid-cols-2 lg:grid-cols-6",
            !floating && "container",
          )}
        >
          <div className="flex min-w-0 flex-col items-start lg:col-span-2">
            <div className="flex min-h-9 items-center">
              {top ?? (
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

            {middle ? (
              <div className="mt-4 w-full text-sm text-muted-foreground">
                {middle}
              </div>
            ) : null}
          </div>

          {(nav?.main ?? []).slice(0, 4).map((group) => (
            <nav
              key={`${group.title}-${group.url}`}
              aria-label={group.title}
              className="flex min-w-0 flex-col items-start gap-3"
            >
              {group.url && group.url !== "#" ? (
                <Link
                  href={group.url}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  {group.title}
                </Link>
              ) : (
                <p className="text-sm font-medium text-muted-foreground">
                  {group.title}
                </p>
              )}

              <div className="flex flex-col items-start gap-2.5">
                {group.items?.map((item) => (
                  <Link
                    key={`${item.title}-${item.url}`}
                    href={item.url}
                    className="text-sm font-medium text-foreground hover:text-primary"
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            </nav>
          ))}
        </div>
      </div>
    </div>
  ) : null

  const copyright = (
    <div
      data-slot="footer-copyright"
      className={cn(
        "h-14 w-full bg-background/95 text-muted-foreground backdrop-blur supports-[backdrop-filter]:bg-background/80",
        floating &&
        "rounded-lg shadow-sm ring-1 ring-sidebar-border",
        !floating && "shadow-[inset_0_1px_0_var(--border)]",
        inset && "rounded-b-xl",
      )}
    >
      <div className="container mx-auto h-14 w-full">
        <div className="mx-auto flex h-full items-center gap-2 px-6">
          {bottom}
        </div>
      </div>
    </div>
  )

  return (
    <footer
      data-layout={variant}
      data-mode={mode}
      className={cn(
        "w-full shrink-0",
        !floating && !dashboard &&
        "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80",
        inset && "rounded-b-xl",
      )}
    >
      {floating ? (
        <div className="container mx-auto flex w-full flex-col gap-2 px-6 py-2">
          {footerTop}
          {copyright}
        </div>
      ) : (
        <>
          {footerTop}
          {copyright}
        </>
      )}
    </footer>
  )
}

export function FooterOld({ children }: { children: ReactNode }) {

  return (
    <footer className="bottom-0 w-full border-t bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {/* Logo và thông tin công ty - 2 cột */}
          <div className="md:col-span-2 lg:col-span-2 row-span-2 space-y-4">
            <Link href="/" className="flex items-center space-x-2 mb-6">
              <div className="w-16 h-16 rounded-lg flex items-center justify-center">
                <Image
                  src="/logo/icon.png"
                  alt="Logo"
                  width={64}
                  height={64}
                />
              </div>
              {/*<span className="font-bold text-2xl">{appGlobal.name}</span>*/}
            </Link>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              {/*{footer.introduction}*/}
            </p>

            {/*{footer.information.map((infoSection, index) => (*/}
            {/*  <div key={index} className="space-y-2">*/}
            {/*    <h5 className="text-lg font-semibold text-foreground">{infoSection.title}</h5>*/}
            {/*    {infoSection.description.map((item, itemIndex) => (*/}
            {/*      <div key={itemIndex} className="flex items-center gap-3">*/}
            {/*        <item.icon className={`h-5 w-5 text-${item.color}`} />*/}
            {/*        <span className="text-sm text-muted-foreground">{item.text}</span>*/}
            {/*      </div>*/}
            {/*    ))}*/}
            {/*  </div>*/}
            {/*))}*/}

            <div className="space-y-2">
              <h5 className="text-lg font-semibold text-foreground">Phản hồi</h5>
              {/*<p className="text-sm text-muted-foreground">{footer.feedback}</p>*/}
            </div>

            <div className="space-y-2">
              {/*<h5 className="text-lg font-semibold text-foreground">{footer.socials.title}</h5>*/}
              <div className="flex items-center space-x-2">
                {/*{footer.socials.item.map((social, index) => (*/}
                {/*  <Link*/}
                {/*    key={index}*/}
                {/*    href={social.link}*/}
                {/*    className={`w-9 h-9 bg-popover rounded-lg flex items-center justify-center hover:bg-[${social.hover}] transition-colors`}*/}
                {/*    aria-label={social.name}*/}
                {/*  >*/}
                {/*    <social.icon className="h-5 w-5" />*/}
                {/*  </Link>*/}
                {/*))}*/}

              </div>
            </div>

          </div>

          {/*{footer.sections.map((section, index) => (*/}
          {/*  <div key={index} className="space-y-2">*/}
          {/*    <h5 className="text-lg font-semibold text-foreground">{section.title}</h5>*/}
          {/*    {section.items.map((item, itemIndex) => (*/}
          {/*      <Link*/}
          {/*        key={itemIndex}*/}
          {/*        href={item.href}*/}
          {/*        className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground"*/}
          {/*      >*/}
          {/*        <item.icon className={`h-5 w-5 text-[${item.color}]`} />*/}
          {/*        <span className="text-sm">{item.name}</span>*/}
          {/*      </Link>*/}
          {/*    ))}*/}
          {/*  </div>*/}
          {/*))}*/}
        </div>

        <Separator className="my-8 bg-secondary" />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-muted-foreground text-sm">
            {/*{appGlobal.copyright}*/}
          </div>

          <div className="flex flex-wrap gap-6 text-sm">
            <Link href="#" className="text-muted-foreground hover:text-professional-main transition-colors">
              Chính sách bảo mật
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-professional-main transition-colors">
              Điều khoản sử dụng
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-professional-main transition-colors">
              Chính sách cookie
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-professional-main transition-colors">
              Sitemap
            </Link>
          </div>
        </div>
        <div className="hidden mt-8 pt-8">
          <div className="text-center space-y-2">
            <h5 className="text-base font-medium text-foreground">
              {/*{appGlobal.copyleft}*/}
            </h5>
            {/* <h5 className="text-base font-medium text-foreground"> */}
            {/* {appGlobal.copyright} */}
            {/* Copyright &copy; 2020 - {(new Date().getFullYear())} Gorth Inc. All rights reserved. */}
            {/* Bản quyền &copy; Gorth Inc. 2020 - {(new Date().getFullYear())} Bảo lưu mọi quyền. */}
            {/* </h5> */}
          </div>
        </div>
      </div>
    </footer>
  );
};
