import { StyleSheet } from 'react-native';
import { colors, typography } from '../styles/global';

export const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    alignItems: 'center',
    padding: 15,
    marginHorizontal: 20,
    backgroundColor: colors.surface,
    borderRadius: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  title: {
    ...typography.h2,
    color: colors.text,
    marginBottom: 15,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 15,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  legendColorBox: {
    width: 15,
    height: 15,
    marginRight: 5,
  },
  legendText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});
