import { Input } from "@/components/ui/input"
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
  return (
    <div className="space-y-6 p-5">
      <div className="flex gap-3">
        <Input placeholder="Search Repositories and Projects" className="text-sm" />
        <Drawer>
          <DrawerTrigger>
            <Icon classNames={{ root: "rounded-md p-2 bg-foreground", icon: "text-background" }} iconName={Plus} />
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
