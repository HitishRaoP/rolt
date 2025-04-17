import { ProjectCard } from "./project-card"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { Plus } from "lucide-react"
import { Link } from "react-router"
import { FirebaseAuthentication } from '@capacitor-firebase/authentication';
import { Searchbar } from "@/components/wrappers/search-bar"
import { signInWithGithub } from "@/hooks/use-auth"
import { toast } from "sonner"
import { FaGithub } from "react-icons/fa"

const NEW_NAV_LINKS = [
  {
    name: "Project",
    path: "/new"
  },
  {
    name: "Github",
    path: "/project"
  },
  {
    name: "Store",
    path: "/project"
  }
]

export const HomeMain = () => {
  const handleLogin = async () => {
    try {
      const user = await signInWithGithub()
      toast.success(`Welcome ${user.displayName || user.email}`)
    } catch {
      toast.error("Login failed.")
    }
  }
  async function log() {
    const { user } = await FirebaseAuthentication.getCurrentUser()
    console.log(user);
  }

  log()
  return (
    <div className="space-y-6 p-5 text-foreground">
      <Button onClick={handleLogin} variant={"outline"}>
        <Icon type="react-icon" classNames={{ root: "border-none" }} iconName={FaGithub} />
        Sign in with GitHub
      </Button>
      <div className="flex gap-3">
        <Searchbar placeholder="Search Repositories and Projects" />
        <Drawer>
          <DrawerTrigger>
            <Icon type="react-icon" classNames={{ root: "rounded-md p-2 bg-foreground", icon: "text-background" }} iconName={Plus} />
          </DrawerTrigger>
          <DrawerContent>
            {
              NEW_NAV_LINKS.map((p, i) => (
                <DrawerClose>
                  <Link to={p.path} key={i}>
                    <Button className='py-7 w-full text-md justify-start' variant="ghost">
                      {p.name}
                    </Button>
                  </Link>
                </DrawerClose>
              ))
            }
          </DrawerContent>
        </Drawer>
      </div>
      <ProjectCard />
    </div>
  )
}
