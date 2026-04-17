import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-gold text-background hover:bg-gold-dark",
        secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground border-border",
        success: "border-transparent bg-gold text-background hover:bg-gold-dark",
        info: "border-transparent bg-tech-blue text-background hover:bg-tech-blue/90",
        warning: "border-transparent bg-tech-red text-background hover:bg-tech-red/90",
        "success-outline": "border-gold/40 text-gold bg-gold/10 hover:bg-gold/20",
        "info-outline": "border-tech-blue/40 text-tech-blue bg-tech-blue/10 hover:bg-tech-blue/20",
        "warning-outline": "border-tech-red/40 text-tech-red bg-tech-red/10 hover:bg-tech-red/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
