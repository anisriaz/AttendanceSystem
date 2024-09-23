import { ReactNode } from 'react';
import SideNav from './_components/sideNav';
import Header from './_components/header';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div>
      <div className='md:w-64 fixed hidden md:block'>
        <SideNav/>
      </div>
      <div className='md:ml-64'>
        <Header />
      {children}
    </div>
    </div>
  );
};

export default Layout;
