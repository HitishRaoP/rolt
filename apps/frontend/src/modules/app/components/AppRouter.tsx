import { RouterProvider } from 'react-router'
import { useCreateAppRouter } from '../hooks/use-create-app-router'

export const AppRouter = () => {
    return (
        <RouterProvider router={useCreateAppRouter()} />
    )
}
