import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/colors';
import { Radius, Spacing } from '@/constants/spacing';
import { Typography } from '@/constants/typography';

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
        <View style={styles.card}>
          <View style={styles.iconCircle}>
            <Text style={styles.iconText}>trash</Text>
          </View>
          <Text style={[Typography.sectionTitle, styles.heading]}>Supprimer l'événement ?</Text>
          <Text style={styles.body}>
            « {title} » sera définitivement supprimé. Toutes les inscriptions et favoris associés
            seront effacés.
          </Text>
          <View style={styles.actions}>
            <Pressable onPress={onCancel} style={styles.cancelButton}>
              <Text style={styles.cancelText}>Annuler</Text>
            </Pressable>
            <Pressable onPress={onConfirm} style={styles.deleteButton}>
              <Text style={styles.deleteText}>Supprimer</Text>
            </Pressable>
          </View>
        </View>
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
    backgroundColor: Colors.card,
    borderRadius: Radius.lg,
    borderWidth: 0.5,
    borderColor: Colors.borderCard,
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
  iconText: {
    color: Colors.dangerDark,
    fontSize: 12,
  },
  heading: {
    color: Colors.textPrimary,
  },
  body: {
    color: Colors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.borderStrong,
    borderRadius: Radius.md,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
  },
  cancelText: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: '500',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: Colors.danger,
    borderRadius: Radius.md,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
  },
  deleteText: {
    color: Colors.textOnDark,
    fontSize: 12,
    fontWeight: '500',
  },
});
