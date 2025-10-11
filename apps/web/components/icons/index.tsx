import { cn } from "@/lib/utils"
import { AlertCircle, CircleCheck, CircleAlert, TriangleAlert } from "lucide-react"

interface IconProps {
  className?: string
}

export function SuccessIcon({ className }: IconProps) {
  return (
    <CircleCheck
      fill="#16a34a"
      className={cn("size-5 text-primary-foreground rounded-full", className)}
    />
  )
}

export function InfoIcon({ className }: IconProps) {
  return (
    <AlertCircle
      fill="#171717"
      className={cn("size-5 text-primary-foreground rounded-full", className)}
    />
  )
}

export function WarningIcon({ className }: IconProps) {
  return (
    <CircleAlert
      fill="#171717"
      className={cn("size-5 text-primary-foreground rounded-full", className)}
    />
  )
}

export function ErrorIcon({ className }: IconProps) {
  return (
    <TriangleAlert
      fill="#ef4444"
      className={cn("size-5 text-primary-foreground rounded-full", className)}
    />
  )
}
