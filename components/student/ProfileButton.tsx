import { IconButton } from '@/components/ui/IconButton';
import { Colors } from '@/constants/colors';

type ProfileButtonProps = {
  onPress: () => void;
};

export function ProfileButton({ onPress }: ProfileButtonProps) {
  return (
    <IconButton
      icon="user-circle"
      onPress={onPress}
      size={32}
      iconSize={18}
      color={Colors.textOnDark}
    />
  );
}
