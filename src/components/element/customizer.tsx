"use client"

import {
  type CSSProperties,
  type SVGProps,
  useState,
} from 'react'
import type { VariantProps } from 'class-variance-authority'
import { RadioPrimitive, RadioGroupPrimitive } from '@/components/custom/radio'
import { useTheme } from '@/providers/theme'
import {
  GROUND_COLOR_OPTIONS,
  CHART_COLOR_OPTIONS,
  DEFAULT_CUSTOMIZER_STATE,
  THEME_COLOR_OPTIONS,
  type ColorOption,
  type CustomizerState,
  useCustomizer,
} from '@/hooks/use-customizer'
import { Check, CircleCheck, RotateCcw, Settings, X } from 'lucide-react'
import { IconDir } from '@/components/icons/icon-dir'
import { IconLayoutCompact } from '@/components/icons/icon-layout-compact'
import { IconLayoutDefault } from '@/components/icons/icon-layout-default'
import { IconLayoutFull } from '@/components/icons/icon-layout-full'
import { IconSidebarFloating } from '@/components/icons/icon-sidebar-floating'
import { IconSidebarInset } from '@/components/icons/icon-sidebar-inset'
import { IconSidebarSidebar } from '@/components/icons/icon-sidebar-sidebar'
import { IconThemeDark } from '@/components/icons/icon-theme-dark'
import { IconThemeLight } from '@/components/icons/icon-theme-light'
import { IconThemeSystem } from '@/components/icons/icon-theme-system'
import { IconNavbarScroll } from '@/components/icons/icon-navbar-scroll'
import { IconNavbarSticky } from '@/components/icons/icon-navbar-sticky'
import { IconWidthCentered } from '@/components/icons/icon-width-centered'
import { IconWidthFull } from '@/components/icons/icon-width-full'
import { cn } from 'cn'
import { useDirection } from '@/providers/direction'
import {
  type Collapsible,
  type LayoutWidth,
  type NavbarBehavior,
  useLayout,
} from '@/providers/layout'
import { Button, buttonVariants } from '@/components/custom/button'
import { Badge } from '@/components/custom/badge'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/custom/drawer'
import { useSidebar } from '@/components/custom/sidebar'
import { useIsMobile } from '@/hooks/use-mobile'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/custom/sheet'

export interface CustomizerProps {
  className?: string
  variant?: VariantProps<typeof buttonVariants>['variant']
  size?: VariantProps<typeof buttonVariants>['size']
}

export function Customizer({
  className,
  variant = 'ghost',
  size = 'icon',
}: CustomizerProps) {
  const isMobile = useIsMobile()
  const [customizerOpen, setCustomizerOpen] = useState(false)
  const { open, setOpen } = useSidebar()
  const { customizer, resetCustomizer, setColor } = useCustomizer()
  const { defaultDir, dir, resetDir } = useDirection()
  const { setTheme, theme } = useTheme()
  const {
    collapsible,
    defaultCollapsible,
    defaultNavbarBehavior,
    defaultVariant,
    defaultWidth,
    navbarBehavior,
    resetLayout,
    variant: layoutVariant,
    width,
  } = useLayout()
  const showReset =
    theme !== 'system' ||
    dir !== defaultDir ||
    !open ||
    collapsible !== defaultCollapsible ||
    layoutVariant !== defaultVariant ||
    width !== defaultWidth ||
    navbarBehavior !== defaultNavbarBehavior ||
    customizer.ground !== DEFAULT_CUSTOMIZER_STATE.ground ||
    customizer.paint !== DEFAULT_CUSTOMIZER_STATE.paint ||
    customizer.chart !== DEFAULT_CUSTOMIZER_STATE.chart

  const handleReset = () => {
    setOpen(true)
    resetDir()
    setTheme('system')
    resetLayout()
    resetCustomizer()
  }

  const customizerBody = (
    <div className='no-scrollbar flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto'>
      <div className='flex flex-col gap-2 p-4'>
        <ThemeConfig />
        <SidebarConfig />
        <LayoutConfig />
        <DirConfig />
        <WidthConfig />
        <NavbarBehaviorConfig />
      </div>
      <Separator />
      <div className='p-4'>
        <CustomizerConfig customizer={customizer} setColor={setColor} />
      </div>
    </div>
  )

  const resetButton = showReset ? (
    <Button
      size='icon'
      variant='destructive'
      onClick={handleReset}
      aria-label='Reset all settings to default values'
    >
      <RotateCcw className='size-4' />
    </Button>
  ) : null

  if (!isMobile) {
    return (
      <Sheet open={customizerOpen} onOpenChange={setCustomizerOpen}>
        <SheetTrigger
          render={
            <Button
              size={size}
              variant={variant}
              className={className}
              aria-label='Open customizer'
            />
          }
        >
          <Settings aria-hidden='true' />
        </SheetTrigger>
        <SheetContent side='right' showCloseButton={false}>
          <SheetHeader className='relative border-b pr-24 text-start'>
            <SheetTitle>Customizer</SheetTitle>
            <SheetDescription>
              Customize and preview in real time.
            </SheetDescription>
            <div className='absolute top-4 right-4 flex items-center gap-2'>
              {resetButton}
              <SheetClose
                render={<Button size='icon' variant='ghost' />}
              >
                <X className='size-4' />
                <span className='sr-only'>Close</span>
              </SheetClose>
            </div>
          </SheetHeader>
          {customizerBody}
        </SheetContent>
      </Sheet>
    )
  }

  return (
    <Drawer
      modal
      open={customizerOpen}
      onOpenChange={setCustomizerOpen}
      swipeDirection='right'
    >
      <DrawerTrigger
        render={
          <Button
            size={size}
            variant={variant}
            className={className}
            aria-label='Open customizer'
          />
        }
      >
        <Settings aria-hidden='true' />
      </DrawerTrigger>
      <DrawerContent className='flex flex-col gap-0'>
        <DrawerHeader className='relative border-b p-4 pr-24 text-start'>
          <DrawerTitle>Customizer</DrawerTitle>
          <DrawerDescription>
            Customize and preview in real time.
          </DrawerDescription>
          <div className='absolute top-4 right-4 flex items-center gap-2'>
            {resetButton}
            <DrawerClose
              render={<Button size='icon' variant='ghost' />}
            >
              <X className='size-4' />
              <span className='sr-only'>Close</span>
            </DrawerClose>
          </div>
        </DrawerHeader>
        {customizerBody}
      </DrawerContent>
    </Drawer>
  )
}

