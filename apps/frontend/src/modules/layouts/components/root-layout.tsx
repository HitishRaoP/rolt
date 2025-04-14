import { HeaderMain } from '@/modules/header/components/header-main'
import { Outlet } from 'react-router'

export const RootLayout = () => {
    return (
        <div className='w-full mx-auto containe'>
            <HeaderMain />
            <div className='px-5'>
                <Outlet />
            </div>
        </div>
    )
}
