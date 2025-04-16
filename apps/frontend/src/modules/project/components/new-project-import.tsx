import { GithubBranch } from '@/components/ui/github-branch'
import { Text } from '@/components/ui/text'
import { Banner } from '@/components/wrappers/banner'
import { SlashText } from '@/components/wrappers/slash-text'
import { Folder as FolderIcon } from 'lucide-react'
import { FaGithub } from 'react-icons/fa'
import { TbUserBolt } from 'react-icons/tb'
import { NewProjectImportForm } from './new-project-form'
import { File, Folder, Tree } from "@/components/wrappers/file-tree";
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
import { Button } from '@/components/ui/button'

export const NewProjectImport = () => {
    return (
        <Banner RightIcon={TbUserBolt} classNames={{ title: "text-xl", card: "bg-card" }} title='New Project'>
            <div className='bg-card p-5'>
                <Drawer>
                    <DrawerTrigger>
                        <Button variant={"outline"}>
                            Edit
                        </Button>
                    </DrawerTrigger>
                    <DrawerContent>
                        <DrawerHeader>
                            <DrawerTitle className='text-2xl'>Root Directory</DrawerTitle>
                            <DrawerDescription>Select the directory where your source code is located. To deploy a monorepo, create separate projects for other directories in the future.</DrawerDescription>
                        </DrawerHeader>
                        <FileTreeDemo />
                        <DrawerFooter className='flex flex-row items-center justify-between'>
                            <DrawerClose>
                                <Button variant="outline">Cancel</Button>
                            </DrawerClose>
                            <DrawerClose>
                                <Button variant="default">Continue</Button>
                            </DrawerClose>
                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>
                <div className='p-3 rounded-md border bg-background'>
                    <Text className='text-sm text-muted-foreground' content='Importing From Github' />
                    <div className='flex items-center gap-3 '>
                        <SlashText
                            icon={FaGithub}
                            first={'HitishRaoP'}
                            second={'rolt'}
                        />
                        <GithubBranch branch={'main'} />
                        <SlashText
                            classNames={{
                                root: "text-muted-foreground"
                            }}
                            icon={FolderIcon}
                            first={'apps'}
                            second={'frontend'}
                        />
                    </div>
                </div>
                <NewProjectImportForm />
            </div>
        </Banner>
    )
}


export function FileTreeDemo() {
    return (
        <div className="relative flex h-[180px] flex-col items-center justify-center overflow-hidden bg-background">
            <Tree
                className="overflow-hidden rounded-md bg-background p-2"
                elements={ELEMENTS}
            >
                <Folder element="src" value="1">
                    <Folder value="2" element="app">
                        <File value="3">
                            <p>layout.tsx</p>
                        </File>
                        <File value="4">
                            <p>page.tsx</p>
                        </File>
                    </Folder>
                    <Folder value="5" element="components">
                        <Folder value="6" element="ui">
                            <File value="7">
                                <p>button.tsx</p>
                            </File>
                        </Folder>
                        <File value="8">
                            <p>header.tsx</p>
                        </File>
                        <File value="9">
                            <p>footer.tsx</p>
                        </File>
                    </Folder>
                    <Folder value="10" element="lib">
                        <File value="11">
                            <p>utils.ts</p>
                        </File>
                    </Folder>
                </Folder>
            </Tree>
        </div>
    );
}

const ELEMENTS = [
    {
        id: "1",
        isSelectable: true,
        name: "src",
        children: [
            {
                id: "2",
                isSelectable: true,
                name: "app",
                children: [
                    {
                        id: "3",
                        isSelectable: true,
                        name: "layout.tsx",
                    },
                    {
                        id: "4",
                        isSelectable: true,
                        name: "page.tsx",
                    },
                ],
            },
            {
                id: "5",
                isSelectable: true,
                name: "components",
                children: [
                    {
                        id: "6",
                        isSelectable: true,
                        name: "header.tsx",
                    },
                    {
                        id: "7",
                        isSelectable: true,
                        name: "footer.tsx",
                    },
                ],
            },
            {
                id: "8",
                isSelectable: true,
                name: "lib",
                children: [
                    {
                        id: "9",
                        isSelectable: true,
                        name: "utils.ts",
                    },
                ],
            },
        ],
    },
];