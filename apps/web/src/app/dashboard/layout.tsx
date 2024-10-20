import SideBar from './_components/sidebar'
import { Hotkeys } from './_components/hotkeys'
import MainWrapper from './_components/main-wrapper'

export default function LandingLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main className='bg-soft-gray'>
      <Hotkeys />
      <div className='flex w-full'>
        <SideBar />
        <MainWrapper>
          <div className='min-h-screen bg-gradient-to-r from-neutral-950 to-black px-9 py-6'>
            {children}
          </div>
        </MainWrapper>
      </div>
    </main>
  )
}
