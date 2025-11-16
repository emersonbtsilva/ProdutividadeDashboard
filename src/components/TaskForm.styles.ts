import { StyleSheet } from 'react-native';
import { colors, typography } from '../styles/global';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    padding: 20,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  
  title: {
    ...typography.h2,
    color: colors.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  
  inputGroup: {
    marginBottom: 16,
  },
  
  label: {
    ...typography.body,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  
  input: {
    borderColor: colors.border,
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: colors.background,
    fontSize: typography.body.fontSize,
    color: colors.text,
  },
  
  inputDisabled: {
    backgroundColor: colors.background,
    opacity: 0.6,
  },
  
  textArea: {
    borderColor: colors.border,
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: colors.background,
    fontSize: typography.body.fontSize,
    color: colors.text,
    textAlignVertical: 'top',
    minHeight: 80,
  },
  
  charCounter: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'right',
    marginTop: 4,
  },
  
  priorityRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  
  priorityButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 2,
    backgroundColor: colors.surface,
    minWidth: 70,
    alignItems: 'center',
  },
  
  priorityButtonSelected: {
    backgroundColor: colors.primary,
  },
  
  priorityButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  
  priorityButtonTextSelected: {
    color: colors.surface,
  },
  
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: colors.border,
    minWidth: 100,
  },
  
  categoryButtonSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  
  categoryIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  
  categoryButtonText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  
  categoryButtonTextSelected: {
    color: colors.surface,
  },
  
  addButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  
  addButtonDisabled: {
    opacity: 0.6,
  },
  
  addButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
