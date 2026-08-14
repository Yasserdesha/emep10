import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF1E27] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98] select-none touch-manipulation cursor-pointer",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-b from-[#FF2B33] to-[#D31019] text-white border border-white/15 border-t-white/30 shadow-[0_1px_3px_rgba(0,0,0,0.4),0_4px_14px_rgba(211,16,25,0.45)] hover:from-[#FF3D44] hover:to-[#E6121B] hover:shadow-[0_2px_6px_rgba(0,0,0,0.4),0_6px_20px_rgba(255,30,39,0.6)]",
        destructive:
          "bg-red-600 text-white shadow-sm hover:bg-red-700",
        outline:
          "border border-white/12 bg-white/[0.04] text-white shadow-sm hover:bg-white/[0.08] hover:border-white/25 backdrop-blur-md",
        secondary:
          "bg-white/[0.06] text-white shadow-sm hover:bg-white/10 border border-white/10",
        ghost:
          "text-[#94A3B8] hover:bg-white/[0.06] hover:text-white",
        link:
          "text-[#FF1E27] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-lg px-3 text-xs",
        lg: "h-12 rounded-xl px-6 text-base font-bold",
        icon: "h-9 w-9 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
