/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp } from "lucide-react";

import { cn } from "../../lib/utils";

// Cast all Radix primitives to any to fix React version mismatch
// (bigint not assignable to ReactNode — @types/react version conflict)

const SelectRoot = SelectPrimitive.Root as any;
const SelectGroupPrimitive = SelectPrimitive.Group as any;
const SelectValuePrimitive = SelectPrimitive.Value as any;
const SelectTriggerPrimitive = SelectPrimitive.Trigger as any;
const SelectIconPrimitive = SelectPrimitive.Icon as any;
const SelectPortalPrimitive = SelectPrimitive.Portal as any;
const SelectContentPrimitive = SelectPrimitive.Content as any;
const SelectScrollUpPrimitive = SelectPrimitive.ScrollUpButton as any;
const SelectScrollDownPrimitive = SelectPrimitive.ScrollDownButton as any;
const SelectViewportPrimitive = SelectPrimitive.Viewport as any;
const SelectLabelPrimitive = SelectPrimitive.Label as any;
const SelectItemPrimitive = SelectPrimitive.Item as any;
const SelectItemIndicatorPrimitive = SelectPrimitive.ItemIndicator as any;
const SelectItemTextPrimitive = SelectPrimitive.ItemText as any;
const SelectSeparatorPrimitive = SelectPrimitive.Separator as any;

const Select = SelectRoot;
const SelectGroup = SelectGroupPrimitive;
const SelectValue = SelectValuePrimitive;

const SelectTrigger = React.forwardRef<
  HTMLButtonElement,
  React.HTMLAttributes<HTMLButtonElement> & { disabled?: boolean }
>(({ className, children, ...props }, ref) => (
  <SelectTriggerPrimitive
    ref={ref}
    className={cn(
      "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
      className,
    )}
    {...props}
  >
    {children}
    <SelectIconPrimitive asChild>
      <ChevronDown className="h-4 w-4 opacity-50" />
    </SelectIconPrimitive>
  </SelectTriggerPrimitive>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectScrollUpButton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <SelectScrollUpPrimitive
    ref={ref}
    className={cn("flex cursor-default items-center justify-center py-1", className)}
    {...props}
  >
    <ChevronUp className="h-4 w-4" />
  </SelectScrollUpPrimitive>
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;

const SelectScrollDownButton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <SelectScrollDownPrimitive
    ref={ref}
    className={cn("flex cursor-default items-center justify-center py-1", className)}
    {...props}
  >
    <ChevronDown className="h-4 w-4" />
  </SelectScrollDownPrimitive>
));
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName;

const SelectContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { position?: "popper" | "item-aligned" }
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPortalPrimitive>
    <SelectContentPrimitive
      ref={ref}
      className={cn(
        "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className,
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectViewportPrimitive
        className={cn(
          "p-1",
          position === "popper" &&
            "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]",
        )}
      >
        {children}
      </SelectViewportPrimitive>
      <SelectScrollDownButton />
    </SelectContentPrimitive>
  </SelectPortalPrimitive>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectLabel = React.forwardRef<
  HTMLLabelElement,
  React.HTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <SelectLabelPrimitive
    ref={ref}
    className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)}
    {...props}
  />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

const SelectItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value: string; disabled?: boolean }
>(({ className, children, ...props }, ref) => (
  <SelectItemPrimitive
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 focus:bg-accent focus:text-accent-foreground",
      className,
    )}
    {...props}
  >
    <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectItemIndicatorPrimitive>
        <Check className="h-4 w-4" />
      </SelectItemIndicatorPrimitive>
    </span>
    <SelectItemTextPrimitive>{children}</SelectItemTextPrimitive>
  </SelectItemPrimitive>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <SelectSeparatorPrimitive
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
};