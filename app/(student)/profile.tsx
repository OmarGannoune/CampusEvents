import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Colors } from '@/constants/colors';
import { Radius, Spacing } from '@/constants/spacing';
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
        <View style={styles.field}>
          <Text style={styles.label}>Nom affiche</Text>
          <TextInput
            value={displayName}
            onChangeText={setDisplayName}
            placeholder={defaultName}
            placeholderTextColor={Colors.textHint}
            style={styles.input}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Filiere</Text>
          <TextInput
            value={filiere}
            onChangeText={setFiliere}
            placeholder="Genie Informatique"
            placeholderTextColor={Colors.textHint}
            style={styles.input}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Annee</Text>
          <TextInput
            value={annee}
            onChangeText={setAnnee}
            placeholder="Master 1"
            placeholderTextColor={Colors.textHint}
            style={styles.input}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Centres d'interet</Text>
          <TextInput
            value={interestInput}
            onChangeText={setInterestInput}
            placeholder="IA/ML, Cloud, Startup"
            placeholderTextColor={Colors.textHint}
            style={styles.input}
            onSubmitEditing={handleInterestSubmit}
          />
          <View style={styles.tagsRow}>
            {interests.map((tag) => (
              <Pressable
                key={tag}
                onPress={() => setInterests(interests.filter((item) => item !== tag))}>
                <View style={styles.tagPill}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Pressable style={styles.submitButton} onPress={handleSave}>
          <Text style={styles.submitText}>Enregistrer</Text>
        </Pressable>

        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Se deconnecter</Text>
        </Pressable>
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
  field: {
    gap: Spacing.xs,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.textPrimary,
  },
  input: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  tagPill: {
    backgroundColor: Colors.purpleLight,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
  },
  tagText: {
    fontSize: 11,
    color: Colors.purple,
  },
  error: {
    fontSize: 12,
    color: Colors.danger,
  },
  submitButton: {
    backgroundColor: Colors.purple,
    borderRadius: Radius.md,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
  },
  submitText: {
    color: Colors.textOnDark,
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  logoutButton: {
    marginTop: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.danger,
    borderRadius: Radius.md,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
  },
  logoutText: {
    color: Colors.danger,
    fontSize: 11,
    fontWeight: '500',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});
