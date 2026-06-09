import React, { useState } from 'react';
import { MODAL_CONFIG } from '@renderer/config/modalConfig';

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
	onUserUpdate?: (updatedUser: UserInfo) => void;
};

const SettingsModal = ({
	isOpen,
	onClose,
	user,
	initials,
	onUserUpdate
}: SettingsModalProps): React.JSX.Element | null => {
	const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');
	const [displayName, setDisplayName] = useState(user?.name || '');

	// Password and Security State
	const [currentPassword, setCurrentPassword] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [confirmNewPassword, setConfirmNewPassword] = useState('');

	// UI Feedback State
	const [loadingProfile, setLoadingProfile] = useState(false);
	const [loadingPassword, setLoadingPassword] = useState(false);
	const [errorMsg, setErrorMsg] = useState<string | null>(null);
	const [successMsg, setSuccessMsg] = useState<string | null>(null);

	const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
	const [prevUser, setPrevUser] = useState(user);
	const [prevActiveTab, setPrevActiveTab] = useState(activeTab);

	if (isOpen !== prevIsOpen || user !== prevUser || activeTab !== prevActiveTab) {
		setPrevIsOpen(isOpen);
		setPrevUser(user);
		setPrevActiveTab(activeTab);
		if (isOpen) {
			setDisplayName(user?.name || '');
			setCurrentPassword('');
			setNewPassword('');
			setConfirmNewPassword('');
			setErrorMsg(null);
			setSuccessMsg(null);
		}
	}

	const handleSaveProfile = async (): Promise<void> => {
		if (!user) return;
		if (!displayName.trim()) {
			setErrorMsg('Username cannot be empty.');
			setSuccessMsg(null);
			return;
		}

		setLoadingProfile(true);
		setErrorMsg(null);
		setSuccessMsg(null);

		try {
			const res = await window.api.auth.updateUsername(user.id, displayName.trim());
			if (res.success && res.data) {
				setSuccessMsg('Username updated successfully!');
				if (onUserUpdate) {
					onUserUpdate(res.data);
				}
			} else {
				setErrorMsg(res.error || 'Failed to update username.');
			}
		} catch (err) {
			setErrorMsg((err as Error).message || 'An error occurred.');
		} finally {
			setLoadingProfile(false);
		}
	};

	const handleUpdatePassword = async (): Promise<void> => {
		if (!user) return;

		// Validation
		if (!newPassword) {
			setErrorMsg('New password is required.');
			setSuccessMsg(null);
			return;
		}
		if (newPassword.length < 6) {
			setErrorMsg('New password must be at least 6 characters.');
			setSuccessMsg(null);
			return;
		}
		if (newPassword !== confirmNewPassword) {
			setErrorMsg('New passwords do not match.');
			setSuccessMsg(null);
			return;
		}

		setLoadingPassword(true);
		setErrorMsg(null);
		setSuccessMsg(null);

		try {
			const res = await window.api.auth.changePassword(
				user.id,
				currentPassword || undefined,
				newPassword
			);
			if (res.success) {
				setSuccessMsg('Password updated successfully!');
				setCurrentPassword('');
				setNewPassword('');
				setConfirmNewPassword('');
			} else {
				setErrorMsg(res.error || 'Failed to update password.');
			}
		} catch (err) {
			setErrorMsg((err as Error).message || 'An error occurred.');
		} finally {
			setLoadingPassword(false);
		}
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
				className="bg-[var(--color-bg)] w-full max-w-[600px] h-[480px] rounded-lg shadow-soft flex flex-col overflow-hidden"
				onClick={(event) => event.stopPropagation()}
			>
				{/* Modal Header */}
				<div className="px-6 py-4 border-b border-[var(--color-border)] flex items-center justify-between">
					<div className="flex items-center gap-2">
						<span className="material-symbols-outlined text-[var(--color-primary)]">settings</span>
						<h2 className="text-lg font-semibold text-[var(--color-text)]">{MODAL_CONFIG.SETTINGS_MODAL.title}</h2>
					</div>
					<button
						className="p-2 hover:bg-[var(--color-primary-lighter)] rounded-full transition-colors"
						onClick={onClose}
						type="button"
					>
						<span className="material-symbols-outlined text-[var(--color-muted)]">{MODAL_CONFIG.COMMON.close}</span>
					</button>
				</div>

				<div className="flex-1 flex overflow-hidden">
					{/* Modal Sidebar */}
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
							{MODAL_CONFIG.SETTINGS_MODAL.tabProfile}
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
							{MODAL_CONFIG.SETTINGS_MODAL.tabSecurity}
						</button>
					</div>

					{/* Modal Tab Content */}
					<div className="flex-1 p-5 overflow-y-auto no-scrollbar">
						{/* Alerts */}
						{errorMsg && (
							<div className="mb-4 flex items-center gap-2 rounded-md bg-[var(--color-error-light)] border border-[var(--color-error-border)] p-3 text-xs text-[var(--color-error)] font-medium transition-all">
								<span className="material-symbols-outlined text-base">error</span>
								<span>{errorMsg}</span>
							</div>
						)}
						{successMsg && (
							<div className="mb-4 flex items-center gap-2 rounded-md bg-[var(--color-success-light)] border border-[var(--color-success-border)] p-3 text-xs text-[var(--color-success)] font-medium transition-all">
								<span className="material-symbols-outlined text-base">check_circle</span>
								<span>{successMsg}</span>
							</div>
						)}

						{activeTab === 'profile' && (
							<section className="space-y-6">
								<div className="flex flex-col items-center gap-3">
									{avatarContent}
								</div>

								<div className="space-y-4">
									<div className="space-y-2">
										<label className="block text-xs font-semibold text-[var(--color-muted)] uppercase tracking-tight">
											{MODAL_CONFIG.SETTINGS_MODAL.labelFullName}
										</label>
										<div className="flex gap-3">
											<input
												className="flex-1 h-11 rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] px-4 outline-none focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20 transition-all"
												value={displayName}
												onChange={(event) => setDisplayName(event.target.value)}
												placeholder={MODAL_CONFIG.SETTINGS_MODAL.placeholderFullName}
												type="text"
												disabled={loadingProfile}
											/>
											<button
												className="px-6 h-11 bg-[var(--color-primary)] text-white rounded-md text-sm font-medium hover:bg-[var(--color-primary-hover)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center min-w-[80px]"
												type="button"
												onClick={handleSaveProfile}
												disabled={loadingProfile}
											>
												{loadingProfile ? (
													<span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
												) : (
													MODAL_CONFIG.COMMON.save
												)}
											</button>
										</div>
									</div>
								</div>
							</section>
						)}

						{activeTab === 'security' && (
							<section className="space-y-6">
								<div>
									<h3 className="text-lg font-semibold mb-3 text-[var(--color-text)]">{MODAL_CONFIG.SETTINGS_MODAL.changePassword}</h3>
									<div className="space-y-3 max-w-sm">
										<div>
											<label className="block text-xs font-medium text-[var(--color-muted)] mb-1">
												{MODAL_CONFIG.SETTINGS_MODAL.currentPassword}
											</label>
											<input
												className="w-full h-11 border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] rounded-md px-4 focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/10 outline-none transition-all"
												type="password"
												value={currentPassword}
												onChange={(e) => setCurrentPassword(e.target.value)}
												disabled={loadingPassword}
											/>
										</div>
										<div>
											<label className="block text-xs font-medium text-[var(--color-muted)] mb-1">
												{MODAL_CONFIG.SETTINGS_MODAL.newPassword}
											</label>
											<input
												className="w-full h-11 border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] rounded-md px-4 focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/10 outline-none transition-all"
												type="password"
												value={newPassword}
												onChange={(e) => setNewPassword(e.target.value)}
												disabled={loadingPassword}
											/>
										</div>
										<div>
											<label className="block text-xs font-medium text-[var(--color-muted)] mb-1">
												{MODAL_CONFIG.SETTINGS_MODAL.confirmNewPassword}
											</label>
											<input
												className="w-full h-11 border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] rounded-md px-4 focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/10 outline-none transition-all"
												type="password"
												value={confirmNewPassword}
												onChange={(e) => setConfirmNewPassword(e.target.value)}
												disabled={loadingPassword}
											/>
										</div>
										<div className="pt-2">
											<button
												className="bg-[var(--color-primary)] text-white text-sm font-medium px-6 py-3 rounded-md hover:bg-[var(--color-primary-hover)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm flex items-center justify-center min-w-[150px]"
												type="button"
												onClick={handleUpdatePassword}
												disabled={loadingPassword}
											>
												{loadingPassword ? (
													<span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
												) : (
													MODAL_CONFIG.SETTINGS_MODAL.updatePassword
												)}
											</button>
										</div>
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
