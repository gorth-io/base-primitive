"use client";

import { useState, type ComponentProps } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/custom/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  StatusInput,
  type InputStatusProps,
} from "@/components/custom/input-status";

export interface PasswordInputProps
  extends ComponentProps<"input">, InputStatusProps {
  showPasswordLabel?: string;
  hidePasswordLabel?: string;
}

export function PasswordInput({
  className,
  showPasswordLabel = "Show password",
  hidePasswordLabel = "Hide password",
  ...props
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <StatusInput
      {...props}
      type={visible ? "text" : "password"}
      className={className}
      trailing={
        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="size-9 shrink-0 rounded-l-none rounded-r-md border border-l-0 border-input bg-transparent shadow-none hover:bg-transparent dark:bg-input/30 dark:hover:bg-input/30"
                aria-label={visible ? hidePasswordLabel : showPasswordLabel}
                aria-pressed={visible}
                onClick={() => setVisible((current) => !current)}
              />
            }
          >
            {visible ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </TooltipTrigger>
          <TooltipContent side="top" align="end">
            {visible ? hidePasswordLabel : showPasswordLabel}
          </TooltipContent>
        </Tooltip>
      }
    />
  );
}
