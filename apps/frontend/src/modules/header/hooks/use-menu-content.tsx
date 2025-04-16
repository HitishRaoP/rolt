"use client"

import { useState, useEffect } from "react"

type Theme = "light" | "dark" | "system"

export function useMenuContent() {
    const [activeTheme, setActiveTheme] = useState<Theme>("system")
    const [isOnline, setIsOnline] = useState(true)

    // In a real app, these would come from your auth context or API
    const userEmail = "instapark.founder@gmail.com"
    const userName = "instapark"

    // Handle theme changes
    useEffect(() => {
        // This would integrate with your theme system
        // For example, with next-themes or a custom theme implementation
        const applyTheme = () => {
            const root = window.document.documentElement

            if (activeTheme === "system") {
                const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
                root.classList.remove("light", "dark")
                root.classList.add(systemTheme)
            } else {
                root.classList.remove("light", "dark")
                root.classList.add(activeTheme)
            }
        }

        applyTheme()
    }, [activeTheme])

    // Simulate online status checking
    useEffect(() => {
        const checkOnlineStatus = () => {
            setIsOnline(navigator.onLine)
        }

        window.addEventListener("online", checkOnlineStatus)
        window.addEventListener("offline", checkOnlineStatus)

        return () => {
            window.removeEventListener("online", checkOnlineStatus)
            window.removeEventListener("offline", checkOnlineStatus)
        }
    }, [])

    return {
        activeTheme,
        setActiveTheme,
        isOnline,
        userEmail,
        userName,
    }
}
