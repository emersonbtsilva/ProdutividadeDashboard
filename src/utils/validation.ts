import { TaskPriority, TaskCategory } from '../models/Task';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validateTaskTitle = (title: string): ValidationResult => {
  const errors: string[] = [];
  
  if (!title?.trim()) {
    errors.push('Título é obrigatório');
  } else if (title.trim().length < 3) {
    errors.push('Título deve ter pelo menos 3 caracteres');
  } else if (title.trim().length > 100) {
    errors.push('Título deve ter no máximo 100 caracteres');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const validateTaskDescription = (description?: string): ValidationResult => {
  const errors: string[] = [];
  
  if (description && description.length > 500) {
    errors.push('Descrição deve ter no máximo 500 caracteres');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

export const sanitizeText = (text: string): string => {
  return text?.trim().replace(/\s+/g, ' ') || '';
};

export const isValidPriority = (priority: string): priority is TaskPriority => {
  return ['baixa', 'média', 'alta', 'urgente'].includes(priority);
};

export const isValidCategory = (category: string): category is TaskCategory => {
  return ['trabalho', 'pessoal', 'estudos', 'saúde', 'outros'].includes(category);
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString('pt-BR');
};

export const formatDateTime = (date: Date): string => {
  return date.toLocaleString('pt-BR');
};

export const isOverdue = (dueDate: Date): boolean => {
  return dueDate < new Date();
};