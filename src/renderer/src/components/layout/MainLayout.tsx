import React from 'react';
import Sidebar from './Sidebar';

type MainLayoutProps = {
	children: React.ReactNode;
};

const MainLayout = ({ children }: MainLayoutProps): React.JSX.Element => {
	return (
		<div className="min-h-screen bg-[#F5F4FA] text-[#1A1A2E]">
			<Sidebar />
			<main className="pt-5 pl-[244px] pr-6 pb-8 w-full">
				{children}
			</main>
		</div>
	);
};

export default MainLayout;
