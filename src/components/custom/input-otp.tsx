"use client";

import type { ComponentProps, ReactNode } from "react";
import { cn } from "cn";
import {
  InputOTP as BaseInputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  InputStatus,
  type InputStatusProps,
} from "@/components/custom/input-status";

export interface InputOTPProps
  extends
    Omit<ComponentProps<typeof BaseInputOTP>, "children" | "render">,
    InputStatusProps {
  children?: ReactNode;
  groupClassName?: string;
  slotClassName?: string;
}

export function InputOTP({
  errors = [],
  checked = false,
  checking,
  onClear,
  notifyErrors,
  validLabel,
  loadingLabel,
  clearLabel,
  maxLength = 6,
  children,
  groupClassName,
  slotClassName,
  ...props
}: InputOTPProps) {
  const invalid = checked && errors.some((error) => Boolean(error));
  return (
    <div className="relative w-full pr-9">
      <BaseInputOTP {...props} maxLength={maxLength} aria-invalid={invalid}>
        {children ?? (
          <InputOTPGroup className={cn("gap-4", groupClassName)}>
            {Array.from({ length: maxLength }, (_, index) => (
              <InputOTPSlot
                key={index}
                index={index}
                aria-invalid={invalid}
                className={cn(
                  "size-9 rounded-md border aria-invalid:border-professional-error data-[active=true]:aria-invalid:ring-professional-error/20 dark:data-[active=true]:aria-invalid:ring-professional-error/40",
                  slotClassName,
                )}
              />
            ))}
          </InputOTPGroup>
        )}
      </BaseInputOTP>
      <span
        className="absolute inset-y-0 right-0 flex w-9 items-center justify-center"
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
  );
}

export {
  InputOTPGroup,
  InputOTPSlot,
  InputOTPSeparator,
} from "@/components/ui/input-otp";
