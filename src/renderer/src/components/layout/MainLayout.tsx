import React from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';

type MainLayoutProps = {
	children: React.ReactNode;
};

const MainLayout = ({ children }: MainLayoutProps): React.JSX.Element => {
	const location = useLocation();
	const isFocusRoute = location.pathname.startsWith('/focus');

	return (
		<div className={`min-h-screen text-[#1A1A2E] ${isFocusRoute ? 'bg-[#F0EEF8]' : 'bg-[#F5F4FA]'}`}>
			<Sidebar />
			<main className="pt-5 pl-[244px] pr-6 pb-8 w-full">
				{children}
			</main>
		</div>
	);
};

export default MainLayout;
