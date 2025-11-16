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
});
