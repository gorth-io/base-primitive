"use client";

import { useImperativeHandle, useLayoutEffect, useRef } from "react";
import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";

const buttonVariantsX = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-md border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all duration-150 ease-out outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 origin-center active:scale-x-[var(--button-press-x,1)] active:scale-y-[var(--button-press-y,1)] motion-reduce:transition-none motion-reduce:active:scale-100 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-6",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/80",
        outline:
          "border-border bg-background shadow-xs hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        ghost:
          "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
        link: "text-primary underline-offset-4 hover:underline",
        main: "bg-professional-main text-white hover:bg-professional-main/80",
        sub: "bg-professional-sub text-white hover:bg-professional-sub/80",
        secondary:
          "bg-professional-secondary text-white hover:bg-professional-secondary/80",
        success:
          "bg-professional-success text-white hover:bg-professional-success/80",
        info: "bg-professional-info text-white hover:bg-professional-info/80",
        warning:
          "bg-professional-warning text-white hover:bg-professional-warning/80",
        danger:
          "bg-professional-danger text-white hover:bg-professional-danger/80",
        light:
          "bg-professional-light text-white hover:bg-professional-light/80",
        dark: "bg-professional-dark text-white hover:bg-professional-dark/80",
        "primary-1":
          "bg-professional-primary-1 text-white hover:bg-professional-primary-1/80",
        "primary-2":
          "bg-professional-primary-2 text-white hover:bg-professional-primary-2/80",
        "primary-3":
          "bg-professional-primary-3 text-white hover:bg-professional-primary-3/80",
        "primary-4":
          "bg-professional-primary-4 text-white hover:bg-professional-primary-4/80",
        "primary-5":
          "bg-professional-primary-5 text-white hover:bg-professional-primary-5/80",
      },
      size: {
        default:
          "h-10 gap-1.5 px-2.5 in-data-[slot=button-group]:rounded-md has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-md border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all duration-150 ease-out outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 origin-center active:scale-x-[var(--button-press-x,1)] active:scale-y-[var(--button-press-y,1)] motion-reduce:transition-none motion-reduce:active:scale-100 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/80",
        outline:
          "border-border bg-background shadow-xs hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
        // secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
        ghost:
          "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        destructive:
          "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
        link: "text-primary underline-offset-4 hover:underline",
        main: "bg-professional-main text-white hover:bg-professional-main/80",
        sub: "bg-professional-sub text-white hover:bg-professional-sub/80",
        secondary:
          "bg-professional-secondary text-white hover:bg-professional-secondary/80",
        success:
          "bg-professional-success text-white hover:bg-professional-success/80",
        info: "bg-professional-info text-white hover:bg-professional-info/80",
        warning:
          "bg-professional-warning text-white hover:bg-professional-warning/80",
        danger:
          "bg-professional-danger text-white hover:bg-professional-danger/80",
        light:
          "bg-professional-light text-white hover:bg-professional-light/80",
        dark: "bg-professional-dark text-white hover:bg-professional-dark/80",
        "primary-1":
          "bg-professional-primary-1 text-white hover:bg-professional-primary-1/80",
        "primary-2":
          "bg-professional-primary-2 text-white hover:bg-professional-primary-2/80",
        "primary-3":
          "bg-professional-primary-3 text-white hover:bg-professional-primary-3/80",
        "primary-4":
          "bg-professional-primary-4 text-white hover:bg-professional-primary-4/80",
        "primary-5":
          "bg-professional-primary-5 text-white hover:bg-professional-primary-5/80",
      },
      size: {
        default:
          "h-9 gap-1.5 px-2.5 in-data-[slot=button-group]:rounded-md has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),8px)] px-2 text-xs in-data-[slot=button-group]:rounded-md has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1 rounded-[min(var(--radius-md),10px)] px-2.5 in-data-[slot=button-group]:rounded-md has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5",
        lg: "h-10 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        icon: "size-9",
        "icon-xs":
          "size-6 rounded-[min(var(--radius-md),8px)] in-data-[slot=button-group]:rounded-md [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-8 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-md",
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  ref,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  useImperativeHandle(ref, () => buttonRef.current!, []);

  useLayoutEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    const updateScale = () => {
      const { offsetWidth: width, offsetHeight: height } = button;
      button.style.setProperty(
        "--button-press-x",
        String(width > 2 ? (width - 2) / width : 1),
      );
      button.style.setProperty(
        "--button-press-y",
        String(height > 2 ? (height - 2) / height : 1),
      );
    };
    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(button);
    return () => observer.disconnect();
  }, []);

  return (
    <ButtonPrimitive
      ref={buttonRef}
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
