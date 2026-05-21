import React from 'react';
import Sidebar from './Sidebar';

type MainLayoutProps = {
	children: React.ReactNode;
};

const MainLayout = ({ children }: MainLayoutProps): React.JSX.Element => {
	return (
		<div className="min-h-screen bg-[#F5F4FA] text-[#1A1A2E]">
			<Sidebar />

			<header className="fixed top-0 right-0 h-[60px] w-[calc(100%-220px)] bg-white border-b border-[#E5E7EB] z-40 flex items-center justify-between px-6">
				<div className="flex items-center flex-1 max-w-xl">
				</div>
				<div className="flex items-center gap-6">
				</div>
			</header>

			<main className="pt-[84px] pl-[244px] pr-6 pb-8 max-w-[1200px] mx-auto">
				{children}
			</main>
		</div>
	);
};

export default MainLayout;
