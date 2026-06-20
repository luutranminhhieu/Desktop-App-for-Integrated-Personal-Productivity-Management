import React, { useState, useEffect, useRef } from 'react';
import type { SubTodo, TodoItem } from '@renderer/types';

interface SubtaskRowProps {
	todo: TodoItem;
	sub: SubTodo;
	onToggle: (todo: TodoItem, subtaskId: string) => void;
	onDelete: (todo: TodoItem, subtaskId: string) => void;
	onEdit: (todo: TodoItem, subtaskId: string, title: string) => void;
}

export const SubtaskRow = ({
	todo,
	sub,
	onToggle,
	onDelete,
	onEdit
}: SubtaskRowProps): React.JSX.Element => {
	const [isEditing, setIsEditing] = useState(false);
	const [editTitle, setEditTitle] = useState(sub.title);

	const handleSave = (): void => {
		if (editTitle.trim()) {
			onEdit(todo, sub._id, editTitle.trim());
			setIsEditing(false);
		}
	};

	const isDone = sub.status === 'completed';

	return (
		<div className="flex items-center gap-3 py-1.5 group select-none">
			{/* Checkbox */}
			<button
				onClick={() => onToggle(todo, sub._id)}
				className={`w-3.5 h-3.5 flex items-center justify-center rounded border transition-colors shrink-0 cursor-pointer ${
					isDone
						? 'bg-[var(--color-success)] border-[var(--color-success)] text-white'
						: 'border-[var(--color-border)] hover:border-[var(--color-primary)]'
				}`}
				type="button"
			>
				{isDone && (
					<span className="material-symbols-outlined font-bold" style={{ fontSize: '10px' }}>
						check
					</span>
				)}
			</button>

			{/* Title or Input */}
			<div className="flex-1 min-w-0">
				{isEditing ? (
					<input
						type="text"
						value={editTitle}
						onChange={(e) => setEditTitle(e.target.value)}
						onBlur={handleSave}
						onKeyDown={(e) => {
							if (e.key === 'Enter') handleSave();
							if (e.key === 'Escape') {
								setEditTitle(sub.title);
								setIsEditing(false);
							}
						}}
						className="w-full bg-[var(--color-bg)] border border-[var(--color-primary)] rounded px-2 py-0.5 text-xs text-[var(--color-text)] outline-none"
						autoFocus
					/>
				) : (
					<span
						onDoubleClick={() => setIsEditing(true)}
						className={`text-xs font-medium truncate block cursor-text ${
							isDone ? 'line-through text-[var(--color-muted)]' : 'text-[var(--color-text)]'
						}`}
						title="Nhấp đúp để sửa"
					>
						{sub.title}
					</span>
				)}
			</div>

			{/* Actions */}
			<div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
				<button
					onClick={() => setIsEditing(true)}
					className="text-[var(--color-muted)] hover:text-[var(--color-primary)] p-0.5 cursor-pointer"
					type="button"
					title="Sửa subtask"
				>
					<span className="material-symbols-outlined" style={{ fontSize: '16px' }}>edit</span>
				</button>
				<button
					onClick={() => onDelete(todo, sub._id)}
					className="text-[var(--color-muted)] hover:text-[var(--color-error)] p-0.5 cursor-pointer"
					type="button"
					title="Xóa subtask"
				>
					<span className="material-symbols-outlined" style={{ fontSize: '16px' }}>close</span>
				</button>
			</div>
		</div>
	);
};

interface NewSubtaskFormProps {
	todo: TodoItem;
	onCreate: (todo: TodoItem, title: string) => void;
	focusOnMount?: boolean;
	setFocusOnMount?: () => void;
}

export const NewSubtaskForm = ({ todo, onCreate, focusOnMount = false, setFocusOnMount }: NewSubtaskFormProps): React.JSX.Element => {
	const [isAdding, setIsAdding] = useState(false);
	const [title, setTitle] = useState('');
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (focusOnMount) {
			const timer = setTimeout(() => {
				setIsAdding(true);
				if (setFocusOnMount) setFocusOnMount();
			}, 0);
			return () => clearTimeout(timer);
		}
		return undefined;
	}, [focusOnMount, setFocusOnMount]);

	useEffect(() => {
		if (isAdding) {
			inputRef.current?.focus();
		}
	}, [isAdding]);

	const handleAdd = (): void => {
		if (title.trim()) {
			onCreate(todo, title.trim());
			setTitle('');
			inputRef.current?.focus();
		}
	};

	const handleCancel = (): void => {
		setTitle('');
		setIsAdding(false);
	};

	if (!isAdding) {
		return (
			<button
				onClick={() => {
					setIsAdding(true);
				}}
				className="flex items-center gap-1 text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] text-xs font-semibold py-1 px-1 transition-colors cursor-pointer mt-1"
				type="button"
			>
				<span className="material-symbols-outlined" style={{ fontSize: '16px' }}>add</span>
				<span>Add Subtask</span>
			</button>
		);
	}

	return (
		<div className="flex items-center gap-2 mt-1">
			<input
				ref={inputRef}
				type="text"
				value={title}
				onChange={(e) => setTitle(e.target.value)}
				placeholder="Enter subtask title..."
				onKeyDown={(e) => {
					if (e.key === 'Enter') handleAdd();
					if (e.key === 'Escape') handleCancel();
				}}
				className="flex-grow bg-[var(--color-bg)] border border-[var(--color-border)] rounded-md px-2.5 py-1 text-xs text-[var(--color-text)] focus:border-[var(--color-primary)] outline-none"
			/>
			<button
				onClick={handleAdd}
				disabled={!title.trim()}
				className="px-2.5 py-1 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] disabled:opacity-50 text-white rounded text-xs font-semibold cursor-pointer transition-colors shrink-0"
				type="button"
			>
				Save
			</button>
			<button
				onClick={handleCancel}
				className="px-2.5 py-1 text-[var(--color-muted)] hover:text-[var(--color-text)] border border-[var(--color-border)] rounded text-xs font-semibold cursor-pointer transition-colors shrink-0"
				type="button"
			>
				Cancel
			</button>
		</div>
	);
};
