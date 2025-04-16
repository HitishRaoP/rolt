import React from 'react'
import { Card, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { cn } from '@/lib/utils'
import { IconType } from 'react-icons/lib'
import { Icon } from '../ui/icon'

type BannerProps = {
    children: React.ReactNode
    title: string
    description?: string
    classNames?: {
        title?: string
        card?: string
        cardDescription?: string
    },
    RightIcon?: IconType
}

export const Banner = ({ children, title, description, classNames, RightIcon }: BannerProps) => {
    return (
        <div>
            <Card className={cn('border-none shadow-none bg-background', classNames?.card)}>
                <CardHeader className='space-y-3'>
                    <CardTitle className={cn('text-3xl flex items-center justify-between', classNames?.title)}>
                        {title}
                        {
                            RightIcon ?
                                <Icon classNames={{ root: "border-none" }} iconName={RightIcon} /> : null
                        }
                    </CardTitle>
                    {
                        description ?
                            <CardDescription className={cn('pb-12', classNames?.cardDescription)}>
                                {description}
                            </CardDescription> : null
                    }
                </CardHeader>
            </Card>
            {children}
        </div>
    )
}
