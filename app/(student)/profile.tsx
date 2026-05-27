import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Field } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { TagPill } from '@/components/ui/TagPill';
import { Text } from '@/components/ui/Text';
import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { useAuth } from '@/context/AuthContext';
import { useProfile } from '@/hooks/useProfile';
import type { StudentProfile } from '@/types';

function deriveDisplayName(email?: string | null): string {
  if (!email) {
    return 'Etudiant';
  }
  const localPart = email.split('@')[0] ?? 'Etudiant';
  return localPart.replace(/[._-]+/g, ' ').trim() || 'Etudiant';
}

export default function StudentProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { profile, isLoading, error, saveProfile } = useProfile();

  const defaultName = useMemo(() => deriveDisplayName(user?.email), [user?.email]);
  const [displayName, setDisplayName] = useState(defaultName);
  const [filiere, setFiliere] = useState('');
  const [annee, setAnnee] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [interestInput, setInterestInput] = useState('');

  useEffect(() => {
    if (isLoading) {
      return;
    }
    if (!profile) {
      setDisplayName(defaultName);
      setFiliere('');
      setAnnee('');
      setInterests([]);
      return;
    }
    setDisplayName(profile.displayName || defaultName);
    setFiliere(profile.filiere ?? '');
    setAnnee(profile.annee ?? '');
    setInterests(profile.interests ?? []);
  }, [profile, isLoading, defaultName]);

  const addInterest = (rawValue: string) => {
    const trimmed = rawValue.trim();
    if (!trimmed || trimmed.length > 30) {
      return;
    }
    if (!interests.includes(trimmed)) {
      setInterests([...interests, trimmed]);
    }
  };

  const handleInterestSubmit = () => {
    const parts = interestInput.split(',');
    parts.forEach((part) => addInterest(part));
    setInterestInput('');
  };

  const handleSave = async () => {
    const payload: StudentProfile = {
      displayName: displayName.trim() || defaultName,
      filiere: filiere.trim(),
      annee: annee.trim(),
      interests,
    };
    await saveProfile(payload);
    Alert.alert('Profil', 'Profil mis a jour.');
  };

  const handleLogout = () => {
    Alert.alert('Deconnexion', 'Voulez-vous vous deconnecter ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Se deconnecter',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/auth/login');
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <ScreenHeader title="Profil etudiant" showBack onBack={() => router.back()} />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Field label="Nom affiche">
          <Input
            value={displayName}
            onChangeText={setDisplayName}
            placeholder={defaultName}
          />
        </Field>

        <Field label="Filiere">
          <Input
            value={filiere}
            onChangeText={setFiliere}
            placeholder="Genie Informatique"
          />
        </Field>

        <Field label="Annee">
          <Input value={annee} onChangeText={setAnnee} placeholder="Master 1" />
        </Field>

        <Field label="Centres d'interet">
          <Input
            value={interestInput}
            onChangeText={setInterestInput}
            placeholder="IA/ML, Cloud, Startup"
            onSubmitEditing={handleInterestSubmit}
          />
          <View style={styles.tagsRow}>
            {interests.map((tag) => (
              <Pressable
                key={tag}
                onPress={() => setInterests(interests.filter((item) => item !== tag))}>
                <TagPill label={tag} />
              </Pressable>
            ))}
          </View>
        </Field>

        {error ? (
          <Text variant="caption" color={Colors.danger}>
            {error}
          </Text>
        ) : null}

        <Button label="Enregistrer" onPress={handleSave} />

        <Button
          label="Se deconnecter"
          variant="danger-ghost"
          onPress={handleLogout}
          style={styles.logoutButton}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  content: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  logoutButton: {
    marginTop: Spacing.sm,
  },
});
