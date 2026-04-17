import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-gold text-background hover:bg-gold-dark hover:shadow-gold",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-gold/40 bg-transparent text-gold hover:bg-gold/10 hover:border-gold hover:shadow-gold",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "text-gold hover:bg-gold/10",
        link: "text-gold underline-offset-4 hover:underline",
        info: "bg-tech-blue text-background hover:bg-tech-blue/90 hover:shadow-lg hover:shadow-tech-blue/25",
        warning: "bg-tech-red text-background hover:bg-tech-red/90 hover:shadow-lg hover:shadow-tech-red/25",
        "info-outline": "border border-tech-blue/40 bg-transparent text-tech-blue hover:bg-tech-blue/10 hover:border-tech-blue hover:shadow-lg hover:shadow-tech-blue/20",
        "warning-outline": "border border-tech-red/40 bg-transparent text-tech-red hover:bg-tech-red/10 hover:border-tech-red hover:shadow-lg hover:shadow-tech-red/20",
        hologram: "bg-gold text-background hover:bg-gold-dark hover:shadow-gold",
        tech: "border border-gold/40 bg-transparent text-gold hover:bg-gold/10 hover:border-gold hover:shadow-gold",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-12 rounded-lg px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
