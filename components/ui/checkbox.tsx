import * as React from "react";

import { cn } from "@/lib/utils";

function Checkbox({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type="checkbox"
      className={cn("h-5 w-5 shrink-0 rounded-md border border-border accent-primary", className)}
      {...props}
    />
  );
}

export { Checkbox };
