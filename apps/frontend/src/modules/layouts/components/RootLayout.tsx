import { Outlet } from 'react-router'

export const RootLayout = () => {
    return (
        <div className='w-full mx-auto container'>
            <Outlet />
        </div>
    )
}
