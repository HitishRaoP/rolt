import { createBrowserRouter } from 'react-router';
import { RootLayout } from '@/modules/layouts/components/RootLayout';
import { HomeMain } from '@/modules/home/components/HomeMain';

export const useCreateAppRouter = () =>
    createBrowserRouter([
        {
            path: '/',
            Component: RootLayout,
            children: [
                {
                    index: true,
                    Component: HomeMain
                },
            ],
        },
    ]);
