"use client"

import React, { ReactNode, useEffect } from "react"
import Image from "next/image"
import { Separator } from "@/components/ui/separator"
import { HeaderProps } from "@/utils/interface";
import { NavUser } from "@/components/dashboard/nav-user";
import { Customizer } from "@/components/element/customizer";
import { ModeSwitcher } from "@/components/element/mode-toggle";
// import { NavElement } from "@/components/dashboard/nav-element"
// import { Breadcrumbar } from "@/components/layout/breadcrumbar"

export function Dashbar({ top, bottom, left, right, user, auth, nav }: HeaderProps) {
  return (
    <>
      <header className="flex h-14 shrink-0 border-b items-center gap-2 ease-linear">
        <div className="flex flex-1 items-center justify-between gap-2 px-6">
          <div className="container flex h-14 items-center gap-2 md:gap-4">
            {left}
            {/*<Separator*/}
            {/*  orientation="vertical"*/}
            {/*  className="mr-2 data-[orientation=vertical]:h-4"*/}
            {/*/>*/}
            {/*<Breadcrumbar />*/}
          </div>
          <div className="items-center">
            <div className="flex flex-row ml-auto items-center gap-2">
              {right ? right : (
                <>
                  <ModeSwitcher/>
                  <Customizer/>
                  <NavUser
                    user={user}
                    type="navbar"
                    side="bottom"
                    align="end"
                    size="icon"
                    auth={auth}
                    nav={{
                      main: nav.main, // data.navDropdown,
                      secondary: nav.secondary // data.navSignal
                    }}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  )
}
