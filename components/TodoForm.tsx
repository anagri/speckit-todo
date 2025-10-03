/**
 * TodoForm Component - Create and Edit Todos
 */

import React, { useState, useEffect } from 'react';
import { useTodoContext } from '../lib/TodoContext';
import { CreateTodoInput, Todo, Priority } from '../lib/types';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';

interface TodoFormProps {
  isOpen: boolean;
  onClose: () => void;
  editTodo?: Todo | null;
}

export function TodoForm({ isOpen, onClose, editTodo }: TodoFormProps) {
  const { dispatch, tags, categories } = useTodoContext();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [categoryId, setCategoryId] = useState<string>('');
  const [scheduledAt, setScheduledAt] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    if (editTodo) {
      setTitle(editTodo.title);
      setDescription(editTodo.description);
      setPriority(editTodo.priority);
      setCategoryId(editTodo.categoryId || '');
      setScheduledAt(
        editTodo.scheduledAt
          ? new Date(editTodo.scheduledAt).toISOString().slice(0, 16)
          : ''
      );
      setSelectedTags(editTodo.tagIds);
    } else {
      resetForm();
    }
  }, [editTodo, isOpen]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setPriority('medium');
    setCategoryId('');
    setScheduledAt('');
    setSelectedTags([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      return;
    }

    if (editTodo) {
      dispatch({
        type: 'UPDATE_TODO',
        payload: {
          id: editTodo.id,
          title: title.trim(),
          description: description.trim(),
          priority,
          categoryId: categoryId || null,
          scheduledAt: scheduledAt ? new Date(scheduledAt).toISOString() : null,
          tagIds: selectedTags,
        },
      });
    } else {
      const input: CreateTodoInput = {
        title: title.trim(),
        description: description.trim(),
        priority,
        categoryId: categoryId || null,
        scheduledAt: scheduledAt ? new Date(scheduledAt).toISOString() : null,
        tagIds: selectedTags,
      };

      dispatch({ type: 'CREATE_TODO', payload: input });
    }

    resetForm();
    onClose();
  };

  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{editTodo ? 'Edit Todo' : 'Create New Todo'}</DialogTitle>
          <DialogDescription>
            {editTodo ? 'Update your todo details' : 'Add a new todo to your list'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              data-testid="todo-title-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={512}
              placeholder="Enter todo title"
              required
            />
            <p className="text-xs text-gray-500">{title.length}/512 characters</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              data-testid="todo-description-input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={5000}
              placeholder="Enter todo description (optional)"
              rows={3}
            />
            <p className="text-xs text-gray-500">{description.length}/5000 characters</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={priority}
                onValueChange={(value) => setPriority(value as Priority)}
              >
                <SelectTrigger data-testid="todo-priority-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={categoryId || undefined} onValueChange={(value) => setCategoryId(value || '')}>
                <SelectTrigger data-testid="todo-category-select">
                  <SelectValue placeholder="None" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="scheduledAt">Scheduled Date & Time</Label>
            <Input
              id="scheduledAt"
              data-testid="todo-scheduled-input"
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
            />
          </div>

          {tags.length > 0 && (
            <div className="space-y-2">
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => toggleTag(tag.id)}
                    className={`px-3 py-1 rounded-full text-sm ${
                      selectedTags.includes(tag.id)
                        ? tag.color
                        : 'bg-gray-100 text-gray-600'
                    }`}
                    data-testid={`tag-option-${tag.name}`}
                  >
                    {tag.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              data-testid="todo-submit-btn"
              disabled={!title.trim()}
            >
              {editTodo ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
