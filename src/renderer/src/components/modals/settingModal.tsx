import React, { useCallback, useEffect, useState } from 'react';

type UserInfo = {
	id: string;
	name: string;
	email: string;
	avatarUrl?: string;
};

type SettingsModalProps = {
	isOpen: boolean;
	onClose: () => void;
	user: UserInfo | null;
	initials: string;
};

const SettingsModal = ({ isOpen, onClose, user, initials }: SettingsModalProps): React.JSX.Element | null => {
	const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'custom'>('profile');
	const [displayName, setDisplayName] = useState(user?.name || '');
	const [themeMode, setThemeMode] = useState<'light' | 'dark'>(() => {
		return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
	});

	const applyTheme = useCallback((mode: 'light' | 'dark') => {
		document.documentElement.dataset.theme = mode;
		localStorage.setItem('theme', mode);
	}, []);

	// Apply theme on mount
	useEffect(() => {
		applyTheme(themeMode);
	}, [applyTheme, themeMode]);

	const handleThemeChange = (mode: 'light' | 'dark'): void => {
		setThemeMode(mode);
		applyTheme(mode);
	};

	const avatarContent = user?.avatarUrl ? (
		<img
			alt={user?.name ? `${user.name} avatar` : 'User Avatar'}
			className="w-20 h-20 rounded-full object-cover border-2 border-[var(--color-primary)]/20"
			src={user.avatarUrl}
		/>
	) : (
		<div className="w-20 h-20 rounded-full bg-[var(--color-primary-light)] border-2 border-[var(--color-primary)]/20 flex items-center justify-center text-lg font-semibold text-[var(--color-primary)]">
			{initials}
		</div>
	);

	if (!isOpen) return null;

	return (
		<div
			className="fixed inset-0 z-[200] flex items-center justify-center bg-[var(--color-overlay)] backdrop-blur-sm p-6"
			onClick={onClose}
			role="dialog"
			aria-modal="true"
		>
			<div
				className="bg-[var(--color-bg)] w-full max-w-[800px] h-[600px] rounded-lg shadow-soft flex flex-col overflow-hidden"
				onClick={(event) => event.stopPropagation()}
			>
				<div className="px-6 py-4 border-b border-[var(--color-border)] flex items-center justify-between">
					<div className="flex items-center gap-2">
						<span className="material-symbols-outlined text-[var(--color-primary)]">settings</span>
						<h2 className="text-lg font-semibold text-[var(--color-text)]">Cài đặt hệ thống</h2>
					</div>
					<button
						className="p-2 hover:bg-[var(--color-primary-lighter)] rounded-full transition-colors"
						onClick={onClose}
						type="button"
					>
						<span className="material-symbols-outlined text-[var(--color-muted)]">close</span>
					</button>
				</div>

				<div className="flex-1 flex overflow-hidden">
					<div className="w-48 border-r border-[var(--color-border)] bg-[var(--color-bg)] p-4 space-y-2">
						<button
							className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all ${
								activeTab === 'profile'
									? 'bg-[var(--color-primary-light)] text-[var(--color-primary)]'
									: 'text-[var(--color-muted)] hover:bg-[var(--color-primary-lighter)]'
							}`}
							onClick={() => setActiveTab('profile')}
							type="button"
						>
							<span
								className="material-symbols-outlined"
								style={{ fontVariationSettings: activeTab === 'profile' ? "'FILL' 1" : "'FILL' 0" }}
							>
								account_circle
							</span>
							Profile
						</button>
						<button
							className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all ${
								activeTab === 'security'
									? 'bg-[var(--color-primary-light)] text-[var(--color-primary)]'
									: 'text-[var(--color-muted)] hover:bg-[var(--color-primary-lighter)]'
							}`}
							onClick={() => setActiveTab('security')}
							type="button"
						>
							<span
								className="material-symbols-outlined"
								style={{ fontVariationSettings: activeTab === 'security' ? "'FILL' 1" : "'FILL' 0" }}
							>
								lock
							</span>
							Bảo mật
						</button>
						<button
							className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all ${
								activeTab === 'custom'
									? 'bg-[var(--color-primary-light)] text-[var(--color-primary)]'
									: 'text-[var(--color-muted)] hover:bg-[var(--color-primary-lighter)]'
							}`}
							onClick={() => setActiveTab('custom')}
							type="button"
						>
							<span
								className="material-symbols-outlined"
								style={{ fontVariationSettings: activeTab === 'custom' ? "'FILL' 1" : "'FILL' 0" }}
							>
								palette
							</span>
							Tuỳ chỉnh
						</button>
					</div>

					<div className="flex-1 p-6 overflow-y-auto no-scrollbar">
						{activeTab === 'profile' && (
							<section className="space-y-8">
								<div className="flex flex-col items-center gap-3">
									<div className="relative group">
										{avatarContent}
										<div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
											<span className="text-[10px] uppercase tracking-wider text-white font-bold">Đổi ảnh</span>
										</div>
									</div>
									<button
										className="rounded-full border border-[var(--color-border)] px-4 py-1 text-xs text-[var(--color-primary)] font-medium hover:bg-[var(--color-primary-light)] transition-colors"
										type="button"
									>
										Thay đổi
									</button>
								</div>

								<div className="space-y-6">
									<div className="space-y-2">
										<label className="block text-xs font-semibold text-[var(--color-muted)] uppercase tracking-tight">
											Họ và Tên
										</label>
										<div className="flex gap-3">
											<input
												className="flex-1 h-11 rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] px-4 outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all"
												value={displayName}
												onChange={(event) => setDisplayName(event.target.value)}
												placeholder="Nhập họ và tên"
												type="text"
											/>
											<button
												className="px-6 h-11 bg-[var(--color-primary)] text-white rounded-md text-sm font-medium hover:bg-[var(--color-primary-hover)] transition-all"
												type="button"
											>
												Lưu
											</button>
										</div>
									</div>
								</div>

								<div className="h-px w-full bg-[var(--color-border)]" />

								<div className="space-y-4">
									<div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 flex items-start gap-3">
										<span className="material-symbols-outlined text-amber-600 text-xl shrink-0 mt-0.5">
											warning
										</span>
										<div>
											<p className="text-sm font-medium text-[var(--color-text)] mb-1">Vùng nguy hiểm</p>
											<p className="text-xs text-[var(--color-muted)]">
												Việc xóa tài khoản sẽ mất vĩnh viễn mọi dữ liệu ghi chú và nhiệm vụ của bạn.
											</p>
										</div>
									</div>
									<button
										className="w-full h-11 flex items-center justify-center gap-2 border border-[var(--color-error)] text-[var(--color-error)] rounded-md text-sm font-medium hover:bg-[var(--color-error)] hover:text-white transition-all"
										type="button"
									>
										<span className="material-symbols-outlined text-xl">delete_forever</span>
										Xóa tài khoản
									</button>
								</div>
							</section>
						)}

						{activeTab === 'security' && (
							<section className="space-y-8">
								<div>
									<h3 className="text-lg font-semibold mb-4 text-[var(--color-text)]">Đổi mật khẩu</h3>
									<div className="space-y-4 max-w-md">
										<div>
											<label className="block text-xs font-medium text-[var(--color-muted)] mb-1">
												Mật khẩu hiện tại
											</label>
											<input
												className="w-full h-11 border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] rounded-md px-4 focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/10 outline-none transition-all"
												type="password"
											/>
										</div>
										<div>
											<label className="block text-xs font-medium text-[var(--color-muted)] mb-1">
												Mật khẩu mới
											</label>
											<input
												className="w-full h-11 border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] rounded-md px-4 focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/10 outline-none transition-all"
												type="password"
											/>
										</div>
										<div>
											<label className="block text-xs font-medium text-[var(--color-muted)] mb-1">
												Xác nhận mật khẩu mới
											</label>
											<input
												className="w-full h-11 border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] rounded-md px-4 focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/10 outline-none transition-all"
												type="password"
											/>
										</div>
										<button
											className="bg-[var(--color-primary)] text-white text-sm font-medium px-6 py-3 rounded-md hover:bg-[var(--color-primary-hover)] active:scale-95 transition-all shadow-sm"
											type="button"
										>
											Cập nhật mật khẩu
										</button>
									</div>
								</div>
							</section>
						)}

						{activeTab === 'custom' && (
							<section className="space-y-8">
								<div>
									<h3 className="text-lg font-semibold mb-4 text-[var(--color-text)]">Giao diện</h3>
									<div className="grid grid-cols-2 gap-4">
										<button
											className={`border-2 p-3 rounded-lg cursor-pointer transition-all ${
												themeMode === 'light' ? 'border-[var(--color-primary)]' : 'border-transparent hover:border-[var(--color-border)]'
											}`}
											onClick={() => handleThemeChange('light')}
											type="button"
										>
											<div className="bg-white h-24 rounded-md border border-gray-200 flex flex-col justify-center items-center gap-2">
												<span className="material-symbols-outlined text-gray-500">light_mode</span>
												<span className="text-sm font-medium text-gray-800">Sáng</span>
											</div>
										</button>
										<button
											className={`border-2 p-3 rounded-lg cursor-pointer transition-all ${
												themeMode === 'dark' ? 'border-[var(--color-primary)]' : 'border-transparent hover:border-[var(--color-border)]'
											}`}
											onClick={() => handleThemeChange('dark')}
											type="button"
										>
											<div className="bg-[#0a0a0a] h-24 rounded-md border border-[#2d2d2d] flex flex-col justify-center items-center gap-2">
												<span className="material-symbols-outlined text-gray-400">dark_mode</span>
												<span className="text-sm font-medium text-white">Tối</span>
											</div>
										</button>
									</div>
								</div>

								<div>
									<h3 className="text-lg font-semibold mb-4 text-[var(--color-text)]">Ngôn ngữ</h3>
									<div className="relative max-w-xs">
										<select className="w-full h-11 border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] rounded-md px-4 appearance-none focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/10 outline-none transition-all cursor-pointer">
											<option>Tiếng Việt (Vietnam)</option>
											<option>English (United States)</option>
											<option>日本語 (Japan)</option>
											<option>Français (France)</option>
										</select>
										<span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--color-muted)]">
											expand_more
										</span>
									</div>
								</div>
							</section>
						)}
					</div>
				</div>

				<div className="px-6 py-4 border-t border-[var(--color-border)] bg-[var(--color-surface)] flex justify-end gap-3">
					<button
						className="px-6 py-3 text-sm font-medium text-[var(--color-muted)] hover:bg-[var(--color-border)] rounded-md transition-colors"
						onClick={onClose}
						type="button"
					>
						Hủy
					</button>
					<button
						className="px-6 py-3 text-sm font-medium bg-[var(--color-primary)] text-white rounded-md shadow-sm hover:bg-[var(--color-primary-hover)] active:scale-95 transition-all"
						type="button"
					>
						Lưu thay đổi
					</button>
				</div>
			</div>
		</div>
	);
};

export default SettingsModal;
