import { RouterProvider } from 'react-router'
import { useCreateAppRouter } from '../hooks/useCreateAppRouter'

export const AppRouter = () => {
    return (
        <RouterProvider router={useCreateAppRouter()} />
    )
}
