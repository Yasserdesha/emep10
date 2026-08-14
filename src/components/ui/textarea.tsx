import * as React from "react";
import { cn } from "@/lib/utils";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[120px] w-full rounded-xl border border-white/12 bg-white/[0.03] px-3.5 py-2.5 text-sm text-[#F8FAFC] shadow-inner backdrop-blur-md transition-all placeholder:text-[#64748B] hover:border-white/22 hover:bg-white/[0.05] focus-visible:outline-none focus-visible:border-[#FF1E27] focus-visible:ring-4 focus-visible:ring-[#FF1E27]/18 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
