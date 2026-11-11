"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "@/providers/theme";
import { Button } from "@/components/custom/button";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/custom/dropdown";
import { MoonStar, Moon, Sun, Monitor } from "lucide-react";
import { cn } from "cn";

export function ModeSwitcher({
  className,
  ...props
}: React.ComponentProps<"span"> & {
  className?: string;
}) {
  const [layout, setLayout] = useState(2);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <span className={cn("", className)} {...props}>
        <Button variant="ghost" size="icon">
          <Monitor className="size-4" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </span>
    );
  }

  // Hàm để cycle qua các theme: light -> dark -> system -> light
  const cycleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("system");
    } else {
      setTheme("light");
    }
  };

  const getCurrentIcon = () => {
    if (theme === "system") {
      return <Monitor className="size-4" />;
    } else if (
      theme === "dark" ||
      (theme === "system" && resolvedTheme === "dark")
    ) {
      return <Moon className="size-4" />;
    } else {
      return <Sun className="size-4" />;
    }
  };

  return (
    <span className={cn("", className)} {...props}>
      {layout === 0 ? (
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="ghost" size="icon" />}>
            {getCurrentIcon()}
            <span className="sr-only">Toggle theme</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center">
            <div className="grid grid-cols-3 gap-1">
              <DropdownMenuItem
                disabled={theme === "light"}
                onClick={() => setTheme("light")}
                className=""
              >
                <Sun className="h-4 w-4 text-primary" />
                {/* Light */}
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={theme === "system"}
                onClick={() => setTheme("system")}
                className=""
              >
                <Monitor className="h-4 w-4 text-primary" />
                {/* System */}
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={theme === "dark"}
                onClick={() => setTheme("dark")}
                className=""
              >
                <Moon className="h-4 w-4 text-primary" />
                {/* Dark */}
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : layout === 1 ? (
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="ghost" size="icon" />}>
            {/* <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" /> */}
            {/* <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" /> */}
            {getCurrentIcon()}
            <span className="sr-only">Toggle theme</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")} className="">
              <Sun className="h-4 w-4" />
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")} className="">
              <Moon className="h-4 w-4" />
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")} className="">
              <Monitor className="h-4 w-4" />
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : layout === 2 ? (
        <Button variant="ghost" size="icon" onClick={cycleTheme}>
          {/* <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" /> */}
          {/* <MoonStar className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:-rotate-0 dark:scale-100" /> */}
          {/*<Moon className="h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />*/}
          {getCurrentIcon()}
          <span className="sr-only">Toggle theme</span>
          {/* <span className="sr-only">Toggle theme</span> */}
        </Button>
      ) : (
        <Switch
          checked={theme === "dark"}
          onCheckedChange={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="relative"
        />
      )}
    </span>
  );
}

export function ModeToggle({
  className,
  ...props
}: React.ComponentProps<"span"> & {
  className?: string;
}) {
  const [layout, setLayout] = useState(0);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <span className={cn("", className)} {...props}>
        <Button variant="ghost" size="icon">
          <Monitor className="size-4" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </span>
    );
  }

  // Hàm để cycle qua các theme: light -> dark -> system -> light
  const cycleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("system");
    } else {
      setTheme("light");
    }
  };

  const getCurrentIcon = () => {
    if (theme === "system") {
      return <Monitor className="size-4" />;
    } else if (
      theme === "dark" ||
      (theme === "system" && resolvedTheme === "dark")
    ) {
      return <Moon className="size-4" />;
    } else {
      return <Sun className="size-4" />;
    }
  };

  return (
    <span className={cn("", className)} {...props}>
      {layout === 0 ? (
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="ghost" size="icon" />}>
            {getCurrentIcon()}
            <span className="sr-only">Toggle theme</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center">
            <div className="grid grid-cols-3 gap-1">
              <DropdownMenuItem
                disabled={theme === "light"}
                onClick={() => setTheme("light")}
                className=""
              >
                <Sun className="h-4 w-4 text-primary" />
                {/* Light */}
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={theme === "system"}
                onClick={() => setTheme("system")}
                className=""
              >
                <Monitor className="h-4 w-4 text-primary" />
                {/* System */}
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={theme === "dark"}
                onClick={() => setTheme("dark")}
                className=""
              >
                <Moon className="h-4 w-4 text-primary" />
                {/* Dark */}
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : layout === 1 ? (
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="ghost" size="icon" />}>
            {/* <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" /> */}
            {/* <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" /> */}
            {getCurrentIcon()}
            <span className="sr-only">Toggle theme</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")} className="">
              <Sun className="h-4 w-4" />
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")} className="">
              <Moon className="h-4 w-4" />
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")} className="">
              <Monitor className="h-4 w-4" />
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : layout === 2 ? (
        <Button variant="ghost" size="icon" onClick={cycleTheme}>
          {/* <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" /> */}
          {/* <MoonStar className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:-rotate-0 dark:scale-100" /> */}
          {/*<Moon className="h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />*/}
          {getCurrentIcon()}
          <span className="sr-only">Toggle theme (Light/Dark/System)</span>
          {/* <span className="sr-only">Toggle theme</span> */}
        </Button>
      ) : (
        <Switch
          checked={theme === "dark"}
          onCheckedChange={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="relative"
        />
      )}
    </span>
  );
}
