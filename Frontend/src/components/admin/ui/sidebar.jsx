
import * as React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { Menu, PanelRightClose, PanelRightOpen } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useIsMobile } from "@/hooks/use-mobile"

const SidebarContext = createContext({
  collapsed: false,
  setCollapsed: () => { },
  toggled: false,
  setToggled: () => { },
})

function useSidebar() {
  return useContext(SidebarContext)
}

function SidebarProvider({
  children,
  defaultCollapsed = false,
  defaultToggled = false,
  enableDesktopCollapse = true,
  collapsedClass = "w-16 md:w-16",
  expandedClass = "w-56 md:w-72",
  className,
  ...props
}) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed)
  const [toggled, setToggled] = useState(defaultToggled)

  const value = {
    collapsed,
    setCollapsed,
    toggled,
    setToggled,
    enableDesktopCollapse,
    collapsedClass,
    expandedClass,
    className,
  }

  return (
    <SidebarContext.Provider value={value}>
      {children}
    </SidebarContext.Provider>
  )
}

const Sidebar = React.forwardRef(({ className, children, ...props }, ref) => {
  const { collapsed, toggled, collapsedClass, expandedClass, className: providerClass } = useSidebar()
  const isMobile = useIsMobile()

  return (
    <>
      <div
        ref={ref}
        className={cn(
          "h-screen shrink-0 border-r bg-card text-card-foreground",
          isMobile && !toggled && "hidden",
          collapsed ? collapsedClass : expandedClass,
          toggled && isMobile && "absolute left-0 z-50",
          className,
          providerClass
        )}
        {...props}
      >
        <div className="h-full flex-col justify-between gap-2 overflow-y-auto overscroll-contain overflow-x-hidden">
          {children}
        </div>
      </div>
    </>
  )
})
Sidebar.displayName = "Sidebar"

const SidebarTrigger = React.forwardRef(({ className, children, ...props }, ref) => {
  const { collapsed, setCollapsed, setToggled, enableDesktopCollapse } = useSidebar()
  const isMobile = useIsMobile()

  const handleClick = () => {
    if (isMobile) {
      setToggled((prev) => !prev)
    } else {
      if (enableDesktopCollapse) {
        setCollapsed((prev) => !prev)
      }
    }
  }

  return (
    <Button
      ref={ref}
      variant="outline"
      size="icon"
      onClick={handleClick}
      className={cn("", className)}
      {...props}
    >
      {!isMobile ? (
        collapsed ? (
          <PanelRightOpen className="h-4 w-4" />
        ) : (
          <PanelRightClose className="h-4 w-4" />
        )
      ) : (
        <Menu className="h-4 w-4" />
      )}
    </Button>
  )
})
SidebarTrigger.displayName = "SidebarTrigger"

const SidebarContent = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex-1 overflow-y-auto px-3 py-4", className)}
      {...props}
    >
      {children}
    </div>
  )
})
SidebarContent.displayName = "SidebarContent"

const SidebarHeader = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex h-14 border-b px-3 py-2", className)}
      {...props}
    >
      {children}
    </div>
  )
})
SidebarHeader.displayName = "SidebarHeader"

const SidebarFooter = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("flex h-12 shrink-0 border-t px-3 py-2", className)}
      {...props}
    >
      {children}
    </div>
  )
})
SidebarFooter.displayName = "SidebarFooter"

const SidebarGroup = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("pb-4", className)}
      {...props}
    >
      {children}
    </div>
  )
})
SidebarGroup.displayName = "SidebarGroup"

const SidebarGroupContent = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("space-y-1", className)}
      {...props}
    >
      {children}
    </div>
  )
})
SidebarGroupContent.displayName = "SidebarGroupContent"

const SidebarGroupLabel = React.forwardRef(({ className, children, ...props }, ref) => {
  const { collapsed } = useSidebar()

  if (collapsed) return null

  return (
    <div
      ref={ref}
      className={cn("py-1 text-xs font-semibold text-muted-foreground", className)}
      {...props}
    >
      {children}
    </div>
  )
})
SidebarGroupLabel.displayName = "SidebarGroupLabel"

const SidebarGroupTitle = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("py-1 text-sm font-semibold tracking-tight", className)}
      {...props}
    >
      {children}
    </div>
  )
})
SidebarGroupTitle.displayName = "SidebarGroupTitle"

const SidebarMenu = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("space-y-0.5", className)}
      {...props}
    >
      {children}
    </div>
  )
})
SidebarMenu.displayName = "SidebarMenu"

const SidebarMenuItem = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("transition-colors", className)}
      {...props}
    >
      {children}
    </div>
  )
})
SidebarMenuItem.displayName = "SidebarMenuItem"

const SidebarMenuButton = React.forwardRef(({ className, asChild = false, children, ...props }, ref) => {
  const { collapsed } = useSidebar()
  const Comp = asChild ? React.Slot : "button"

  return (
    <Comp
      ref={ref}
      className={cn(
        "flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
        collapsed ? "justify-center" : "justify-start",
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  )
})
SidebarMenuButton.displayName = "SidebarMenuButton"

export {
  SidebarProvider,
  useSidebar,
  Sidebar,
  SidebarTrigger,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupTitle,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
}
