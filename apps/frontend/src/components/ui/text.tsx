import { cn } from "@/lib/utils"

type TextProps = {
    content: string
    className?: string
}
export const Text = ({ content, className }: TextProps) => {
    return (
        <div className={cn(className)}>
            {content}
        </div>
    )
}
