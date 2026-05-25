import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import UserProfile from './UserProfile';

type SidebarKey = 'home' | 'calendar' | 'tasks' | 'focus';

type SidebarProps = {
	activeKey?: SidebarKey;
};

const navItems: Array<{ key: SidebarKey; label: string; icon: string; path: string }> = [
	{ key: 'home', label: 'Home', icon: 'home', path: '/' },
	{ key: 'calendar', label: 'Calendar', icon: 'calendar_today', path: '/calendar' },
	{ key: 'tasks', label: 'Tasks', icon: 'check_circle', path: '/tasks' },
	{ key: 'focus', label: 'Focus', icon: 'center_focus_strong', path: '/focus' }
];

const routeToKey = (path: string): SidebarKey => {
	if (path.startsWith('/calendar')) return 'calendar';
	if (path.startsWith('/tasks')) return 'tasks';
	if (path.startsWith('/focus')) return 'focus';
	return 'home';
};

const Sidebar = ({ activeKey }: SidebarProps): React.JSX.Element => {
	const navigate = useNavigate();
	const location = useLocation();
	const currentKey = activeKey ?? routeToKey(location.pathname);

	return (
		<aside className="fixed left-0 top-0 h-screen w-[220px] bg-white border-r border-[#E5E7EB] flex flex-col justify-between py-6 z-50">
			<div>
				<nav className="flex flex-col">
					{navItems.map((item) => {
						const isActive = item.key === currentKey;
						return (
							<div
								key={item.key}
								className={
									isActive
										? 'bg-[#EDE9FF] text-[#4F3CC9] px-6 py-3 flex items-center gap-4 border-l-4 border-[#4F3CC9] cursor-pointer'
										: 'text-[#6B7280] hover:bg-[#F6F2FE] px-6 py-3 flex items-center gap-4 cursor-pointer transition-colors duration-200'
								}
								onClick={() => navigate(item.path)}
							>
								<span
									className="material-symbols-outlined"
									style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
								>
									{item.icon}
								</span>
								<span className={`text-[14px] ${isActive ? 'font-semibold' : 'font-normal'}`}>
									{item.label}
								</span>
							</div>
						);
					})}
				</nav>
			</div>

			<UserProfile />
		</aside>
	);
};

export default Sidebar;
