import { SearchIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import React from "react"
import { cn } from "@/lib/utils"

type SearchbarProps = Omit<React.ComponentProps<"input">, "className"> & {
    classNames?: {
        root?: string
        input?: string
    }
}

export function Searchbar({ classNames, ...props }: SearchbarProps) {
    return (
        <div className="*:not-first:mt-2 w-full">
            <div className={cn("relative", classNames?.root)}>
                <Input
                    {...props}
                    className={cn("peer ps-9  text-sm", classNames?.input)}
                    type="search"
                />
                <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
                    <SearchIcon size={16} />
                </div>
            </div>
        </div>
    )
}
