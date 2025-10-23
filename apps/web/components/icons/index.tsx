import { cn } from "@/lib/utils"
import { AlertCircle, CircleAlert, CheckCircle, XCircle } from "lucide-react"

interface IconProps {
  className?: string
}

export function SuccessIcon({ className }: IconProps) {
  return (
    <CheckCircle className={cn("size-5 text-emerald-500 rounded-full", className)} />
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
      className={cn("size-5 text-primary-foreground rounded-full font-light", className)}
    />
  )
}

export function ErrorIcon({ className }: IconProps) {
  return (
    <XCircle className={cn("size-5 text-red-500 rounded-full", className)} />
  )
}
