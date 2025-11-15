import { StyleSheet } from 'react-native';
import { colors, typography } from '../styles/global';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    borderColor: colors.border,
    borderWidth: 1,
    padding: 10,
    marginRight: 10,
    borderRadius: 5,
    backgroundColor: colors.surface,
    fontSize: typography.body.fontSize,
  },
});
