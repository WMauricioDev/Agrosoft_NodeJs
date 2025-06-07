import { Spinner } from "@heroui/react";

interface CustomSpinnerProps {
  label: string;
  variant: "default" | "simple" | "gradient" | "spinner" | "wave" | "dots";
  size?: 'lg' | 'sm' | 'md'
  className?: string;
  color : "foreground"  | "primary"  |  "secondary"  | "success"  | "warning" | "danger"
}

export default function CustomSpinner({ label, variant, className, color}: CustomSpinnerProps) {
  return (
    <Spinner
      label={label}
      variant={variant}
      color={color}
      className={className}
      classNames={{ label: "text-foreground mt-4" }}
    />
  );
}
