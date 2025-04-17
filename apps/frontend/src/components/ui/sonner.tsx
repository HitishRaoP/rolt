"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
    const { theme = "system" } = useTheme()

    return (
        <Sonner
            theme={theme as ToasterProps["theme"]}
            className="toaster group border p-4"
            richColors
            icons={{
                success: null,
                info: null,
                warning: null,
                error: null,
                loading: null,
            }}
            style={{
                border: "none"
            }}
            toastOptions={
                {
                    unstyled: true,
                    style: {
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "calc(var(--spacing) * 3.5)",
                        borderRadius: 'calc(var(--radius)',
                        borderStyle: 'var(--tw-border-style)',
                        borderWidth: "1px",
                        fontFamily: "Inter Variable, sans-serif",
                        fontWeight: "normal",
                        color: "var(--foreground)",
                    },
                    /**
                     * https://sonner.emilkowal.ski/styling
                     */
                    classNames: {
                        error:
                            '!bg-[#DA3036]',
                        success:
                            '!bg-[#0060D1]',
                        warning:
                            '!bg-[#FF990A] !text-background',
                        info: '!bg-background !text-foreground',
                    },
                }}
            {...props}

        />
    )
}

export { Toaster }
