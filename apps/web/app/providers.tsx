import { ReactNode } from "react";
import TanstackProvider from "@/components/tanstack-provider";
import { ThemeProvider } from "@/components/theme-provider";

export default function Providers({ children }: { children: ReactNode }) {
    return (
        <TanstackProvider>
            <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
            >
                {children}
            </ThemeProvider>
        </TanstackProvider>
    )
}
