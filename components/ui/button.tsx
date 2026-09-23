import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  // min-h (pas h) + whitespace normal : un libellé français un peu long ne force jamais
  // le bouton plus large que son conteneur sur petit écran, il passe sur deux lignes.
  "inline-flex items-center justify-center gap-2 text-center rounded-full text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-foreground hover:bg-primary-hover shadow-sm",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary-hover shadow-sm",
        outline:
          "border-2 border-border bg-transparent text-foreground hover:bg-muted",
        ghost: "bg-transparent text-foreground hover:bg-muted",
        link: "bg-transparent text-primary underline-offset-4 hover:underline p-0 h-auto whitespace-nowrap",
      },
      size: {
        default: "min-h-12 px-6 py-3",
        lg: "min-h-14 px-8 py-4 text-lg",
        sm: "min-h-10 px-4 text-sm",
        icon: "h-12 w-12 shrink-0 whitespace-nowrap",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
