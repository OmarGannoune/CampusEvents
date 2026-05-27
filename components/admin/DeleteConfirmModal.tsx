import { Modal, StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Icon } from '@/components/ui/Icon';
import { Text } from '@/components/ui/Text';
import { Colors } from '@/constants/colors';
import { Radius, Spacing } from '@/constants/spacing';

type DeleteConfirmModalProps = {
  visible: boolean;
  title: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export function DeleteConfirmModal({
  visible,
  title,
  onCancel,
  onConfirm,
}: DeleteConfirmModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <Card style={styles.card}>
          <View style={styles.iconCircle}>
            <Icon name="trash" size={18} color={Colors.dangerDark} />
          </View>
          <Text variant="sectionTitle" color={Colors.textPrimary}>
            Supprimer l'événement ?
          </Text>
          <Text variant="caption" color={Colors.textSecondary}>
            « {title} » sera définitivement supprimé. Toutes les inscriptions et favoris associés
            seront effacés.
          </Text>
          <View style={styles.actions}>
            <Button label="Annuler" variant="ghost" onPress={onCancel} />
            <Button label="Supprimer" variant="danger" onPress={onConfirm} />
          </View>
        </Card>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(28, 27, 46, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  card: {
    padding: Spacing.xl,
    gap: Spacing.md,
    width: '100%',
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: Radius.full,
    backgroundColor: Colors.dangerLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
});
