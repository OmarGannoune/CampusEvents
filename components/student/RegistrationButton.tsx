import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Text } from '@/components/ui/Text';
import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';

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
      <Button
        label={label}
        onPress={handlePress}
        disabled={isDisabled}
        uppercase={false}
        variant={status === 'registered' ? 'danger-ghost' : 'primary'}
      />
      {confirming ? (
        <View style={styles.confirmRow}>
          <Text variant="caption" color={Colors.textSecondary}>
            Confirmer l'annulation ?
          </Text>
          <View style={styles.confirmActions}>
            <Button
              label="Oui"
              size="sm"
              variant="danger-ghost"
              uppercase={false}
              onPress={() => {
                setConfirming(false);
                onCancel();
              }}
            />
            <Button
              label="Non"
              size="sm"
              variant="ghost"
              uppercase={false}
              onPress={() => setConfirming(false)}
            />
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  confirmRow: {
    marginTop: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  confirmActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
});
