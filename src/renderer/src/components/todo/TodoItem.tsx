import React from 'react';
import type { TodoItem as TodoItemType } from '@renderer/types';
import { TODO_CONFIG } from '@renderer/config/todoConfig';

interface TodoItemProps {
  todo: TodoItemType;
  onToggle: (todoId: string) => void;
  onEdit: (todo: TodoItemType) => void;
  onDelete: (todoId: string) => void;
}

const priorityColors = TODO_CONFIG.PRIORITY_COLORS;
const statusColors = TODO_CONFIG.STATUS_COLORS;

const formatDueDate = (dueDate?: string): string => {
  if (!dueDate) return '';
  const date = new Date(dueDate);
  return date.toLocaleDateString(TODO_CONFIG.LOCALE, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

const TodoItem: React.FC<TodoItemProps> = ({ todo, onToggle, onEdit, onDelete }) => {
  const isOverdue = todo.dueDate && new Date(todo.dueDate) < new Date() && todo.status !== 'completed';
  
  return (
    <div className={`p-4 rounded-lg border ${
      isOverdue ? 'border-[var(--color-error)] bg-[var(--color-error-light)]' : 'border-[var(--color-border)]'
    } bg-[var(--color-bg)]`}>
      <div className="flex items-start gap-3">
        <button
          onClick={() => onToggle(todo._id)}
          className={`mt-1 w-5 h-5 rounded border-2 flex-shrink-0 ${
            todo.status === 'completed' 
              ? 'bg-[var(--color-success)] border-[var(--color-success)]' 
              : 'border-[var(--color-border)] hover:border-[var(--color-primary)]'
          }`}
        >
          {todo.status === 'completed' && (
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </button>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className={`text-[15px] font-medium ${
              todo.status === 'completed' ? 'line-through text-[var(--color-muted)]' : 'text-[var(--color-text)]'
            }`}>
              {todo.title}
            </h3>
            
            <div className="flex items-center gap-2">
              <span
                className="px-2 py-1 text-[11px] font-semibold rounded"
                style={{ 
                  backgroundColor: `${priorityColors[todo.priority]}20`,
                  color: priorityColors[todo.priority]
                }}
              >
                {todo.priority.toUpperCase()}
              </span>
              
              <span
                className={`px-2 py-1 text-[11px] font-semibold rounded ${statusColors[todo.status]}`}
              >
                {TODO_CONFIG.STATUS_LABELS[todo.status]}
              </span>
            </div>
          </div>
          
          {todo.description && (
            <p className="text-[13px] text-[var(--color-muted)] mt-2 ml-7">
              {todo.description}
            </p>
          )}
          
          <div className="flex items-center gap-4 mt-2 ml-7">
            {todo.dueDate && (
              <span className={`text-xs ${
                isOverdue ? 'text-[var(--color-error)]' : 'text-[var(--color-muted)]'
              }`}>
                📅 {formatDueDate(todo.dueDate)}
                {isOverdue && <span className="ml-1 font-bold">{TODO_CONFIG.STRINGS.overdueBadge}</span>}
              </span>
            )}
            
            {todo.tags.length > 0 && (
              <div className="flex gap-1">
                {todo.tags.slice(0, 2).map((tag, index) => (
                  <span key={index} className="px-2 py-1 text-[11px] bg-[var(--color-primary-lighter)] text-[var(--color-primary)] rounded">
                    #{tag}
                  </span>
                ))}
                {todo.tags.length > 2 && (
                  <span className="px-2 py-1 text-[11px] bg-[var(--color-primary-lighter)] text-[var(--color-primary)] rounded">
                    +{todo.tags.length - 2}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(todo)}
            className="p-1.5 hover:bg-[var(--color-primary-lighter)] rounded transition-colors"
            title={TODO_CONFIG.STRINGS.edit}
          >
            <svg className="w-4 h-4 text-[var(--color-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          
          <button
            onClick={() => onDelete(todo._id)}
            className="p-1.5 hover:bg-[var(--color-error-light)] rounded transition-colors"
            title={TODO_CONFIG.STRINGS.delete}
          >
            <svg className="w-4 h-4 text-[var(--color-error)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TodoItem;