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
		<div className={`min-h-screen text-[var(--color-text)] ${isFocusRoute ? 'bg-[var(--color-bg-app)]' : 'bg-[var(--color-bg-app)]'}`}>
			<Sidebar />
			<main className="pt-5 pl-60 pr-6 pb-8 w-full transition-all duration-200">
				{children}
			</main>
		</div>
	);
};

export default MainLayout;
