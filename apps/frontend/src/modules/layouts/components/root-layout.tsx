import { HeaderMain } from '@/modules/header/components/header-main'
import { Outlet } from 'react-router'

export const RootLayout = () => {
    return (
        <div className='py-2'>
            <HeaderMain />
            <div className='w-full max-w-7xl sm:p-5 mx-auto container'>
                <Outlet />
            </div>
        </div>
    )
}
