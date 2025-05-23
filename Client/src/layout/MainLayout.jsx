import Navbar from '@/components/ui/Navbar'
import HeroSection from '@/page/student/HeroSection'
import React from 'react'
import { Outlet } from 'react-router-dom'

const MainLayout = () => {
  return (
    <div>
        <Navbar className='flex flex-col min-h-screen'/>
        <div className='flex-1 mt-10'>
            <Outlet/>
        </div>
    </div>
  )
}

export default MainLayout