function ColorGroup({
  label,
  options,
  value,
  onValueChange,
}: {
  label: string
  options: ColorOption[]
  value: string
  onValueChange: (value: string) => void
}) {
  return (
    <div className='flex flex-col gap-2'>
      <Label>{label}</Label>
      <RadioGroupPrimitive
        value={value}
        onValueChange={onValueChange}
        className='grid grid-cols-6 gap-2'
        aria-label={label}
      >
        {options.map((option) => (
          <RadioPrimitive.Root
            key={option.key}
            data-slot='color-radio-item'
            value={option.key}
            nativeButton
            render={<button type='button' />}
            aria-label={`${label}: ${option.label}`}
            title={option.label}
            className={cn(
              'group relative grid size-9 shrink-0 cursor-pointer place-items-center rounded-md border-0 p-0 shadow-none outline-none ring-1 ring-transparent',
              'transition focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
              'data-checked:ring-2 data-checked:ring-primary data-checked:ring-offset-2 data-checked:ring-offset-background'
            )}
            style={
              {
                backgroundColor: option.value,
                color:
                  option.value === 'var(--foreground)'
                    ? 'var(--background)'
                    : '#ffffff',
              } as CSSProperties
            }
          >
            <RadioPrimitive.Indicator>
              <Check className='size-4 stroke-[3] text-current drop-shadow-sm' />
            </RadioPrimitive.Indicator>
          </RadioPrimitive.Root>
        ))}
      </RadioGroupPrimitive>
    </div>
  )
}

function CustomizerConfig({
  customizer,
  setColor,
}: {
  customizer: CustomizerState
  setColor: (key: keyof CustomizerState, value: string) => void
}) {
  return (
    <section className='flex flex-col gap-2'>
      <Badge className='self-start'>Theming</Badge>
      <ColorGroup
        label='Ground Color'
        options={GROUND_COLOR_OPTIONS}
        value={customizer.ground}
        onValueChange={(value) => setColor('ground', value)}
      />
      <ColorGroup
        label='Paint Color'
        options={THEME_COLOR_OPTIONS}
        value={customizer.paint}
        onValueChange={(value) => setColor('paint', value)}
      />
      <ColorGroup
        label='Chart Color'
        options={CHART_COLOR_OPTIONS}
        value={customizer.chart}
        onValueChange={(value) => setColor('chart', value)}
      />
    </section>
  )
}

function SectionTitle({
  title,
  showReset = false,
  onReset,
  resetAriaLabel,
  className,
}: {
  title: string
  showReset?: boolean
  onReset?: () => void
  /** Shown on the small per-section reset (RotateCcw) for accessibility and tests. */
  resetAriaLabel?: string
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 text-sm font-semibold text-muted-foreground',
        className
      )}
    >
      {title}
      {showReset && onReset && (
        <Button
          type='button'
          size='icon'
          variant='default'
          className='size-5 rounded-sm'
          onClick={onReset}
          aria-label={resetAriaLabel}
        >
          <RotateCcw className='size-4' />
        </Button>
      )}
    </div>
  )
}

