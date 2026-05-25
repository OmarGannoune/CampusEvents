import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Colors } from '@/constants/colors';
import { Radius, Spacing } from '@/constants/spacing';

type RegistrationStatus = 'default' | 'registered' | 'full' | 'past';

type RegistrationButtonProps = {
  status: RegistrationStatus;
  onRegister: () => void;
  onCancel: () => void;
};

export function RegistrationButton({ status, onRegister, onCancel }: RegistrationButtonProps) {
  const isDisabled = status === 'full' || status === 'past';
  const [confirming, setConfirming] = useState(false);

  const handlePress = () => {
    if (status === 'registered') {
      setConfirming(true);
      return;
    }
    onRegister();
  };

  const label = (() => {
    if (status === 'registered') return "Annuler mon inscription";
    if (status === 'full') return 'Complet — inscription impossible';
    if (status === 'past') return 'Événement terminé';
    return "S'inscrire à cet événement";
  })();

  return (
    <View>
      <Pressable
        disabled={isDisabled}
        onPress={handlePress}
        style={[
          styles.button,
          status === 'registered' && styles.buttonGhost,
          isDisabled && styles.buttonDisabled,
        ]}>
        <Text
          style={[
            styles.buttonText,
            status === 'registered' && styles.buttonTextDanger,
            isDisabled && styles.buttonTextDisabled,
          ]}>
          {label}
        </Text>
      </Pressable>
      {confirming ? (
        <View style={styles.confirmRow}>
          <Text style={styles.confirmText}>Confirmer l'annulation ?</Text>
          <View style={styles.confirmActions}>
            <Pressable
              onPress={() => {
                setConfirming(false);
                onCancel();
              }}>
              <Text style={styles.confirmActionText}>Oui</Text>
            </Pressable>
            <Pressable onPress={() => setConfirming(false)}>
              <Text style={styles.confirmActionText}>Non</Text>
            </Pressable>
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.purple,
    borderRadius: Radius.md,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
  },
  buttonGhost: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.danger,
  },
  buttonDisabled: {
    backgroundColor: Colors.borderDefault,
  },
  buttonText: {
    color: Colors.textOnDark,
    fontSize: 12,
    fontWeight: '500',
  },
  buttonTextDanger: {
    color: Colors.danger,
  },
  buttonTextDisabled: {
    color: Colors.textSecondary,
  },
  confirmRow: {
    marginTop: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  confirmText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  confirmActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  confirmActionText: {
    color: Colors.danger,
    fontSize: 12,
    fontWeight: '500',
  },
});
