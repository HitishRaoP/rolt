import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RainbowButton } from "@/components/wrappers/rainbow-button"
import { useNewProjectForm } from "../hooks/use-new-project-form"
import { Project } from "@rolt/types/Project"
import { useId } from "react"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export const NewProjectImportForm = () => {
    const { form } = useNewProjectForm();

    function onSubmit(values: Project) {
        console.log(values)
    }
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Project Name</FormLabel>
                            <FormControl>
                                <Input placeholder="shadcn" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="framework"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Framework Preset</FormLabel>
                            <FormControl>
                                <Component />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="rootDir"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Root Directory</FormLabel>
                            <FormControl>
                                <Input placeholder="shadcn" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <RainbowButton
                    className="w-full border rounded-sm text-sm font-semibold"
                    type="submit">
                    {"Deploy"}
                </RainbowButton>
            </form>
        </Form>
    )
}



export function Component() {
    return (
        <div className="*:not-first:mt-2">
            <Select defaultValue="1">
                <SelectTrigger
                    className="ps-2 [&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_img]:shrink-0">
                    <SelectValue placeholder="Select framework" />
                </SelectTrigger>
                <SelectContent className="[&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2 [&_*[role=option]>span]:flex [&_*[role=option]>span]:items-center [&_*[role=option]>span]:gap-2">
                    <SelectGroup>
                        <SelectItem value="1">
                            <img
                                className="size-5 rounded"
                                src="/vite.svg"
                                alt="Frank Allison"
                                width={20}
                                height={20}
                            />
                            <span className="truncate">Vite</span>
                        </SelectItem>
                        <SelectItem value="2">
                            <img
                                className="size-5 rounded"
                                src="/nextjs.svg"
                                alt="Xavier Guerra"
                                width={20}
                                height={20}
                            />
                            <span className="truncate">Next.js</span>
                        </SelectItem>
                        <SelectItem value="2">
                            <img
                                className="size-5 rounded"
                                src="/rolt.svg"
                                alt="Xavier Guerra"
                                width={20}
                                height={20}
                            />
                            <span className="truncate">Other</span>
                        </SelectItem>
                        <SelectItem value="3">
                            <img
                                className="size-5 rounded"
                                src="/nodejs.svg"
                                alt="Anne Kelley"
                                width={20}
                                height={20}
                            />
                            <span className="truncate">Express.js</span>
                        </SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    )
}
