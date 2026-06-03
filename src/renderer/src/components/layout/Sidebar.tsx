import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import UserProfile from './UserProfile';

type SidebarKey = 'dashboard' | 'calendar' | 'tasks' | 'notes' | 'focus';

const navItems: Array<{ key: SidebarKey; label: string; icon: string; path: string }> = [
	{ key: 'dashboard', label: 'Dashboard', icon: 'dashboard', path: '/' },
	{ key: 'calendar', label: 'Calendar', icon: 'calendar_today', path: '/calendar' },
	{ key: 'tasks', label: 'Tasks', icon: 'check_circle', path: '/tasks' },
	{ key: 'focus', label: 'Focus', icon: 'center_focus_strong', path: '/focus' }
];

const routeToKey = (path: string): SidebarKey => {
	if (path.startsWith('/calendar')) return 'calendar';
	if (path.startsWith('/tasks')) return 'tasks';
	if (path.startsWith('/focus')) return 'focus';
	return 'dashboard';
};

export type SidebarState = {
	collapsed: boolean;
};

type SidebarProps = {
	collapsed: boolean;
	onToggle: () => void;
};

const Sidebar = ({ collapsed, onToggle }: SidebarProps): React.JSX.Element => {
	const navigate = useNavigate();
	const location = useLocation();
	const currentKey = routeToKey(location.pathname);

	return (
		<aside
			className={`fixed left-0 top-0 h-screen bg-[var(--color-bg)] border-r border-[var(--color-border)] flex flex-col justify-between py-6 z-50 transition-all duration-200 ${
				collapsed ? 'w-16' : 'w-56'
			}`}
		>
			<div>
				<nav className="flex flex-col">
					{navItems.map((item) => {
						const isActive = item.key === currentKey;
						return (
							<div
								key={item.key}
								className={
									isActive
										? `bg-[var(--color-primary-light)] text-[var(--color-primary)] ${collapsed ? 'px-0 justify-center' : 'px-6'} py-3 flex items-center gap-4 border-l-4 border-[var(--color-primary)] cursor-pointer`
										: `text-[var(--color-muted)] hover:bg-[var(--color-primary-lighter)] ${collapsed ? 'px-0 justify-center' : 'px-6'} py-3 flex items-center gap-4 cursor-pointer transition-colors duration-200`
								}
								onClick={() => navigate(item.path)}
								title={collapsed ? item.label : undefined}
							>
								<span
									className={`material-symbols-outlined ${collapsed ? 'mx-auto' : ''}`}
									style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
								>
									{item.icon}
								</span>
								{!collapsed && (
									<span className={`text-sm ${isActive ? 'font-semibold' : 'font-normal'}`}>
										{item.label}
									</span>
								)}
							</div>
						);
					})}
				</nav>
			</div>

			<div className="flex flex-col">
				{!collapsed && <UserProfile />}

				{/* Toggle collapse button */}
				<div className={`px-4 ${collapsed ? 'flex justify-center' : ''} mt-2`}>
					<button
						className="p-2 rounded-md hover:bg-[var(--color-primary-lighter)] text-[var(--color-muted)] hover:text-[var(--color-primary)] transition-colors"
						onClick={onToggle}
						title={collapsed ? 'Mở rộng sidebar' : 'Thu gọn sidebar'}
						type="button"
					>
						<span className="material-symbols-outlined text-lg">
							{collapsed ? 'chevron_right' : 'chevron_left'}
						</span>
					</button>
				</div>
			</div>
		</aside>
	);
};

export default Sidebar;
export { Sidebar };
export type { SidebarKey };
