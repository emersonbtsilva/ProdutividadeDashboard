import { StyleSheet } from 'react-native';
import { colors, typography } from '../styles/global';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.surface,
  },
  
  headerTitle: {
    ...typography.h2,
    color: colors.text,
    fontSize: 18,
  },
  
  separator: {
    height: 12,
  },
  
  // Task item styles
  taskItem: {
    backgroundColor: colors.surface,
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  
  taskItemCompleted: {
    opacity: 0.8,
    backgroundColor: '#f0f9ff',
  },
  
  taskItemOverdue: {
    borderLeftWidth: 4,
    borderLeftColor: '#F44336',
  },
  
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  
  taskMainInfo: {
    flex: 1,
    marginRight: 12,
  },
  
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  
  taskTitle: {
    ...typography.body,
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
    flexWrap: 'wrap',
  },
  
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: colors.textSecondary,
  },
  
  taskDescription: {
    ...typography.body,
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  
  // Badges
  badgeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  
  categoryIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  
  categoryText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  
  // Action button
  actionButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: colors.background,
  },
  
  actionButtonText: {
    fontSize: 16,
  },
  
  // Footer
  taskFooter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  
  dateInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  dateLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginRight: 4,
  },
  
  dateValue: {
    fontSize: 12,
    color: colors.text,
    fontWeight: '500',
  },
  
  overdueText: {
    color: '#F44336',
  },
  
  // Status bar
  statusBar: {
    marginTop: 8,
    alignItems: 'flex-end',
  },
  
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  
  taskStatus: {
    fontSize: 14,
    color: colors.textSecondary,
    fontStyle: 'italic',
    marginTop: 4,
  },
  
  // Loading and empty states
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  
  loadingText: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: 12,
  },
  
  emptyContainer: {
    paddingVertical: 60,
    paddingHorizontal: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  
  emptyTitle: {
    ...typography.h2,
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  
  emptyMessage: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});
