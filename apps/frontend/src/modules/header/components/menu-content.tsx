import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useMenuContent } from "../hooks/use-menu-content"
import { Link } from "react-router"
import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"
import { ModeToggle } from "@/components/wrappers/mode-toggle"
import { auth } from "@/lib/firebase"
import { FirebaseAuthentication } from "@capacitor-firebase/authentication"

export function MenuContent() {
    const { userEmail, userName, isOnline } = useMenuContent()
    const user = auth.currentUser
    console.log(user);

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8 bg-green-400">
                        <AvatarImage src={user?.photoURL as string} />
                        <AvatarFallback>{user?.displayName?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex items-center gap-1">
                        <span className="font-medium text-sm">{user?.displayName}&apos;s projects</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-col p-4 space-y-4 flex-1">
                {/* Contact Button */}
                <Button variant="outline" className="w-full shadow-none">
                    Contact
                </Button>

                {/* User Email */}
                <div className="flex items-center justify-between py-3 border-b">
                    <span className="text-sm">{user?.email}</span>
                    <Avatar className="h-8 w-8 bg-green-400">
                        <AvatarImage src={user?.photoURL as string} />
                        <AvatarFallback>{user?.displayName?.charAt(0)}</AvatarFallback>
                    </Avatar>
                </div>

                {/* Account Settings */}
                <Link to="/settings" className="flex items-center justify-between py-3 border-b">
                    <span className="text-sm">Account Settings</span>
                </Link>

                {/* Log Out */}
                <button onClick={async () => await auth.signOut()} className="flex items-center justify-between py-3 border-b w-full text-left">
                    <span className="text-sm">Log Out</span>
                </button>

                <div className="flex items-center justify-between">
                    <Text content="Theme" />
                    <ModeToggle />

                </div>
                {/* Resources Section */}
                <div className="mt-6">
                    <h3 className="text-sm font-medium mb-4">Resources</h3>
                    <div className="space-y-4">
                        <Link to="/help" className="flex items-center justify-between py-2">
                            <span className="text-sm">Help</span>
                        </Link>
                        <Link to="/" className="flex items-center justify-between py-2">
                            <span className="text-sm">Home page</span>
                            <Icon type="svg" classNames={{ root: "p-0 border-none" }} svgPath={"/rolt.svg"} />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
