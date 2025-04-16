import { cn } from "@/lib/utils";
import { IconType } from "react-icons";
import React from "react";

type CommonProps = {
    classNames?: {
        root?: string;
        icon?: string;
    };
};

type SvgProps = CommonProps & {
    type: "svg";
    svgPath: string;
    alt?: string;
    width?: number;
    height?: number;
};

type ReactIconProps = CommonProps & {
    type: "react-icon";
    iconName: IconType;
    size?: number;
};

type IconProps =
    | SvgProps
    | ReactIconProps

const renderers: Record<
    IconProps["type"],
    (props: IconProps) => React.ReactElement
> = {
    "svg": (props) => {
        const { svgPath, alt = "icon", width = 20, height = 20, classNames } =
            props as SvgProps;
        return (
            <img
                src={svgPath}
                alt={alt}
                width={width}
                height={height}
                className={cn("size-5", classNames?.icon)}
            />
        );
    },

    "react-icon": (props) => {
        const { iconName: IconComponent, size = 22, classNames, ...rest } =
            props as ReactIconProps;
        return (
            <IconComponent
                size={size}
                className={cn("text-muted-foreground", classNames?.icon)}
                {...rest}
            />
        );
    },
};

export const Icon = (props: IconProps) => {
    const { classNames } = props;
    const Render = renderers[props.type]
    return (
        <div
            className={cn(
                "border rounded-full p-1.5 flex items-center justify-center",
                classNames?.root
            )}
        >
            {Render(props)}
        </div>
    );
};
