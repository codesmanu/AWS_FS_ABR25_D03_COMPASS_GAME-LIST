import { useCallback, useState } from 'react';
import { Outlet } from 'react-router-dom';
import SideBar from './components/sidebar/SideBar';

export type LayoutOutletContext = {
    toggleSideBar: () => void;
};

const Layout = () => {
    const [isSideBarOpen, setIsSideBarOpen] = useState(true);

    const toggleSideBar = useCallback(() => {
        setIsSideBarOpen((prev) => !prev);
    }, []);

    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            <SideBar isOpen={isSideBarOpen} />
            <Outlet context={{ toggleSideBar }} />
        </div>
    );
};

export default Layout;
