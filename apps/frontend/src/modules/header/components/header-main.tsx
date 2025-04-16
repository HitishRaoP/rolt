import { TbMenu } from "react-icons/tb";
import { IoIosNotificationsOutline } from "react-icons/io";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Icon } from "@/components/ui/icon";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Link } from "react-router";
import { MenuContent } from "./menu-content";

export const HeaderMain = () => {
    return (
        <header className="flex items-center justify-between p-4 bg-background md:px-8">
            <Link to={"/"}>
                <Avatar className="w-10 h-10">
                    <AvatarImage src="/rolt.png" className="rounded-lg" />
                    <AvatarFallback className='border'>CN</AvatarFallback>
                </Avatar>
            </Link>
            <div className="flex gap-2">
                <Drawer>
                    <DrawerTrigger>
                        <Icon type="react-icon" iconName={IoIosNotificationsOutline} />
                    </DrawerTrigger>
                    <DrawerContent>
                        <DrawerHeader>
                            <DrawerTitle>Are you absolutely sure?</DrawerTitle>
                            <DrawerDescription>This action cannot be undone.</DrawerDescription>
                        </DrawerHeader>
                        <DrawerFooter>
                            <Button>Submit</Button>
                            <DrawerClose>
                                <Button variant="outline">Cancel</Button>
                            </DrawerClose>
                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>
                <Sheet>
                    <SheetTrigger>
                        <Icon type="react-icon" iconName={TbMenu} />
                    </SheetTrigger>
                    <SheetContent className="w-full overflow-y-auto">
                        <MenuContent />
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    )
}
