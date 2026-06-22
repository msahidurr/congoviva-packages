import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const labelVariants = cva(
  "text-sm font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50"
)

interface LabelProps extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>, VariantProps<typeof labelVariants> {
  required?: boolean;
}

const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  LabelProps
>(({ className, htmlFor, children, required, ...props }, ref) => {
  const [isRequired, setIsRequired] = React.useState(required || false);

  React.useEffect(() => {
    if (required !== undefined) {
      setIsRequired(required);
    } else if (htmlFor) {
      const element = document.getElementById(htmlFor);
      setIsRequired(element?.hasAttribute('required') || false);
    }
  }, [htmlFor, required]);

  return (
    <LabelPrimitive.Root
      ref={ref}
      className={cn(labelVariants(), className)}
      htmlFor={htmlFor}
      {...props}
    >
      {children}
      {isRequired && <span className="text-red-500 ml-1">*</span>}
    </LabelPrimitive.Root>
  );
})
Label.displayName = LabelPrimitive.Root.displayName

export { Label }
