import { ChangeEvent, HTMLInputAutoCompleteAttribute, useRef, useState } from "react"
import { cubicBezier, motion } from "motion/react"
import { cn } from "@/lib/utils"
import { Input } from "./ui/input"

const LABEL_TRANSITION = {
    duration: 0.28,
    ease: cubicBezier(0.4, 0, 0.2, 1),
}

export interface AnimatedInputProps {
    id: string
    name: string
    value: string
    defaultValue?: string
    onBlur: () => void
    onChange: (e: ChangeEvent<HTMLInputElement>) => void
    label: string
    placeholder?: string
    autoComplete?: HTMLInputAutoCompleteAttribute
    disabled?: boolean
    className?: string
    inputClassName?: string
    labelClassName?: string
    icon?: React.ReactNode
}

export default function AnimatedInput({
    id,
    name,
    value,
    defaultValue = "",
    onBlur,
    onChange,
    autoComplete,
    label,
    disabled = false,
    className = "",
    labelClassName = "",
    icon,
}: AnimatedInputProps) {

    const [internalValue] = useState(defaultValue)
    const [isFocused, setIsFocused] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    const isControlled = value !== undefined;
    const val = isControlled ? value : internalValue;
    const isFloating = !!val || isFocused;

    return (
        <div className={`relative flex items-center ${className}`}>
            {icon && (
                <span className="absolute top-1/2 left-3 -translate-y-1/2">{icon}</span>
            )}
            <Input
                ref={inputRef}
                id={id}
                name={name}
                value={value}
                type="text"
                disabled={disabled}
                onChange={onChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => {
                    onBlur();
                    setIsFocused(false);
                }}
                autoComplete={autoComplete}
            />
            <motion.label
                className={cn("text-sm pointer-events-none absolute top-1/2 left-3 origin-left -translate-y-1/2 rounded-sm border border-transparent px-2 py-0.5 transition-all", isFloating && "bg-background", labelClassName)}
                animate={
                    isFloating
                        ? {
                            y: -24,
                            scale: 0.85,
                            color: "var(--foreground)",
                            borderColor: "var(--muted-foreground)",
                        }
                        : { y: 0, scale: "1", color: "var(--muted-foreground)" }
                }
                transition={LABEL_TRANSITION}
                style={{
                    zIndex: 2,
                }}
            >
                {label}
            </motion.label>
        </div>
    )
}
