"use client";

import Link from "next/link";

import { useEffect, useState, type ComponentProps } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  EllipsisVertical,
  RotateCw,
  Check,
  Loader2,
  UserPlus,
  LogOut,
} from "lucide-react";
import {
  NavAccount,
  NavDropdownItem,
  NavUser as PrimitiveNavUser,
} from "@/components/dashboard/nav-user";
import { Button } from "@/components/custom/button";
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

export interface AccountSwitcherProps
  extends ComponentProps<typeof PrimitiveNavUser>, AccountSwitcherItemsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAccountsOpenChange?: (enabled: boolean) => void;
}

export function AccountSwitcher(props: AccountSwitcherProps) {
  const {
    user,
    nav,
    auth,
    type,
    size = "icon",
    side = "bottom",
    align = "end",
  } = props;
  const { isMobile } = useSidebar();
  const {
    open,
    onOpenChange: setOpen,
    onAccountsOpenChange,
    accounts,
    loading,
    pendingSessionId,
    error,
    onSelect,
    onRetry,
    addAccountHref,
    maxAccounts,
  } = props;
  const reduceMotion = useReducedMotion();
  const [view, setView] = useState<"profile" | "accounts">("profile");
  useEffect(() => {
    if (!open) setView("profile");
  }, [open]);
  const busy = pendingSessionId !== null;
  useEffect(() => {
    onAccountsOpenChange?.(open && view === "accounts" && auth.authenticated);
  }, [open, view, auth.authenticated, onAccountsOpenChange]);

  if (!auth.authenticated) return <PrimitiveNavUser {...props} />;

  const menu = (
    <DropdownMenu
      open={open}
      onOpenChange={(nextOpen) => {
        if (nextOpen && busy) return;
        setOpen(nextOpen);
        if (!nextOpen) setView("profile");
      }}
    >
      <DropdownMenuTrigger
        disabled={busy}
        aria-label={`Account menu for ${user.name}`}
        render={
          type === "navbar" ? (
            <Button variant="ghost" size="icon" className="p-0" />
          ) : (
            <SidebarMenuButton
              size={size === "lg" ? "lg" : "default"}
              className={
                size === "lg"
                  ? "h-14 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  : "group-data-[collapsible=icon]:p-0! data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground md:p-0"
              }
            />
          )
        }
      >
        <NavAccount user={user} showName={type === "sidebar"} />
        {type === "sidebar" ? (
          <>
            <EllipsisVertical className="ml-auto size-4 shrink-0" />
          </>
        ) : null}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[248px] min-w-[248px] rounded-lg duration-200"
        side={type === "navbar" || isMobile ? "bottom" : side}
        align={align}
        sideOffset={4}
      >
        <motion.div
          layout
          className="relative overflow-hidden"
          transition={{ duration: reduceMotion ? 0 : 0.2 }}
        >
          <AnimatePresence initial={false} mode="popLayout">
            <motion.div
              key={view}
              initial={{
                opacity: 0,
                x: reduceMotion ? 0 : view === "accounts" ? 24 : -24,
              }}
              animate={{ opacity: 1, x: 0 }}
              exit={{
                opacity: 0,
                x: reduceMotion ? 0 : view === "accounts" ? 24 : -24,
              }}
              transition={{ duration: reduceMotion ? 0 : 0.18 }}
            >
              {view === "accounts" ? (
                <>
                  <DropdownMenuItem
                    className="h-9 w-[240px]"
                    closeOnClick={false}
                    disabled={busy}
                    onClick={() => setView("profile")}
                  >
                    <ArrowLeft className="size-4" />
                    Back
                  </DropdownMenuItem>
                  <AccountSwitcherItems
                    accounts={accounts}
                    loading={loading}
                    pendingSessionId={pendingSessionId}
                    error={error}
                    onSelect={onSelect}
                    onRetry={onRetry}
                    addAccountHref={addAccountHref}
                    maxAccounts={maxAccounts}
                  />
                </>
              ) : (
                <>
                  <DropdownMenuItem
                    className="h-14 w-full rounded-md bg-muted/50"
                    closeOnClick={false}
                    disabled={busy}
                    onClick={() => {
                      onRetry();
                      setView("accounts");
                    }}
                  >
                    <NavAccount user={user} />
                    <RotateCw
                      className="ml-auto size-4 shrink-0"
                      aria-label="Switch account"
                    />
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    {nav.main.map((item) => (
                      <NavDropdownItem
                        key={item.url}
                        icon={item.icon}
                        title={item.title}
                        link={item.url}
                      />
                    ))}
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <NavDropdownItem
                    icon={LogOut}
                    title="Sign out"
                    action={auth.logout}
                  />
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return type === "sidebar" ? (
    <SidebarMenu>
      <SidebarMenuItem>{menu}</SidebarMenuItem>
    </SidebarMenu>
  ) : (
    menu
  );
}

export interface SwitcherAccount {
  sessionId: string;
  user: { id: string; name: string; email: string; image?: string | null };
  active: boolean;
}

export interface AccountSwitcherItemsProps {
  accounts: SwitcherAccount[];
  loading: boolean;
  pendingSessionId: string | null;
  error: string | null;
  onSelect: (account: SwitcherAccount) => void;
  onRetry: () => void;
  addAccountHref: string;
  maxAccounts?: number;
}

export function AccountSwitcherItems({
  accounts,
  loading,
  pendingSessionId,
  error,
  onSelect,
  onRetry,
  addAccountHref,
  maxAccounts = 5,
}: AccountSwitcherItemsProps) {
  const busy = pendingSessionId !== null;

  return (
    <>
      <DropdownMenuGroup aria-busy={loading || busy}>
        <DropdownMenuLabel>Accounts on this browser</DropdownMenuLabel>
        {loading ? (
          <p
            role="status"
            className="flex h-9 items-center gap-2 px-2.5 text-sm text-muted-foreground"
          >
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
            Loading accounts...
          </p>
        ) : null}
        {!loading && !error && !accounts.length ? (
          <p
            role="status"
            className="px-2.5 py-2 text-sm text-muted-foreground"
          >
            No accounts signed in on this browser.
          </p>
        ) : null}
        {accounts.map((account) => (
          <DropdownMenuItem
            key={account.sessionId}
            nativeButton
            render={(props) => (
              <SidebarMenuButton
                {...props}
                type="button"
                size="lg"
                className="h-14 w-60 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              />
            )}
            disabled={loading || busy}
            closeOnClick={false}
            aria-label={`${account.user.name}, ${account.user.email}${account.active ? ", active account" : ""}`}
            onClick={() => onSelect(account)}
          >
            <NavAccount
              user={{
                name: account.user.name,
                email: account.user.email,
                avatar: account.user.image ?? "",
              }}
            />
            {pendingSessionId === account.sessionId ? (
              <Loader2
                className="ml-auto size-4 animate-spin"
                aria-label="Switching account"
              />
            ) : account.active ? (
              <Check className="ml-auto size-4" aria-label="Active account" />
            ) : (
              <span className="ml-auto size-4 shrink-0" aria-hidden="true" />
            )}
          </DropdownMenuItem>
        ))}
        {error ? (
          <>
            <p role="alert" className="px-2.5 py-2 text-sm text-destructive">
              {error}
            </p>
            <DropdownMenuItem
              className="h-9"
              closeOnClick={false}
              disabled={busy || loading}
              onClick={onRetry}
            >
              <RotateCw className="size-4" />
              Try again
            </DropdownMenuItem>
          </>
        ) : null}
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      {accounts.length >= maxAccounts ? (
        <p className="px-2.5 py-2 text-xs text-muted-foreground">
          Sign out of an account before adding another. Up to {maxAccounts}{" "}
          accounts are supported.
        </p>
      ) : null}
      <DropdownMenuItem
        className="h-9 w-60"
        disabled={loading || busy || accounts.length >= maxAccounts}
        render={<Link href={addAccountHref} />}
      >
        <UserPlus className="size-4" />
        Add account
      </DropdownMenuItem>
    </>
  );
}
