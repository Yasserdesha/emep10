import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-xl border border-white/12 bg-white/[0.03] px-3.5 py-2 text-sm text-[#F8FAFC] shadow-inner backdrop-blur-md transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[#64748B] hover:border-white/22 hover:bg-white/[0.05] focus-visible:outline-none focus-visible:border-[#FF1E27] focus-visible:ring-4 focus-visible:ring-[#FF1E27]/18 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
