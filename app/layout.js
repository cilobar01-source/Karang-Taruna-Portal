import '../styles/globals.css';
import Providers from '@/components/Providers';
import Navbar from '@/components/Navbar';
export const metadata={title:'Portal Karang Taruna Cilosari Barat',description:'Portal resmi RT01/RW08 Kemijen - Semarang Timur'};
export default function RootLayout({children}){return(<html lang='id'><body><Providers><Navbar />{children}</Providers></body></html>)}
