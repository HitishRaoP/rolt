import { cn } from "@/lib/utils"
import { IconType } from "react-icons/lib"

type IconProps = Omit<React.ComponentProps<IconType>, "className"> & {
    classNames?: {
        root?: string
        icon?: string
    }
    iconName: IconType
}

export const Icon = ({ classNames, iconName: IconProp, ...props }: IconProps) => {
    return (
        <div className={cn("border rounded-full p-1.5  flex items-center justify-center", classNames?.root)}>
            <IconProp size={22} className={cn("text-muted-foreground", classNames?.icon)} {...props} />
        </div>
    )
}
