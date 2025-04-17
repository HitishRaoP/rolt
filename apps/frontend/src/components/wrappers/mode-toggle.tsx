import * as React from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTheme } from '../providers/theme-provider';

export function ModeToggle() {
    const { setTheme, theme } = useTheme();

    return (
        <div className="relative inline-grid h-8 grid-cols-[1fr_1fr_1fr] items-center border rounded-full overflow-hidden  text-sm font-medium">
            <Toggle
                className={cn('size-6 w-full h-full p-1.5 rounded-full', theme === 'system' && 'border')}
                onClick={() => setTheme('system')}
            >
                <Monitor className="size-4" />
                <span className="sr-only">System theme</span>
            </Toggle>
            <Toggle
                className={cn('size-6 w-full h-full p-1.5 rounded-full', theme === 'light' && 'border')}
                onClick={() => setTheme('light')}
            >
                <Sun className="size-4" />
                <span className="sr-only">Light theme</span>
            </Toggle>
            <Toggle
                className={cn('size-6 w-full h-full p-1.5 rounded-full', theme === 'dark' && 'border')}
                onClick={() => setTheme('dark')}
            >
                <Moon className="size-4" />
                <span className="sr-only">Dark theme</span>
            </Toggle>
        </div>
    );
}

function Toggle({
    className,
    ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { className?: string }) {
    return (
        <Button variant="ghost" size="icon" className={cn(className)} {...props} />
    );
}