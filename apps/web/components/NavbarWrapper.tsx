'use client'

import { usePathname } from 'next/navigation'
import TopNavbar from "@/components/ui/TopNavbar"

export default function NavbarWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const hideNavbar = ['/login', '/register'].includes(pathname)

  return (
    <>
      {!hideNavbar && <TopNavbar />}
      <main>{children}</main>
    </>
  )
}
