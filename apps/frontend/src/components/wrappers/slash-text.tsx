import { IconType } from "react-icons/lib";
import { Icon } from "../ui/icon";
import { cn } from "@/lib/utils";

type SlashTextProps = {
    icon?: IconType
    first: string
    second: string
    classNames?: {
        root?: string
        text?: string
    }
}

export const SlashText = ({ icon, first, second, classNames }: SlashTextProps) => {
    return (
        <div
            className={cn(
                "flex items-center rounded-full py-1.5 bg-secondary text-sm overflow-hidden",
                classNames?.root
            )}
        >
            {icon && (
                <Icon
                    type="react-icon"
                    classNames={{
                        root: "border-none flex-shrink-0",
                        icon: "w-4 h-4 text-foreground",
                    }}
                    iconName={icon}
                />
            )}
            <span className={cn("font-medium truncate", classNames?.text)}>
                {`${first}/${second}`}
            </span>
        </div>
    )
}
