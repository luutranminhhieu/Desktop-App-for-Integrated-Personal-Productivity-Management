import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';

type MainLayoutProps = {
	children: React.ReactNode;
};

const MainLayout = ({ children }: MainLayoutProps): React.JSX.Element => {
	const location = useLocation();
	const isFocusRoute = location.pathname.startsWith('/focus');
	const [collapsed, setCollapsed] = useState(() => localStorage.getItem('sidebar_collapsed') === 'true');

	const handleToggle = (): void => {
		setCollapsed((prev) => {
			const next = !prev;
			localStorage.setItem('sidebar_collapsed', String(next));
			return next;
		});
	};

	return (
		<div
			className={`min-h-screen flex text-[var(--color-text)] ${
				isFocusRoute ? 'bg-[var(--color-bg-app)]' : 'bg-[var(--color-bg-app)]'
			}`}
		>
			<Sidebar collapsed={collapsed} onToggle={handleToggle} />
			<main
				className={`pt-5 pr-6 pb-8 w-full transition-all duration-200 flex flex-col min-h-screen ${
					collapsed ? 'pl-20' : 'pl-60'
				}`}
			>
				{children}
			</main>
		</div>
	);
};

export default MainLayout;
