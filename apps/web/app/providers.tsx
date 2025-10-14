import { ReactNode } from "react";
import TanstackProvider from "@/components/tanstack-provider";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
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
                <ReactQueryDevtools initialIsOpen={false} />
            </ThemeProvider>
        </TanstackProvider>
    )
}
