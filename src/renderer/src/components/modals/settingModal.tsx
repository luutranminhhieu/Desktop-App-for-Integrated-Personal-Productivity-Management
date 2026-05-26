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
	const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'custom'>('profile');
	const [displayName, setDisplayName] = useState(user?.name || '');
	const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');

	const avatarContent = user?.avatarUrl ? (
		<img
			alt={user?.name ? `${user.name} avatar` : 'User Avatar'}
			className="w-20 h-20 rounded-full object-cover border-2 border-indigo-primary/20"
			src={user.avatarUrl}
		/>
	) : (
		<div className="w-20 h-20 rounded-full bg-[#EDE9FF] border-2 border-[#4F3CC9]/20 flex items-center justify-center text-[18px] font-semibold text-[#4F3CC9]">
			{initials}
		</div>
	);

	if (!isOpen) return null;

	return (
		<div
			className="fixed inset-0 z-[200] flex items-center justify-center bg-[#1C1B23]/40 backdrop-blur-[8px] p-6"
			onClick={onClose}
			role="dialog"
			aria-modal="true"
		>
			<div
				className="bg-white w-full max-w-[800px] h-[600px] rounded-xl shadow-[0_4px_12px_rgba(79,60,201,0.08)] flex flex-col overflow-hidden"
				onClick={(event) => event.stopPropagation()}
			>
				<div className="px-6 py-4 border-b border-[#E5E7EB] flex items-center justify-between">
					<div className="flex items-center gap-sm">
						<span className="material-symbols-outlined text-[#4F3CC9]">settings</span>
						<h2 className="text-[18px] font-semibold text-[#1A1A2E]">Cài đặt hệ thống</h2>
					</div>
					<button
						className="p-2 hover:bg-[#F5F4FA] rounded-full transition-colors"
						onClick={onClose}
						type="button"
					>
						<span className="material-symbols-outlined text-[#6B7280]">close</span>
					</button>
				</div>

				<div className="flex-1 flex overflow-hidden">
					<div className="w-48 border-r border-[#E5E7EB] bg-white p-4 space-y-2">
						<button
							className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[14px] font-medium transition-all ${
								activeTab === 'profile'
									? 'bg-[#EDE9FF] text-[#4F3CC9]'
									: 'text-[#6B7280] hover:bg-[#F5F4FA]'
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
							className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[14px] font-medium transition-all ${
								activeTab === 'security'
									? 'bg-[#EDE9FF] text-[#4F3CC9]'
									: 'text-[#6B7280] hover:bg-[#F5F4FA]'
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
							className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[14px] font-medium transition-all ${
								activeTab === 'custom'
									? 'bg-[#EDE9FF] text-[#4F3CC9]'
									: 'text-[#6B7280] hover:bg-[#F5F4FA]'
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
								<div className="flex flex-col items-center gap-sm">
									<div className="relative group">
										{avatarContent}
										<div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
											<span className="text-[10px] uppercase tracking-wider text-white font-bold">Đổi ảnh</span>
										</div>
									</div>
									<button
										className="rounded-full border border-[#E5E7EB] px-4 py-1 text-[12px] text-[#4F3CC9] font-medium hover:bg-[#EDE9FF] transition-colors"
										type="button"
									>
										Thay đổi
									</button>
								</div>

								<div className="space-y-6">
									<div className="space-y-xs">
										<label className="block text-[12px] font-semibold text-[#6B7280] uppercase tracking-tight">
											Họ và Tên
										</label>
										<div className="flex gap-md">
											<input
												className="flex-1 h-11 rounded-lg border border-[#E5E7EB] px-4 outline-none focus:border-[#4F3CC9] focus:ring-2 focus:ring-[#4F3CC9]/20 transition-all"
												value={displayName}
												onChange={(event) => setDisplayName(event.target.value)}
												placeholder="Nhập họ và tên"
												type="text"
											/>
											<button
												className="px-6 h-11 bg-[#4F3CC9] text-white rounded-lg text-[14px] font-medium hover:bg-[#3A2D9E] transition-all"
												type="button"
											>
												Lưu
											</button>
										</div>
									</div>
								</div>

								<div className="h-px w-full bg-[#E5E7EB]" />

								<div className="space-y-md">
									<div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-start gap-3">
										<span className="material-symbols-outlined text-amber-600 text-[20px] shrink-0 mt-0.5">
											warning
										</span>
										<div>
											<p className="text-[14px] font-medium text-[#1A1A2E] mb-1">Vùng nguy hiểm</p>
											<p className="text-[12px] text-[#6B7280]">
												Việc xóa tài khoản sẽ mất vĩnh viễn mọi dữ liệu ghi chú và nhiệm vụ của bạn.
											</p>
										</div>
									</div>
									<button
										className="w-full h-11 flex items-center justify-center gap-2 border border-[#EF4444] text-[#EF4444] rounded-lg text-[14px] font-medium hover:bg-[#EF4444] hover:text-white transition-all"
										type="button"
									>
										<span className="material-symbols-outlined text-[20px]">delete_forever</span>
										Xóa tài khoản
									</button>
								</div>
							</section>
						)}

						{activeTab === 'security' && (
							<section className="space-y-8">
								<div>
									<h3 className="text-[18px] font-semibold mb-4 text-[#1A1A2E]">Đổi mật khẩu</h3>
									<div className="space-y-4 max-w-md">
										<div>
											<label className="block text-[12px] font-medium text-[#6B7280] mb-1">
												Mật khẩu hiện tại
											</label>
											<input
												className="w-full h-11 border border-[#E5E7EB] rounded-lg px-4 focus:border-[#4F3CC9] focus:ring-4 focus:ring-[#4F3CC9]/10 outline-none transition-all"
												type="password"
											/>
										</div>
										<div>
											<label className="block text-[12px] font-medium text-[#6B7280] mb-1">
												Mật khẩu mới
											</label>
											<input
												className="w-full h-11 border border-[#E5E7EB] rounded-lg px-4 focus:border-[#4F3CC9] focus:ring-4 focus:ring-[#4F3CC9]/10 outline-none transition-all"
												type="password"
											/>
										</div>
										<div>
											<label className="block text-[12px] font-medium text-[#6B7280] mb-1">
												Xác nhận mật khẩu mới
											</label>
											<input
												className="w-full h-11 border border-[#E5E7EB] rounded-lg px-4 focus:border-[#4F3CC9] focus:ring-4 focus:ring-[#4F3CC9]/10 outline-none transition-all"
												type="password"
											/>
										</div>
										<button
											className="bg-[#4F3CC9] text-white text-[14px] font-medium px-6 py-3 rounded-lg hover:bg-[#3A2D9E] active:scale-95 transition-all shadow-sm"
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
									<h3 className="text-[18px] font-semibold mb-4 text-[#1A1A2E]">Giao diện</h3>
									<div className="grid grid-cols-2 gap-md">
										<button
											className={`border-2 p-base rounded-xl cursor-pointer ${
												themeMode === 'light' ? 'border-[#4F3CC9]' : 'border-transparent hover:border-[#E5E7EB]'
											}`}
											onClick={() => setThemeMode('light')}
											type="button"
										>
											<div className="bg-white h-24 rounded-lg border border-[#E5E7EB] flex flex-col justify-center items-center gap-2">
												<span className="material-symbols-outlined text-[#6B7280]">light_mode</span>
												<span className="text-[14px] font-medium text-[#1A1A2E]">Sáng</span>
											</div>
										</button>
										<button
											className={`border-2 p-base rounded-xl cursor-pointer ${
												themeMode === 'dark' ? 'border-[#4F3CC9]' : 'border-transparent hover:border-[#E5E7EB]'
											}`}
											onClick={() => setThemeMode('dark')}
											type="button"
										>
											<div className="bg-[#1A1929] h-24 rounded-lg border border-[#2D2B3D] flex flex-col justify-center items-center gap-2">
												<span className="material-symbols-outlined text-[#C8C4D7]">dark_mode</span>
												<span className="text-[14px] font-medium text-white">Tối</span>
											</div>
										</button>
									</div>
								</div>

								<div>
									<h3 className="text-[18px] font-semibold mb-4 text-[#1A1A2E]">Ngôn ngữ</h3>
									<div className="relative max-w-xs">
										<select className="w-full h-11 border border-[#E5E7EB] rounded-lg px-4 appearance-none focus:border-[#4F3CC9] focus:ring-4 focus:ring-[#4F3CC9]/10 outline-none transition-all cursor-pointer">
											<option>Tiếng Việt (Vietnam)</option>
											<option>English (United States)</option>
											<option>日本語 (Japan)</option>
											<option>Français (France)</option>
										</select>
										<span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#6B7280]">
											expand_more
										</span>
									</div>
								</div>
							</section>
						)}
					</div>
				</div>

				<div className="px-6 py-4 border-t border-[#E5E7EB] bg-[#F5F4FA] flex justify-end gap-3">
					<button
						className="px-6 py-3 text-[14px] font-medium text-[#6B7280] hover:bg-[#E5E7EB] rounded-lg transition-colors"
						onClick={onClose}
						type="button"
					>
						Hủy
					</button>
					<button
						className="px-6 py-3 text-[14px] font-medium bg-[#4F3CC9] text-white rounded-lg shadow-sm hover:bg-[#3A2D9E] active:scale-95 transition-all"
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
