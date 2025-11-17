import { StyleSheet, Platform } from 'react-native';
import { colors, typography } from '../styles/global';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  formSection: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  listSection: {
    marginBottom: 40,
  },
  listHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.surface,
    marginTop: 8,
    marginBottom: 8,
  },
  listHeaderTitle: {
    ...typography.h2,
    color: colors.text,
    fontSize: 18,
  },
  topBar: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderRadius: 8,
    overflow: 'hidden',
  },
  toggleBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  toggleBtnActive: {
    backgroundColor: colors.primary,
  },
  toggleText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  toggleTextActive: {
    color: colors.surface,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 24,
    backgroundColor: colors.primary,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  fabText: {
    color: colors.surface,
    fontSize: 28,
    lineHeight: 28,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.surface,
    padding: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalTitle: {
    ...typography.h2,
    color: colors.text,
  },
  modalClose: {
    color: colors.danger,
    fontWeight: '600',
  },
});
