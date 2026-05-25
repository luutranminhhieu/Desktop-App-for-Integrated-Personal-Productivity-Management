import React, { useEffect, useState } from 'react';
import type { TodoItem, TodoFormData, TodoModalMode, TodoPriority } from './types';

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
	dueDate: '',
	tags: [],
	project: ''
};

function toFormData(todo: TodoItem): TodoFormData {
	return {
		title: todo.title,
		description: todo.description ?? '',
		priority: todo.priority,
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
	const [newTag, setNewTag] = useState('');
	const [error, setError] = useState('');

	useEffect(() => {
		if (open) {
			setFormData(todo ? toFormData(todo) : defaultFormData);
			setNewTag('');
			setError('');
		}
	}, [open, todo]);

	if (!open) return null;

	const handleChange = (key: keyof TodoFormData, value: string | string[]): void => {
		setFormData((prev) => ({ ...prev, [key]: value }));
		if (key === 'title') setError('');
	};

	const addTag = (): void => {
		const tag = newTag.trim();
		if (tag && !formData.tags.includes(tag)) {
			setFormData((prev) => ({ ...prev, tags: [...prev.tags, tag] }));
			setNewTag('');
		}
	};

	const removeTag = (tagToRemove: string): void => {
		setFormData((prev) => ({
			...prev,
			tags: prev.tags.filter((t) => t !== tagToRemove)
		}));
	};

	const handleSubmit = (): void => {
		if (!formData.title.trim()) {
			setError('Vui lòng nhập tiêu đề.');
			return;
		}
		onSubmit({ ...formData, title: formData.title.trim() });
	};

	const priorities: { value: TodoPriority; label: string }[] = [
		{ value: 'low', label: 'Thấp' },
		{ value: 'medium', label: 'Trung bình' },
		{ value: 'high', label: 'Cao' },
		{ value: 'urgent', label: 'Khẩn cấp' }
	];

	return (
		<div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/30 p-6">
			<div className="w-full max-w-lg bg-white rounded-xl border border-[#E5E7EB] p-6 shadow-xl max-h-[90vh] overflow-y-auto">
				{/* Header */}
				<div className="flex items-center justify-between mb-4">
					<h2 className="text-[18px] font-semibold text-[#1A1A2E]">
						{mode === 'create' ? 'Tạo task mới' : 'Chỉnh sửa task'}
					</h2>
					<button
						className="text-[#6B7280] hover:text-[#1A1A2E] transition-colors"
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
						<label className="text-[12px] font-semibold text-[#6B7280]">
							Tiêu đề <span className="text-[#EF4444]">*</span>
						</label>
						<input
							className={`mt-2 w-full rounded-lg border px-3 py-2 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#4F3CC9] focus:border-transparent ${
								error ? 'border-[#EF4444]' : 'border-[#E5E7EB]'
							}`}
							value={formData.title}
							onChange={(e) => handleChange('title', e.target.value)}
							placeholder="Nhập tiêu đề công việc"
						/>
					</div>

					{/* Description */}
					<div>
						<label className="text-[12px] font-semibold text-[#6B7280]">Mô tả</label>
						<textarea
							className="mt-2 w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#4F3CC9] focus:border-transparent"
							rows={3}
							value={formData.description ?? ''}
							onChange={(e) => handleChange('description', e.target.value)}
							placeholder="Mô tả chi tiết (tùy chọn)"
						/>
					</div>

					{/* Priority & Due date row */}
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						<div>
							<label className="text-[12px] font-semibold text-[#6B7280]">
								Mức độ ưu tiên
							</label>
							<select
								className="mt-2 w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#4F3CC9] focus:border-transparent"
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
						<div>
							<label className="text-[12px] font-semibold text-[#6B7280]">
								Hạn chót
							</label>
							<input
								type="datetime-local"
								className="mt-2 w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#4F3CC9] focus:border-transparent"
								value={formData.dueDate ?? ''}
								onChange={(e) => handleChange('dueDate', e.target.value)}
							/>
						</div>
					</div>

					{/* Project */}
					<div>
						<label className="text-[12px] font-semibold text-[#6B7280]">Dự án</label>
						<input
							className="mt-2 w-full rounded-lg border border-[#E5E7EB] px-3 py-2 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#4F3CC9] focus:border-transparent"
							value={formData.project ?? ''}
							onChange={(e) => handleChange('project', e.target.value)}
							placeholder="Nhập tên dự án"
						/>
					</div>

					{/* Tags */}
					<div>
						<label className="text-[12px] font-semibold text-[#6B7280]">
							Thẻ (tags)
						</label>
						<div className="flex gap-2 mt-2">
							<input
								type="text"
								className="flex-1 rounded-lg border border-[#E5E7EB] px-3 py-2 text-[14px] focus:outline-none focus:ring-2 focus:ring-[#4F3CC9] focus:border-transparent"
								value={newTag}
								onChange={(e) => setNewTag(e.target.value)}
								onKeyDown={(e) => {
									if (e.key === 'Enter') {
										e.preventDefault();
										addTag();
									}
								}}
								placeholder="Thêm thẻ"
							/>
							<button
								type="button"
								onClick={addTag}
								className="px-4 py-2 bg-[#4F3CC9] text-white rounded-lg hover:bg-[#3A2D9E] transition-colors text-[14px]"
							>
								Thêm
							</button>
						</div>
						{formData.tags.length > 0 && (
							<div className="flex flex-wrap gap-2 mt-2">
								{formData.tags.map((tag) => (
									<span
										key={tag}
										className="px-3 py-1 bg-[#F6F2FE] text-[#4F3CC9] rounded-lg flex items-center gap-1 text-[12px]"
									>
										#{tag}
										<button
											type="button"
											onClick={() => removeTag(tag)}
											className="text-[#6B7280] hover:text-[#4F3CC9] ml-1"
										>
											<span
												className="material-symbols-outlined"
												style={{ fontSize: '14px' }}
											>
												close
											</span>
										</button>
									</span>
								))}
							</div>
						)}
					</div>
				</div>

				{/* Error message */}
				{error && <p className="mt-4 text-[12px] text-[#EF4444]">{error}</p>}

				{/* Actions */}
				<div className="mt-6 flex flex-wrap items-center justify-end gap-3">
					{mode === 'edit' && onDelete && (
						<button
							className="px-4 py-2 text-[14px] font-semibold text-[#EF4444] hover:bg-[#FEF2F2] rounded-lg transition-colors"
							onClick={onDelete}
							type="button"
						>
							Xóa
						</button>
					)}
					<button
						className="px-4 py-2 text-[14px] font-semibold text-[#6B7280] hover:bg-[#F6F2FE] rounded-lg transition-colors"
						onClick={onClose}
						type="button"
					>
						Hủy
					</button>
					<button
						className="px-4 py-2 text-[14px] font-semibold text-white bg-[#4F3CC9] rounded-lg hover:bg-[#3A2D9E] transition-colors"
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