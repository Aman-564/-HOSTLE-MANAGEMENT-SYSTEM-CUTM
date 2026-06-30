import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-luxe hover:opacity-92",
        secondary: "bg-card text-foreground border hover:bg-muted",
        ghost: "hover:bg-muted",
        dark: "bg-slate-950 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-950"
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 px-3",
        icon: "h-10 w-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);

export function Button({ className, variant, size, asChild = false, ...props }) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

export function Card({ className, ...props }) {
  return <div className={cn("rounded-lg border bg-card text-card-foreground shadow-luxe", className)} {...props} />;
}

export function Badge({ className, ...props }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold text-muted-foreground",
        className
      )}
      {...props}
    />
  );
}
