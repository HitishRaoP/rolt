import { createBrowserRouter } from 'react-router';
import { RootLayout } from '@/modules/layouts/components/root-layout';
import { HomeMain } from '@/modules/home/components/HomeMain';
import { NewProject } from '@/modules/project/components/new-project';

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
                {
                    path: "new",
                    Component: NewProject
                }
            ],
        },
    ]);
