import { cn } from "@/lib/utils"
import { IconType } from "react-icons/lib"

type IconProps = React.ComponentProps<IconType> & {
    classNames?: {
        root?: string
    }
    iconName: IconType
}

export const Icon = ({ classNames, iconName: IconProp, ...props }: IconProps) => {
    return (
        <div className={cn("border rounded-full p-1.5  flex items-center justify-center", classNames?.root)}>
            <IconProp size={22} className="text-muted-foreground" {...props} />
        </div>
    )
}
