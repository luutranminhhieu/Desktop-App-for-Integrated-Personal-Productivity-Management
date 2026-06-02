import React, { useEffect, useState } from 'react';
import type { TodoItem, TodoFormData, TodoModalMode, TodoPriority } from '@renderer/types';

export interface TodoFormProps {
	open: boolean;
	mode: TodoModalMode;
	todo?: TodoItem | null;
	onClose: () => void;
	onSubmit: (data: TodoFormData) => void;
	onDelete?: () => void;
}

const defaultFormData: TodoFormData = {
	title: '',
	description: '',
	priority: 'medium',
	startDate: '',
	dueDate: '',
	tags: [],
	project: ''
};

function toFormData(todo: TodoItem): TodoFormData {
	return {
		title: todo.title,
		description: todo.description ?? '',
		priority: todo.priority,
		startDate: todo.startDate ? new Date(todo.startDate).toISOString().slice(0, 16) : '',
		dueDate: todo.dueDate ? new Date(todo.dueDate).toISOString().slice(0, 16) : '',
		tags: [...todo.tags],
		project: todo.project ?? ''
	};
}

const TodoForm = ({
	open,
	mode,
	todo,
	onClose,
	onSubmit,
	onDelete
}: TodoFormProps): React.JSX.Element | null => {
	const [formData, setFormData] = useState<TodoFormData>(defaultFormData);
	const [error, setError] = useState('');

	useEffect(() => {
		if (open) {
			setFormData(todo ? toFormData(todo) : defaultFormData);
			setError('');
		}
	}, [open, todo]);

	if (!open) return null;

	const handleChange = (key: keyof TodoFormData, value: string | string[]): void => {
		setFormData((prev) => ({ ...prev, [key]: value }));
		if (key === 'title') setError('');
	};



	const handleSubmit = (): void => {
		if (!formData.title.trim()) {
			setError('Vui lòng nhập tiêu đề.');
			return;
		}
		onSubmit({ ...formData, title: formData.title.trim() });
	};

	const priorities: { value: TodoPriority; label: string }[] = [
		{ value: 'low', label: 'Low' },
		{ value: 'medium', label: 'Medium' },
		{ value: 'high', label: 'High' },
	];

	return (
		<div className="fixed inset-0 z-[120] flex items-center justify-center bg-[var(--color-overlay)] p-6">
			<div className="w-full max-w-lg bg-[var(--color-bg)] rounded-lg border border-[var(--color-border)] p-6 shadow-xl max-h-[90vh] overflow-y-auto">
				{/* Header */}
				<div className="flex items-center justify-between mb-4">
					<h2 className="text-lg font-semibold text-[var(--color-text)]">
						{mode === 'create' ? 'Tạo task mới' : 'Chỉnh sửa task'}
					</h2>
					<button
						className="text-[var(--color-muted)] hover:text-[var(--color-text)] transition-colors"
						onClick={onClose}
						type="button"
					>
						<span className="material-symbols-outlined">close</span>
					</button>
				</div>

				{/* Form fields */}
				<div className="space-y-4">
					{/* Title */}
					<div>
						<label className="text-xs font-semibold text-[var(--color-muted)]">
							Tiêu đề <span className="text-[var(--color-error)]">*</span>
						</label>
						<input
							className={`mt-2 w-full rounded-md border px-3 py-2 text-sm bg-[var(--color-bg)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent ${
								error ? 'border-[var(--color-error)]' : 'border-[var(--color-border)]'
							}`}
							value={formData.title}
							onChange={(e) => handleChange('title', e.target.value)}
							placeholder="Nhập tiêu đề công việc"
						/>
					</div>

					{/* Description */}
					<div>
						<label className="text-xs font-semibold text-[var(--color-muted)]">Mô tả</label>
						<textarea
							className="mt-2 w-full rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
							rows={3}
							value={formData.description ?? ''}
							onChange={(e) => handleChange('description', e.target.value)}
							placeholder="Mô tả chi tiết (tùy chọn)"
						/>
					</div>

					{/* Priority */}
					<div>
						<label className="text-xs font-semibold text-[var(--color-muted)]">
							Mức độ ưu tiên
						</label>
						<select
							className="mt-2 w-full rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
							value={formData.priority}
							onChange={(e) =>
								handleChange('priority', e.target.value)
							}
						>
							{priorities.map((p) => (
								<option key={p.value} value={p.value}>
									{p.label}
								</option>
							))}
						</select>
					</div>

					{/* Date Range (Start & End) */}
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						<div>
							<label className="text-xs font-semibold text-[var(--color-muted)]">
								Thời điểm bắt đầu
							</label>
							<input
								type="datetime-local"
								className="mt-2 w-full rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
								value={formData.startDate ?? ''}
								onChange={(e) => handleChange('startDate', e.target.value)}
							/>
						</div>
						<div>
							<label className="text-xs font-semibold text-[var(--color-muted)]">
								Thời điểm kết thúc
							</label>
							<input
								type="datetime-local"
								className="mt-2 w-full rounded-md border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
								value={formData.dueDate ?? ''}
								onChange={(e) => handleChange('dueDate', e.target.value)}
							/>
						</div>
					</div>

				</div>

				{/* Error message */}
				{error && <p className="mt-4 text-xs text-[var(--color-error)]">{error}</p>}

				{/* Actions */}
				<div className="mt-8 pt-4 border-t border-[var(--color-border)] flex flex-wrap items-center justify-end gap-3">
					{mode === 'edit' && onDelete && (
						<button
							className="px-4 py-2 text-sm font-semibold text-[var(--color-error)] hover:bg-[var(--color-error-light)] rounded-md transition-colors"
							onClick={onDelete}
							type="button"
						>
							Xóa
						</button>
					)}
					<button
						className=" px-4 py-2 text-sm font-semibold text-[var(--color-muted)] hover:bg-[var(--color-primary-lighter)] rounded-md transition-colors"
						onClick={onClose}
						type="button"
					>
						Hủy
					</button>
					<button
						className="px-4 py-2 text-sm font-semibold text-white bg-[var(--color-primary)] rounded-md hover:bg-[var(--color-primary-hover)] transition-colors"
						onClick={handleSubmit}
						type="button"
					>
						{mode === 'create' ? 'Tạo mới' : 'Lưu thay đổi'}
					</button>
				</div>
			</div>
		</div>
	);
};

export default TodoForm;