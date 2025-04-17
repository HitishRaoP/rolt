"use client"

import { useState, useEffect } from "react"

export function useMenuContent() {
    const [isOnline, setIsOnline] = useState(true)

    const userEmail = "instapark.founder@gmail.com"
    const userName = "instapark"

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
        isOnline,
        userEmail,
        userName,
    }
}