function RadioGroupItem({
  item,
  isTheme = false,
}: {
  item: {
    value: string
    label: string
    icon: (props: SVGProps<SVGSVGElement>) => React.ReactElement
  }
  isTheme?: boolean
}) {
  return (
    <RadioPrimitive.Root
      data-slot='drawer-radio-item'
      value={item.value}
      nativeButton
      render={<button type='button' />}
      className={cn(
        'group block w-full cursor-pointer appearance-none border-0 bg-transparent p-0 text-center outline-none',
        'transition duration-200 ease-in disabled:cursor-not-allowed disabled:opacity-50'
      )}
      aria-label={`Select ${item.label.toLowerCase()}`}
      aria-describedby={`${item.value}-description`}
    >
      <div
        data-slot='drawer-radio-preview'
        className={cn(
          'relative rounded-md border border-border',
          'group-data-checked:ring-2 group-data-checked:ring-primary group-data-checked:ring-offset-2 group-data-checked:ring-offset-background',
          'group-focus-visible:ring-2 group-focus-visible:ring-ring'
        )}
        role='img'
        aria-hidden='false'
        aria-label={`${item.label} option preview`}
      >
        <RadioPrimitive.Indicator className='absolute top-0 right-0 z-10 translate-x-1/2 -translate-y-1/2'>
          <CircleCheck
            className='size-5 fill-primary stroke-primary-foreground'
            aria-hidden='true'
          />
        </RadioPrimitive.Indicator>
        <item.icon
          className={cn(
            !isTheme &&
            'fill-muted-foreground stroke-muted-foreground group-data-checked:fill-primary group-data-checked:stroke-primary'
          )}
          aria-hidden='true'
        />
      </div>
      <div
        className='mt-1 text-xs'
        id={`${item.value}-description`}
        aria-live='polite'
      >
        {item.label}
      </div>
    </RadioPrimitive.Root>
  )
}

function ThemeConfig() {
  const { theme: currentTheme, setTheme } = useTheme()
  const defaultTheme = 'system'
  const theme = currentTheme ?? defaultTheme
  return (
    <div className='flex flex-col gap-2'>
      <Badge className='self-start'>Layout</Badge>
      <SectionTitle
        title='Theme'
        showReset={theme !== defaultTheme}
        onReset={() => setTheme(defaultTheme)}
        resetAriaLabel='Reset theme preference to default'
      />
      <RadioGroupPrimitive
        value={theme}
        onValueChange={setTheme}
        className='grid w-full max-w-md grid-cols-3 gap-2'
        aria-label='Select theme preference'
        aria-describedby='theme-description'
      >
        {[
          {
            value: 'system',
            label: 'System',
            icon: IconThemeSystem,
          },
          {
            value: 'light',
            label: 'Light',
            icon: IconThemeLight,
          },
          {
            value: 'dark',
            label: 'Dark',
            icon: IconThemeDark,
          },
        ].map((item) => (
          <RadioGroupItem key={item.value} item={item} isTheme />
        ))}
      </RadioGroupPrimitive>
      <div id='theme-description' className='sr-only'>
        Choose between system preference, light mode, or dark mode
      </div>
    </div>
  )
}

function SidebarConfig() {
  const { defaultVariant, variant, setVariant } = useLayout()
  return (
    <div className='flex flex-col gap-2 max-md:hidden'>
      <SectionTitle
        title='Sidebar'
        showReset={defaultVariant !== variant}
        onReset={() => setVariant(defaultVariant)}
        resetAriaLabel='Reset sidebar style to default'
      />
      <RadioGroupPrimitive
        value={variant}
        onValueChange={setVariant}
        className='grid w-full max-w-md grid-cols-3 gap-2'
        aria-label='Select sidebar style'
        aria-describedby='sidebar-description'
      >
        {[
          {
            value: 'sidebar',
            label: 'Sidebar',
            icon: IconSidebarSidebar,
          },
          {
            value: 'inset',
            label: 'Inset',
            icon: IconSidebarInset,
          },
          {
            value: 'floating',
            label: 'Floating',
            icon: IconSidebarFloating,
          },
        ].map((item) => (
          <RadioGroupItem key={item.value} item={item} />
        ))}
      </RadioGroupPrimitive>
      <div id='sidebar-description' className='sr-only'>
        Choose between inset, floating, or standard sidebar layout
      </div>
    </div>
  )
}

