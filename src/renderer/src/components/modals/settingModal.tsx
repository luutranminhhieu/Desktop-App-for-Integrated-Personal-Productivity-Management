import React, { useState } from 'react';

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
	const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');
	const [displayName, setDisplayName] = useState(user?.name || '');

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
				className="bg-[var(--color-bg)] w-full max-w-[600px] h-[480px] rounded-lg shadow-soft flex flex-col overflow-hidden"
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
					<div className="w-40 border-r border-[var(--color-border)] bg-[var(--color-bg)] p-4 space-y-2 shrink-0">
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
					</div>

					<div className="flex-1 p-5 overflow-y-auto no-scrollbar">
						{activeTab === 'profile' && (
							<section className="space-y-6">
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
										Save
									</button>
								</div>

								<div className="space-y-4">
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

								<div className="space-y-3">
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
							<section className="space-y-6">
								<div>
									<h3 className="text-lg font-semibold mb-3 text-[var(--color-text)]">Đổi mật khẩu</h3>
									<div className="space-y-3 max-w-sm">
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

						
					</div>
				</div>

			</div>
		</div>
	);
};

export default SettingsModal;
