"use client";

import { useEffect, useRef, type ComponentProps, type ReactNode } from "react";
import { Check, LoaderCircle, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "@/components/custom/toast";
import { cn } from "cn";
function getFormErrorMessage(error: unknown): string | undefined {
  if (typeof error === "string") return error || undefined;
  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof error.message === "string"
  )
    return error.message || undefined;
  if (error && typeof error === "object") {
    return Object.values(error)
      .flatMap((value) => (Array.isArray(value) ? value : [value]))
      .map(getFormErrorMessage)
      .find(Boolean);
  }
  return undefined;
}

export interface InputStatusProps {
  errors?: unknown[];
  checked?: boolean;
  checking?: boolean;
  onClear?: () => void;
  notifyErrors?: boolean;
  validLabel?: string;
  loadingLabel?: string;
  clearLabel?: string;
}

export function InputStatus({
  errors = [],
  checked = false,
  checking = false,
  onClear,
  notifyErrors = true,
  validLabel = "Valid",
  loadingLabel = "Loading",
  clearLabel = "Clear invalid input",
}: InputStatusProps) {
  const error = checked
    ? errors.map(getFormErrorMessage).find(Boolean)
    : undefined;
  const previousError = useRef<string | undefined>(undefined);
  useEffect(() => {
    if (notifyErrors && error && error !== previousError.current)
      toast.add({ type: "error", description: error });
    previousError.current = error ?? undefined;
  }, [error, notifyErrors]);

  if (checking)
    return (
      <Tooltip>
        <TooltipTrigger
          render={
            <button
              type="button"
              aria-label={loadingLabel}
              className="flex size-9 items-center justify-center rounded-md text-muted-foreground"
            />
          }
        >
          <LoaderCircle aria-hidden="true" className="size-4 animate-spin" />
        </TooltipTrigger>
        <TooltipContent side="top" align="end">
          {loadingLabel}
        </TooltipContent>
      </Tooltip>
    );
  if (error)
    return (
      <Tooltip>
        <TooltipTrigger
          render={
            <button
              type="button"
              onClick={onClear}
              aria-label={clearLabel}
              className="flex size-9 items-center justify-center rounded-md text-professional-error"
            />
          }
        >
          <X aria-hidden="true" className="size-4" />
        </TooltipTrigger>
        <TooltipContent side="top" align="end">
          {error}
        </TooltipContent>
      </Tooltip>
    );
  return checked ? (
    <Tooltip>
      <TooltipTrigger
        render={
          <button
            type="button"
            aria-label={validLabel}
            className="flex size-9 items-center justify-center rounded-md text-professional-success"
          />
        }
      >
        <Check aria-hidden="true" className="size-4" />
      </TooltipTrigger>
      <TooltipContent side="top" align="end">
        {validLabel}
      </TooltipContent>
    </Tooltip>
  ) : null;
}

export interface StatusInputProps
  extends ComponentProps<"input">, InputStatusProps {
  trailing?: ReactNode;
}

export function StatusInput({
  errors = [],
  checked = false,
  checking,
  onClear,
  trailing,
  notifyErrors,
  validLabel,
  loadingLabel,
  clearLabel,
  className,
  ...props
}: StatusInputProps) {
  const invalid =
    checked && errors.some((error) => Boolean(getFormErrorMessage(error)));
  return (
    <div className="flex w-full items-stretch">
      <div className="relative min-w-0 flex-1">
        <Input
          {...props}
          aria-invalid={invalid}
          className={cn(
            "pr-10",
            "aria-invalid:border-professional-error aria-invalid:ring-0 aria-invalid:focus-visible:border-professional-error aria-invalid:focus-visible:ring-3 aria-invalid:focus-visible:ring-professional-error/20 dark:aria-invalid:border-professional-error dark:aria-invalid:ring-0 dark:aria-invalid:focus-visible:ring-3 dark:aria-invalid:focus-visible:ring-professional-error/40",
            trailing &&
              "rounded-r-none focus-visible:relative focus-visible:z-10",
            className,
          )}
        />
        <div className="absolute inset-y-0 right-0 flex items-center">
          <span
            className="flex size-9 items-center justify-center"
            role="status"
          >
            <InputStatus
              errors={errors}
              checked={checked}
              checking={checking}
              onClear={onClear}
              notifyErrors={notifyErrors}
              validLabel={validLabel}
              loadingLabel={loadingLabel}
              clearLabel={clearLabel}
            />
          </span>
        </div>
      </div>
      {trailing}
    </div>
  );
}
