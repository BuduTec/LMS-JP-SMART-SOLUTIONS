import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
  {
    variants: {
      variant: {
        default: 'bg-jpblue text-white hover:bg-jpblue-600 shadow-jpblue hover:shadow-lg',
        destructive: 'bg-red-600 text-white hover:bg-red-700 shadow-sm',
        outline: 'border-2 border-[#D1E0EE] bg-white text-jpdark hover:bg-jplight hover:border-jpblue',
        secondary: 'bg-jpdark text-white hover:bg-jpdark-800',
        ghost: 'hover:bg-jplight hover:text-jpblue',
        link: 'text-jpblue underline-offset-4 hover:underline p-0 h-auto font-medium',
        cyan: 'bg-jpcyan text-jpdark font-semibold hover:bg-[#0eb0c9]',
      },
      size: {
        default: 'h-11 px-6 py-2.5',
        sm: 'h-9 px-4 text-xs',
        lg: 'h-12 px-8 text-base',
        icon: 'h-10 w-10 p-0 rounded-full',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
