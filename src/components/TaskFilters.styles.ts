import { StyleSheet } from 'react-native';
import { colors, typography } from '../styles/global';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  
  searchInput: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  
  filterToggleButton: {
    marginLeft: 12,
    padding: 12,
    backgroundColor: colors.primary,
    borderRadius: 8,
    position: 'relative',
  },
  
  filterToggleIcon: {
    fontSize: 18,
    color: colors.surface,
  },
  
  activeFilterIndicator: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accent,
  },
  
  resultsCounter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  resultsText: {
    ...typography.body,
    color: colors.textSecondary,
    fontSize: 14,
  },
  
  clearFiltersText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  
  modalTitle: {
    ...typography.h2,
    color: colors.text,
  },
  
  closeButton: {
    padding: 8,
  },
  
  closeButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '500',
  },
  
  modalContent: {
    flex: 1,
    padding: 16,
  },
  
  // Filter sections
  filterSection: {
    marginBottom: 24,
  },
  
  sectionTitle: {
    ...typography.h2,
    fontSize: 18,
    color: colors.text,
    marginBottom: 12,
  },
  
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  
  filterColumn: {
    gap: 8,
  },
  
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    marginRight: 8,
    marginBottom: 8,
  },
  
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  
  filterButtonIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  
  filterButtonText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  
  filterButtonTextActive: {
    color: colors.surface,
  },
  
  clearAllButton: {
    backgroundColor: colors.danger,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 32,
  },
  
  clearAllButtonText: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: 'bold',
  },
});