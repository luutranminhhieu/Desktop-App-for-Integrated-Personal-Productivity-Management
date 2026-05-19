import React, { useEffect, useMemo, useState } from 'react';
import Sidebar from './Sidebar';

type MainLayoutProps = {
	children: React.ReactNode;
};

type UserInfo = {
	id: string;
	name: string;
	email: string;
};

const MainLayout = ({ children }: MainLayoutProps): React.JSX.Element => {
	const [user] = useState<UserInfo | null>(() => {
		const storedUser = localStorage.getItem('user');
		if (!storedUser) {
			return null;
		}
		try {
			return JSON.parse(storedUser) as UserInfo;
		} catch {
			return null;
		}
	});
	const [userId, setUserId] = useState<string | null>(null);
	const [notificationCount, setNotificationCount] = useState(0);
	const [searchQuery, setSearchQuery] = useState('');
	const [searchSummary, setSearchSummary] = useState('');

	useEffect(() => {
		const token = localStorage.getItem('token');
		if (!token) {
			return;
		}

		window.api.auth
			.verifyToken(token)
			.then((response) => {
				if (response.success && response.data?.userId) {
					setUserId(response.data.userId);
				}
			})
			.catch(() => {
				setUserId(null);
			});
	}, []);

	useEffect(() => {
		if (!userId) {
			return;
		}

		window.api.dashboard
			.getStats(userId)
			.then((response) => {
				if (response.success && response.data) {
					setNotificationCount(response.data.notifications);
				}
			})
			.catch(() => {
				setNotificationCount(0);
			});
	}, [userId]);

	const datePrimary = useMemo(() => {
		return new Intl.DateTimeFormat('en-US', {
			month: 'long',
			day: '2-digit',
			year: 'numeric'
		}).format(new Date());
	}, []);

	const dateSecondary = useMemo(() => {
		return new Intl.DateTimeFormat('vi-VN', { weekday: 'long' }).format(new Date());
	}, []);

	const handleSearch = async (): Promise<void> => {
		if (!searchQuery.trim() || !userId) {
			setSearchSummary('');
			return;
		}

		const [todoResponse, noteResponse] = await Promise.all([
			window.api.todo.list({ userId, query: searchQuery.trim(), limit: 5 }),
			window.api.note.list({ userId, query: searchQuery.trim(), limit: 5 })
		]);

		const todoCount = todoResponse.success && todoResponse.data ? todoResponse.data.length : 0;
		const noteCount = noteResponse.success && noteResponse.data ? noteResponse.data.length : 0;
		setSearchSummary(`Tìm thấy ${todoCount} tasks và ${noteCount} notes`);
	};
	return (
		<div className="min-h-screen bg-[#F5F4FA] text-[#1A1A2E]">
			<Sidebar />

			<header className="fixed top-0 right-0 h-[60px] w-[calc(100%-220px)] bg-white border-b border-[#E5E7EB] z-40 flex items-center justify-between px-6">
				<div className="flex items-center flex-1 max-w-xl relative">
					<span className="material-symbols-outlined absolute left-4 text-[#6B7280]">search</span>
					<input
						className="w-full h-[40px] pl-8 pr-4 bg-[#F6F2FE] border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#4F3CC9]/20 focus:border-[#4F3CC9] text-[14px] outline-none transition-all"
						placeholder="Tìm kiếm công việc, ghi chú... (⌘K)"
						type="text"
						value={searchQuery}
						onChange={(event) => {
							setSearchQuery(event.target.value);
							if (!event.target.value) {
								setSearchSummary('');
							}
						}}
						onKeyDown={(event) => {
							if (event.key === 'Enter') {
								void handleSearch();
							}
						}}
					/>
					{searchSummary ? (
						<div className="absolute left-0 top-[44px] mt-2 w-full bg-white border border-[#E5E7EB] rounded-lg px-3 py-2 text-[12px] text-[#6B7280] shadow-sm">
							{searchSummary}
						</div>
					) : null}
				</div>

				<div className="flex items-center gap-6">
					<div className="text-right hidden sm:block">
						<p className="text-[14px] font-semibold text-[#1A1A2E]">{datePrimary}</p>
						<p className="text-[12px] text-[#6B7280]">{dateSecondary}</p>
					</div>
					<div
						className="relative cursor-pointer transition-opacity active:opacity-80"
						title={notificationCount ? `${notificationCount} thông báo mới` : 'Không có thông báo mới'}
					>
						<span className="material-symbols-outlined text-[#6B7280]">notifications</span>
						{notificationCount > 0 ? (
							<span className="absolute top-0 right-0 w-2 h-2 bg-[#EF4444] rounded-full"></span>
						) : null}
					</div>
					<div className="flex items-center gap-2 cursor-pointer">
						<img
							alt={user?.name ? `${user.name} avatar` : 'User Avatar'}
							className="w-8 h-8 rounded-full object-cover border border-[#E5E7EB]"
							src="https://lh3.googleusercontent.com/aida-public/AB6AXuAFlI3uQ0E_Tb_XoihTia7OaflS83TW0vK2oxsZM6-zxskDGzCmYpYNvsSBm4Ti5kHSZ0c1TD9HZmmDt8nbM6pPmmPZprBzsSWddnwhEA7D07NdvHASEkq2m1Km5vTIks7BI7BiCAYDl1cAsAWqyiRnhZhxSulyHdHjCgkqoqChtmAmA4anLPGcelmri9oHvkptVkyWrS3KOWtjj_G6lEpvuIF8FTRyWV4fVfdcWfe7byp-gKOXxL-fU55C99-HHWY-GtbPGCP4824"
						/>
					</div>
				</div>
			</header>

			<main className="pt-[84px] pl-[244px] pr-6 pb-8 max-w-[1200px] mx-auto">
				{children}
			</main>

			<button className="fixed right-8 bottom-8 w-[52px] h-[52px] bg-[#4F3CC9] text-white rounded-full flex items-center justify-center shadow-2xl active:scale-90 transition-all hover:bg-[#3A2D9E] z-[100]">
				<span className="material-symbols-outlined text-[28px]">add</span>
			</button>
		</div>
	);
};

export default MainLayout;
