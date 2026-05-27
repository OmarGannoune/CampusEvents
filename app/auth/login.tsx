import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Text } from '@/components/ui/Text';
import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { useAuth } from '@/context/AuthContext';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    const result = await login(email, password);
    if (result === 'invalid_credentials') {
      setError('Identifiants invalides');
      return;
    }
    setError('');
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Connexion" logo subtitle="Accès CampusEvents" />
      <View style={styles.form}>
        <Field label="Email">
          <Input
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </Field>
        <Field label="Mot de passe">
          <Input value={password} onChangeText={setPassword} secureTextEntry />
        </Field>
        <Button label="Se connecter" onPress={handleSubmit} />
        {error ? (
          <Text variant="caption" color={Colors.danger}>
            {error}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  form: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
});
