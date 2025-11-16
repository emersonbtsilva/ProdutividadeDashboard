export const APP_CONFIG = {
  STORAGE_KEYS: {
    TASKS: '@ProdutividadeDashboard:tasks',
    USER_PREFERENCES: '@ProdutividadeDashboard:preferences',
  },
  TASK_LIMITS: {
    TITLE_MIN_LENGTH: 3,
    TITLE_MAX_LENGTH: 100,
    DESCRIPTION_MAX_LENGTH: 500,
    MAX_TASKS_PER_USER: 1000,
  },
  UI: {
    DEBOUNCE_DELAY: 300,
    ANIMATION_DURATION: 200,
    HAPTIC_ENABLED: true,
  },
  PRIORITIES: [
    { key: 'baixa', label: 'Baixa', color: '#4CAF50' },
    { key: 'média', label: 'Média', color: '#FF9800' },
    { key: 'alta', label: 'Alta', color: '#FF5722' },
    { key: 'urgente', label: 'Urgente', color: '#F44336' },
  ] as const,
  CATEGORIES: [
    { key: 'trabalho', label: 'Trabalho', icon: '💼' },
    { key: 'pessoal', label: 'Pessoal', icon: '👤' },
    { key: 'estudos', label: 'Estudos', icon: '📚' },
    { key: 'saúde', label: 'Saúde', icon: '🏥' },
    { key: 'outros', label: 'Outros', icon: '📝' },
  ] as const,
} as const;