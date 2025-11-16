import { StyleSheet, Platform } from 'react-native';
import { colors, typography } from '../styles/global';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  } as any,
  
  keyboardAvoidingView: {
    flex: 1,
  } as any,
  
  scrollView: {
    flex: 1,
  } as any,
  
  scrollContent: {
    paddingBottom: 40,
  } as any,
  
  formSection: {
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
  
  emptyContainer: {
    paddingVertical: 60,
    paddingHorizontal: 40,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
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
