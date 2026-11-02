import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-3 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-jpblue text-white shadow hover:bg-jpblue-600',
        secondary: 'border-transparent bg-jplight text-jpdark hover:bg-[#E2EDF9]',
        destructive: 'border-transparent bg-red-100 text-red-700',
        outline: 'border-[#D1E0EE] text-jpdark',
        cyan: 'border-transparent bg-[#E6FAFD] text-[#0A7385] font-semibold',
        success: 'border-transparent bg-emerald-100 text-emerald-800',
        warning: 'border-transparent bg-amber-100 text-amber-800',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
