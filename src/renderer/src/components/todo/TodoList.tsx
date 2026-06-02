import React from 'react';
import type { TodoItem as TodoItemType } from '@renderer/types';
import TodoItemComponent from './TodoItem';
import { TODO_CONFIG } from '@renderer/config/todoConfig';

interface TodoListProps {
  todos: TodoItemType[];
  onToggle: (todoId: string) => void;
  onEdit: (todo: TodoItemType) => void;
  onDelete: (todoId: string) => void;
  emptyMessage?: string;
}

const TodoList: React.FC<TodoListProps> = ({ todos, onToggle, onEdit, onDelete, emptyMessage = TODO_CONFIG.STRINGS.noTasks }) => {
  if (todos.length === 0) {
    return (
      <div className="bg-white p-12 rounded-xl border border-[#E5E7EB] text-center">
        <div className="text-[64px] mb-4">📝</div>
        <h3 className="text-[18px] font-semibold text-[#6B7280] mb-2">{emptyMessage}</h3>
        <p className="text-[14px] text-[#9CA3AF]">
          {emptyMessage === TODO_CONFIG.STRINGS.noTasks 
            ? TODO_CONFIG.STRINGS.startByCreatingNew 
            : TODO_CONFIG.STRINGS.tryChangingFilters
          }
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {todos.map((todo) => (
        <div key={todo._id}>
          <TodoItemComponent
            todo={todo}
            onToggle={onToggle}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </div>
      ))}
    </div>
  );
};

export default TodoList;