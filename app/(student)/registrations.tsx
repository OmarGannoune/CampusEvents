import { Pressable, SectionList, StyleSheet, Text, View } from 'react-native';

import { EmptyState } from '@/components/ui/EmptyState';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { Colors } from '@/constants/colors';
import { Radius, Spacing } from '@/constants/spacing';
import { useAuth } from '@/context/AuthContext';
import { getEventById } from '@/database/events';
import { useRegistrations } from '@/hooks/useRegistrations';
import type { Event, Registration } from '@/types';

export default function RegistrationsScreen() {
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
      <ScreenHeader title="Mes inscriptions" subtitle={`${rows.length} inscriptions`} />
      <View style={styles.content}>
        {rows.length === 0 ? (
          <EmptyState
            icon="ti-ticket"
            title="Aucune inscription. Découvrez les événements !"
          />
        ) : (
          <SectionList
            sections={sections}
            keyExtractor={(item) => item.registration.id}
            contentContainerStyle={styles.list}
            renderSectionHeader={({ section }) => (
              <Text style={styles.sectionTitle}>{section.title}</Text>
            )}
            renderItem={({ item }) => {
              const isPast = new Date(item.event.startDateTime).getTime() < now;
              return (
                <View style={styles.card}>
                  <View style={styles.cardRow}>
                    <View style={styles.cardLeft}>
                      <Text style={styles.cardTitle}>{item.event.title}</Text>
                      <Text style={styles.cardMeta}>
                        {new Date(item.event.startDateTime).toLocaleDateString('fr-FR')}
                      </Text>
                    </View>
                    <View style={[styles.badge, isPast && styles.badgePast]}>
                      <Text style={[styles.badgeText, isPast && styles.badgeTextPast]}>
                        {isPast ? 'Passé' : 'Confirmé'}
                      </Text>
                    </View>
                  </View>
                  {!isPast ? (
                    <Pressable onPress={() => cancelEventRegistration(item.event.id)}>
                      <Text style={styles.cancelText}>Annuler l'inscription</Text>
                    </Pressable>
                  ) : null}
                </View>
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
    paddingBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  card: {
    backgroundColor: Colors.card,
    borderWidth: 0.5,
    borderColor: Colors.borderCard,
    borderRadius: Radius.lg,
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
  cardTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textPrimary,
  },
  cardMeta: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  badge: {
    backgroundColor: Colors.successLight,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
  },
  badgePast: {
    backgroundColor: Colors.borderDefault,
  },
  badgeText: {
    fontSize: 11,
    color: Colors.successDark,
    fontWeight: '500',
  },
  badgeTextPast: {
    color: Colors.textSecondary,
  },
  cancelText: {
    fontSize: 12,
    color: Colors.danger,
  },
});
