import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { DeleteConfirmModal } from '@/components/admin/DeleteConfirmModal';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { CategoryChip } from '@/components/ui/CategoryChip';
import { EmptyState } from '@/components/ui/EmptyState';
import { Icon } from '@/components/ui/Icon';
import { ScreenHeader } from '@/components/ui/ScreenHeader';
import { TagPill } from '@/components/ui/TagPill';
import { Text } from '@/components/ui/Text';
import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/spacing';
import { useAuth } from '@/context/AuthContext';
import { deleteEvent, getEventById } from '@/database/events';
import { getRegistrationsForEvent } from '@/database/registrations';
import type { Registration } from '@/types';

function formatDateRange(startDateTime: string, endDateTime?: string): string {
  const start = new Date(startDateTime);
  const end = endDateTime ? new Date(endDateTime) : null;
  const date = start.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
  const startTime = start.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  if (!end) {
    return `${date} · ${startTime}`;
  }
  const endTime = end.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  return `${date} · ${startTime} - ${endTime}`;
}

function formatStatus(status: Registration['status']) {
  if (status === 'cancelled') {
    return {
      label: 'Annulee',
      backgroundColor: Colors.borderDefault,
      textColor: Colors.textSecondary,
    };
  }
  return {
    label: 'Confirmee',
    backgroundColor: Colors.successLight,
    textColor: Colors.successDark,
  };
}

export default function AdminEventDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();
  const { logout } = useAuth();
  const [showDelete, setShowDelete] = useState(false);

  const event = useMemo(() => (params.id ? getEventById(params.id) : null), [params.id]);
  const registrations = useMemo(
    () => (event ? getRegistrationsForEvent(event.id) : []),
    [event]
  );

  if (!event) {
    return (
      <View style={styles.container}>
        <ScreenHeader
          title="Details de l'evenement"
          showBack
          onBack={() => router.back()}
          rightElement={
            <Pressable
              onPress={async () => {
                await logout();
                router.replace('/auth/login');
              }}>
              <Icon name="logout" size={16} color={Colors.textOnDarkMuted} />
            </Pressable>
          }
        />
        <View style={styles.content}>
          <EmptyState icon="calendar" title="Evenement introuvable" />
        </View>
      </View>
    );
  }

  const handleDelete = () => {
    deleteEvent(event.id);
    setShowDelete(false);
    Alert.alert('Supprime', "L'evenement a ete supprime.");
    router.back();
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Details de l'evenement"
        showBack
        onBack={() => router.back()}
        rightElement={
          <Pressable
            onPress={async () => {
              await logout();
              router.replace('/auth/login');
            }}>
            <Icon name="logout" size={16} color={Colors.textOnDarkMuted} />
          </Pressable>
        }
      />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerBlock}>
          <CategoryChip category={event.category} size="sm" />
          <Text variant="sectionTitle" color={Colors.textPrimary}>
            {event.title}
          </Text>
          <Text variant="caption" color={Colors.textSecondary}>
            {formatDateRange(event.startDateTime, event.endDateTime)}
          </Text>
          <Text variant="caption" color={Colors.textSecondary}>
            {event.locationName}
            {event.locationAddress ? ` · ${event.locationAddress}` : ''}
          </Text>
          <Text variant="caption" color={Colors.textSecondary}>
            Organisateur: {event.organizerName}
          </Text>
        </View>

        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <Text variant="caption" color={Colors.textSecondary}>
              Capacite
            </Text>
            <Text variant="sectionTitle" color={Colors.textPrimary}>
              {event.capacity ?? 'Illimitee'}
            </Text>
          </Card>
          <Card style={styles.statCard}>
            <Text variant="caption" color={Colors.textSecondary}>
              Inscrits
            </Text>
            <Text variant="sectionTitle" color={Colors.textPrimary}>
              {event.registeredCount}
            </Text>
          </Card>
        </View>

        <View style={styles.section}>
          <Text variant="sectionTitle" color={Colors.textPrimary}>
            Description
          </Text>
          <Text variant="body" color={Colors.textPrimary} style={styles.body}>
            {event.description}
          </Text>
        </View>

        {event.tags.length > 0 ? (
          <View style={styles.section}>
            <Text variant="sectionTitle" color={Colors.textPrimary}>
              Tags
            </Text>
            <View style={styles.tagsRow}>
              {event.tags.map((tag) => (
                <TagPill key={tag} label={tag} />
              ))}
            </View>
          </View>
        ) : null}

        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text variant="sectionTitle" color={Colors.textPrimary}>
              Inscriptions
            </Text>
            <Text variant="caption" color={Colors.textSecondary}>
              {registrations.length} etudiants
            </Text>
          </View>
          {registrations.length === 0 ? (
            <EmptyState icon="users" title="Aucune inscription pour le moment" />
          ) : (
            <View style={styles.registrationList}>
              {registrations.map((registration) => {
                const status = formatStatus(registration.status);
                return (
                  <Card key={registration.id} style={styles.registrationRow}>
                    <View style={styles.registrationInfo}>
                      <Text variant="label" color={Colors.textPrimary}>
                        {registration.userId}
                      </Text>
                      <Text variant="caption" color={Colors.textSecondary}>
                        {new Date(registration.createdAt).toLocaleDateString('fr-FR')}
                      </Text>
                    </View>
                    <Badge
                      label={status.label}
                      backgroundColor={status.backgroundColor}
                      textColor={status.textColor}
                    />
                  </Card>
                );
              })}
            </View>
          )}
        </View>

        <View style={styles.actionsRow}>
          <Button
            label="Modifier l'evenement"
            onPress={() => router.push(`/(admin)/edit/${event.id}`)}
          />
          <Button
            label="Supprimer"
            variant="danger-ghost"
            onPress={() => setShowDelete(true)}
          />
        </View>
      </ScrollView>

      <DeleteConfirmModal
        visible={showDelete}
        title={event.title}
        onCancel={() => setShowDelete(false)}
        onConfirm={handleDelete}
      />
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
    gap: Spacing.lg,
  },
  headerBlock: {
    gap: Spacing.xs,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  statCard: {
    flex: 1,
    padding: Spacing.md,
    gap: 4,
  },
  section: {
    gap: Spacing.sm,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  body: {
    lineHeight: 20,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  registrationList: {
    gap: Spacing.sm,
  },
  registrationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
  },
  registrationInfo: {
    flex: 1,
    gap: 4,
  },
  actionsRow: {
    gap: Spacing.sm,
  },
});
