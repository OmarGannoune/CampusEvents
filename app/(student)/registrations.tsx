import { useRouter } from 'expo-router';
import { Pressable, SectionList, StyleSheet, View } from 'react-native';

import { ProfileButton } from '@/components/student/ProfileButton';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Text } from '@/components/ui/Text';
import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { useAuth } from '@/context/AuthContext';
import { getEventById } from '@/database/events';
import { useRegistrations } from '@/hooks/useRegistrations';
import type { Event, Registration } from '@/types';

export default function RegistrationsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { registrations, cancelEventRegistration } = useRegistrations(user?.email ?? '');

  const rows = registrations
    .filter((registration) => registration.status === 'confirmed')
    .map((registration) => ({
      registration,
      event: getEventById(registration.eventId),
    }))
    .filter((row): row is { registration: Registration; event: Event } => !!row.event);

  const now = Date.now();
  const upcoming = rows.filter((row) => new Date(row.event.startDateTime).getTime() >= now);
  const past = rows.filter((row) => new Date(row.event.startDateTime).getTime() < now);

  const sections = [
    { title: 'À venir', data: upcoming },
    { title: 'Passés', data: past },
  ];

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Mes inscriptions"
        subtitle={`${rows.length} inscriptions`}
        rightElement={<ProfileButton onPress={() => router.push('/(student)/profile')} />}
      />
      <View style={styles.content}>
        {rows.length === 0 ? (
          <EmptyState
            icon="ticket"
            title="Aucune inscription. Découvrez les événements !"
          />
        ) : (
          <SectionList
            sections={sections}
            keyExtractor={(item) => item.registration.id}
            contentContainerStyle={styles.list}
            renderSectionHeader={({ section }) => (
              <Text variant="label" color={Colors.textSecondary} style={styles.sectionTitle}>
                {section.title}
              </Text>
            )}
            renderItem={({ item }) => {
              const isPast = new Date(item.event.startDateTime).getTime() < now;
              const badge = isPast
                ? { label: 'Passé', backgroundColor: Colors.borderDefault, textColor: Colors.textSecondary }
                : { label: 'Confirmé', backgroundColor: Colors.successLight, textColor: Colors.successDark };
              return (
                <Card style={styles.card}>
                  <View style={styles.cardRow}>
                    <View style={styles.cardLeft}>
                      <Text variant="sectionTitle" color={Colors.textPrimary}>
                        {item.event.title}
                      </Text>
                      <Text variant="caption" color={Colors.textSecondary}>
                        {new Date(item.event.startDateTime).toLocaleDateString('fr-FR')}
                      </Text>
                    </View>
                    <Badge
                      label={badge.label}
                      backgroundColor={badge.backgroundColor}
                      textColor={badge.textColor}
                    />
                  </View>
                  {!isPast ? (
                    <Pressable onPress={() => cancelEventRegistration(item.event.id)}>
                      <Text variant="caption" color={Colors.danger}>
                        Annuler l'inscription
                      </Text>
                    </Pressable>
                  ) : null}
                </Card>
              );
            }}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  content: {
    flex: 1,
    padding: Spacing.lg,
  },
  list: {
    gap: Spacing.md,
    paddingBottom: 120, // Increased to account for the floating tab bar
  },
  sectionTitle: {
    marginBottom: Spacing.sm,
  },
  card: {
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardLeft: {
    gap: 4,
    flex: 1,
  },
  cancelText: {
    color: Colors.danger,
  },
});
