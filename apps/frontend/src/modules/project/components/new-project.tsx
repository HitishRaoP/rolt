import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Banner } from '@/components/wrappers/banner'
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Searchbar } from '@/components/wrappers/search-bar'
import { Button } from '@/components/ui/button'
import { Icon } from '@/components/ui/icon'
import { TbBrandNextjs } from 'react-icons/tb'
import { Link } from 'react-router'
import { FaReact } from 'react-icons/fa'
import { Plus } from 'lucide-react'
import { ROLT_GITHUB_APP_INSTALLATION_URL } from '@/lib/constants'


export const NewProject = () => {
  return (
    <Banner title={"Let's build something new."} description={"To deploy a new Project, import an existing Git Repository "}>
      <Card className='shadow-none'>
        <CardHeader>
          <CardTitle className='py-4'>
            Import Git Repository
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="*:not-first:mt-2">
            <Select defaultValue="2">
              <SelectTrigger
                className="focus:ring-offset-0 focus:ring-0 mb-3  [&>span_svg]:text-muted-foreground/80 [&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_svg]:shrink-0"
              >
                <SelectValue placeholder="Select framework" />
              </SelectTrigger>
              <SelectContent className="[&_*[role=option]>span>svg]:text-muted-foreground/80 [&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2 [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center [&_*[role=option]>span]:gap-2 [&_*[role=option]>span>svg]:shrink-0">
                <SelectItem value="1">
                  <FaReact size={16} aria-hidden="true" />
                  <span className="truncate">React</span>
                </SelectItem>
                <SelectItem value="2">
                  <TbBrandNextjs size={16} aria-hidden="true" />
                  <span className="truncate">Next.js</span>
                </SelectItem>
                <Link to={ROLT_GITHUB_APP_INSTALLATION_URL}>
                  <SelectItem value="3">
                    <Icon classNames={{ root: "border-none px-0" }} size={16} iconName={Plus} />
                    <span className="truncate">Add Github Account</span>
                  </SelectItem>
                </Link>
              </SelectContent>
            </Select>
          </div>
          <Searchbar placeholder='Search...' classNames={{
            root: "mb-4"
          }} />
          <ScrollArea className="h-[285.3px] my-5 rounded-sm border overflow-hidden">
            {[...Array(5)].map((_, i, arr) => (
              <div
                key={i}
                className={`flex justify-between items-center text-sm ${i === arr.length - 1 ? "" : "border-b"}  p-3`}
              >
                <div className="flex items-center gap-2">
                  <Icon
                    classNames={{
                      root: "w-6 h-6 p-0",
                    }}
                    iconName={TbBrandNextjs}
                  />
                  <span className='line-clamp-1'>Instapark</span>
                </div>
                <Link to={"/new/import"}>
                  <Button size="sm">Import</Button>
                </Link>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>
    </Banner>
  )
}
