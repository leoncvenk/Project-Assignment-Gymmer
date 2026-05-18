import { colors } from 'constants/theme';

export type TargetStatus = 'danger' | 'warning' | 'success';

export function getTargetStatus(percent: number): TargetStatus {
  if (percent < 70) return 'danger';
  if (percent < 90) return 'warning';
  if (percent < 105) return 'success';

  return 'danger';
}

export function getTargetStatusColors(percent: number) {
  const status = getTargetStatus(percent);

  switch (status) {
    case 'success':
      return {
        borderColor: colors.success,
        backgroundColor: colors.successSoft,
        textColor: colors.success,
      };
    case 'warning':
      return {
        borderColor: colors.warning,
        backgroundColor: colors.warningSoft,
        textColor: colors.warning,
      };
    case 'danger':
      return {
        borderColor: colors.danger,
        backgroundColor: colors.dangerSoft,
        textColor: colors.danger,
      };
  }
}
