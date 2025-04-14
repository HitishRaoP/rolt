import { TbMenu } from "react-icons/tb";
import { IoIosNotificationsOutline } from "react-icons/io";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const HeaderMain = () => {
    return (
        <header className="flex items-center justify-between py-2">
            <Avatar className="w-10 h-10">
                <AvatarImage src="/rolt.png" className="rounded-lg" />
                <AvatarFallback className='border'>CN</AvatarFallback>
            </Avatar>
            <div className="flex gap-2">
                <IoIosNotificationsOutline className="h-6 w-6" />
                <TbMenu className="h-6 w-6" />
            </div>
        </header>
    )
}
