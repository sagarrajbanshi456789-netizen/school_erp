import "../globals.css"
import {Navbar} from "@/components/public-layout-compo/Navbar"
import Footer from "@/components/public-layout-compo/Footer"
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      
        <Navbar />
        <main>{children}</main>
        <Footer />
        
    </>
  )
}