function LayoutConfig() {
  const { open, setOpen } = useSidebar()
  const { defaultCollapsible, collapsible, setCollapsible } = useLayout()

  const radioState = open ? 'default' : collapsible

  return (
    <div className='flex flex-col gap-2 max-md:hidden'>
      <SectionTitle
        title='Layout'
        showReset={radioState !== 'default'}
        onReset={() => {
          setOpen(true)
          setCollapsible(defaultCollapsible)
        }}
        resetAriaLabel='Reset layout options to default'
      />
      <RadioGroupPrimitive
        value={radioState}
        onValueChange={(v: string) => {
          if (v === 'default') {
            setOpen(true)
            return
          }
          setOpen(false)
          setCollapsible(v as Collapsible)
        }}
        className='grid w-full max-w-md grid-cols-3 gap-2'
        aria-label='Select layout style'
        aria-describedby='layout-description'
      >
        {[
          {
            value: 'default',
            label: 'Default',
            icon: IconLayoutDefault,
          },
          {
            value: 'icon',
            label: 'Compact',
            icon: IconLayoutCompact,
          },
          {
            value: 'offcanvas',
            label: 'Full layout',
            icon: IconLayoutFull,
          },
        ].map((item) => (
          <RadioGroupItem key={item.value} item={item} />
        ))}
      </RadioGroupPrimitive>
      <div id='layout-description' className='sr-only'>
        Choose between default expanded, compact icon-only, or full layout mode
      </div>
    </div>
  )
}

function DirConfig() {
  const { defaultDir, dir, setDir } = useDirection()
  return (
    <div className='flex flex-col gap-2'>
      <SectionTitle
        title='Direction'
        showReset={defaultDir !== dir}
        onReset={() => setDir(defaultDir)}
        resetAriaLabel='Reset text direction to default'
      />
      <RadioGroupPrimitive
        value={dir}
        onValueChange={setDir}
        className='grid w-full max-w-md grid-cols-3 gap-2'
        aria-label='Select site direction'
        aria-describedby='direction-description'
      >
        {[
          {
            value: 'ltr',
            label: 'Left to Right',
            icon: (props: SVGProps<SVGSVGElement>) => (
              <IconDir dir='ltr' {...props} />
            ),
          },
          {
            value: 'rtl',
            label: 'Right to Left',
            icon: (props: SVGProps<SVGSVGElement>) => (
              <IconDir dir='rtl' {...props} />
            ),
          },
        ].map((item) => (
          <RadioGroupItem key={item.value} item={item} />
        ))}
      </RadioGroupPrimitive>
      <div id='direction-description' className='sr-only'>
        Choose between left-to-right or right-to-left site direction
      </div>
    </div>
  )
}

function WidthConfig() {
  const { defaultWidth, setWidth, width } = useLayout()

  return (
    <div className='flex flex-col gap-2'>
      <SectionTitle
        title='Width'
        showReset={defaultWidth !== width}
        onReset={() => setWidth(defaultWidth)}
        resetAriaLabel='Reset page width to default'
      />
      <RadioGroupPrimitive
        value={width}
        onValueChange={(value) => setWidth(value as LayoutWidth)}
        className='grid w-full max-w-md grid-cols-3 gap-2'
        aria-label='Select page width'
        aria-describedby='width-description'
      >
        {[
          {
            value: 'narrow',
            label: 'Narrow',
            icon: IconWidthCentered,
          },
          {
            value: 'wide',
            label: 'Wide',
            icon: IconWidthFull,
          },
        ].map((item) => (
          <RadioGroupItem key={item.value} item={item} />
        ))}
      </RadioGroupPrimitive>
      <div id='width-description' className='sr-only'>
        Choose between a narrow container or a wide page
      </div>
    </div>
  )
}

function NavbarBehaviorConfig() {
  const {
    defaultNavbarBehavior,
    navbarBehavior,
    setNavbarBehavior,
  } = useLayout()

  return (
    <div className='flex flex-col gap-2'>
      <SectionTitle
        title='Navbar behavior'
        showReset={defaultNavbarBehavior !== navbarBehavior}
        onReset={() => setNavbarBehavior(defaultNavbarBehavior)}
        resetAriaLabel='Reset navbar behavior to default'
      />
      <RadioGroupPrimitive
        value={navbarBehavior}
        onValueChange={(value) =>
          setNavbarBehavior(value as NavbarBehavior)
        }
        className='grid w-full max-w-md grid-cols-3 gap-2'
        aria-label='Select navbar behavior'
        aria-describedby='navbar-behavior-description'
      >
        {[
          {
            value: 'sticky',
            label: 'Sticky',
            icon: IconNavbarSticky,
          },
          {
            value: 'scroll',
            label: 'Scroll',
            icon: IconNavbarScroll,
          },
        ].map((item) => (
          <RadioGroupItem key={item.value} item={item} />
        ))}
      </RadioGroupPrimitive>
      <div id='navbar-behavior-description' className='sr-only'>
        Choose whether the navbar stays visible or scrolls with the page
      </div>
    </div>
  )
}
