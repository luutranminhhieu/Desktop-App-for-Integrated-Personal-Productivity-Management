import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SettingsModal from '../modals/settingModal';

type UserInfo = {
	id: string;
	name: string;
	email: string;
	avatarUrl?: string;
};

const UserProfile = (): React.JSX.Element => {
	const navigate = useNavigate();
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

	const [user] = useState<UserInfo | null>(() => {
		const stored = localStorage.getItem('user') || sessionStorage.getItem('user');
		if (!stored) return null;
		try {
			return JSON.parse(stored) as UserInfo;
		} catch {
			return null;
		}
	});

	const initials = useMemo(() => {
		const source = user?.name || user?.email || '';
		if (!source) return 'U';
		const parts = source.trim().split(' ');
		const val = parts.length === 1 ? parts[0].slice(0, 2) : `${parts[0][0]}${parts[1][0]}`;
		return val.toUpperCase();
	}, [user?.name, user?.email]);

	const handleSignOut = (): void => {
		setIsMenuOpen(false);
		setIsSettingsModalOpen(false);

		localStorage.removeItem('token');
		localStorage.removeItem('user');
		localStorage.removeItem('rememberLogin');
		sessionStorage.removeItem('token');
		sessionStorage.removeItem('user');

		navigate('/login', { replace: true });
	};

	return (
		<div className="px-4 border-t border-[var(--color-border)] pt-4">
			<div className="relative">
				<button
					className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--color-primary-lighter)] transition-colors"
					onClick={() => setIsMenuOpen((prev) => !prev)}
					aria-expanded={isMenuOpen}
					aria-haspopup="menu"
					type="button"
				>
					{user?.avatarUrl ? (
						<img
							alt={user?.name ? `${user.name} avatar` : 'User Avatar'}
							className="w-8 h-8 rounded-full object-cover border border-[var(--color-border)]"
							src={user.avatarUrl}
						/>
					) : (
						<div className="w-8 h-8 rounded-full bg-[var(--color-primary-light)] border border-[var(--color-border)] flex items-center justify-center text-xs font-semibold text-[var(--color-primary)]">
							{initials}
						</div>
					)}
					<div className="flex-1 text-left min-w-0">
						<p className="text-[13px] font-medium text-[var(--color-text)] truncate">
							{user?.name || user?.email || 'User'}
						</p>
						<p className="text-[11px] text-[var(--color-muted)] truncate">{user?.email || ''}</p>
					</div>
				</button>

				{isMenuOpen && (
					<div
						className="absolute bottom-15 left-0 mb-2 w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] shadow-xl overflow-hidden z-50"
						role="menu"
					>
						<button
							className="w-full px-4 py-2 text-left text-sm text-[var(--color-text)] hover:bg-[var(--color-primary-lighter)] flex items-center gap-2"
							onClick={() => {
								setIsMenuOpen(false);
								setIsSettingsModalOpen(true);
							}}
							role="menuitem"
							type="button"
						>
							<span className="material-symbols-outlined text-lg">settings</span>
							<span>Settings</span>
						</button>
						<button
							className="w-full px-4 py-2 text-left text-sm text-[var(--color-error)] hover:bg-[var(--color-error-light)] flex items-center gap-2"
							onClick={handleSignOut}
							role="menuitem"
							type="button"
						>
							<span className="material-symbols-outlined text-lg">logout</span>
							<span>Sign out</span>
						</button>
					</div>
				)}
			</div>

			<SettingsModal
				isOpen={isSettingsModalOpen}
				onClose={() => setIsSettingsModalOpen(false)}
				user={user}
				initials={initials}
			/>
		</div>
	);
};

export default UserProfile;
