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
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"

export const HeaderMain = () => {
    return (
        <header className="flex items-center justify-between p-4  md:px-8">
            <Avatar className="w-10 h-10">
                <AvatarImage src="/rolt.png" className="rounded-lg" />
                <AvatarFallback className='border'>CN</AvatarFallback>
            </Avatar>
            <div className="flex gap-2">
                <Drawer>
                    <DrawerTrigger>
                        <Icon iconName={IoIosNotificationsOutline} />
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
                        <Icon iconName={TbMenu} />
                    </SheetTrigger>
                    <SheetContent className="w-full">
                        <SheetHeader>
                            <SheetTitle>Are you absolutely sure?</SheetTitle>
                            <SheetDescription>
                                This action cannot be undone. This will permanently delete your account
                                and remove your data from our servers.
                            </SheetDescription>
                        </SheetHeader>
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    )
}
