import DateTimePicker from '@react-native-community/datetimepicker';
import { useMemo, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { CategoryChip } from '@/components/ui/CategoryChip';
import { Field } from '@/components/ui/Field';
import { Input } from '@/components/ui/Input';
import { TagPill } from '@/components/ui/TagPill';
import { Text } from '@/components/ui/Text';
import { Colors } from '@/constants/colors';
import { Radius, Spacing } from '@/constants/spacing';
import type { Event, EventCategory } from '@/types';

export type EventFormValues = Omit<Event, 'id' | 'createdAt' | 'registeredCount'>;

type EventFormProps = {
  initialValues?: Partial<EventFormValues>;
  submitLabel: string;
  onSubmit: (values: EventFormValues) => void;
};

type FieldErrors = Partial<Record<keyof EventFormValues, string>>;

type PickerField = 'startDate' | 'startTime' | 'endDate' | 'endTime' | null;

const CATEGORY_OPTIONS: EventCategory[] = ['Talk', 'Workshop', 'Club', 'Exam', 'Other'];

export function EventForm({ initialValues, submitLabel, onSubmit }: EventFormProps) {
  const [title, setTitle] = useState(initialValues?.title ?? '');
  const [description, setDescription] = useState(initialValues?.description ?? '');
  const [category, setCategory] = useState<EventCategory | null>(
    initialValues?.category ?? null
  );
  const [startDateTime, setStartDateTime] = useState<Date | null>(
    initialValues?.startDateTime ? new Date(initialValues.startDateTime) : null
  );
  const [endDateTime, setEndDateTime] = useState<Date | null>(
    initialValues?.endDateTime ? new Date(initialValues.endDateTime) : null
  );
  const [locationName, setLocationName] = useState(initialValues?.locationName ?? '');
  const [locationAddress, setLocationAddress] = useState(initialValues?.locationAddress ?? '');
  const [organizerName, setOrganizerName] = useState(
    initialValues?.organizerName ?? 'Campus Admin'
  );
  const [capacity, setCapacity] = useState(
    initialValues?.capacity ? String(initialValues.capacity) : ''
  );
  const [tags, setTags] = useState<string[]>(initialValues?.tags ?? []);
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [pickerField, setPickerField] = useState<PickerField>(null);

  const addTag = (rawTag: string) => {
    const trimmed = rawTag.trim();
    if (!trimmed || trimmed.length > 30) {
      return;
    }
    if (!tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
    }
  };

  const handleTagSubmit = () => {
    const parts = tagInput.split(',');
    parts.forEach((part) => addTag(part));
    setTagInput('');
  };

  const validate = (): FieldErrors => {
    const nextErrors: FieldErrors = {};
    if (!title.trim()) nextErrors.title = 'Titre requis';
    if (!description.trim()) nextErrors.description = 'Description requise';
    if (!category) nextErrors.category = 'Catégorie requise';
    if (!startDateTime) nextErrors.startDateTime = 'Date de début requise';
    if (!locationName.trim()) nextErrors.locationName = 'Lieu requis';

    if (endDateTime && startDateTime && endDateTime <= startDateTime) {
      nextErrors.endDateTime = 'La date de fin doit être après la date de début';
    }

    if (capacity.trim()) {
      const value = Number(capacity);
      if (!Number.isInteger(value) || value <= 0) {
        nextErrors.capacity = 'La capacité doit être un entier positif';
      }
    }

    const invalidTag = tags.find((tag) => !tag.trim() || tag.length > 30);
    if (invalidTag) {
      nextErrors.tags = 'Chaque tag doit contenir 1 à 30 caractères';
    }

    return nextErrors;
  };

  const handleSubmit = () => {
    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      category: category as EventCategory,
      startDateTime: (startDateTime as Date).toISOString(),
      endDateTime: endDateTime ? endDateTime.toISOString() : undefined,
      locationName: locationName.trim(),
      locationAddress: locationAddress.trim() || undefined,
      organizerName: organizerName.trim() || 'Campus Admin',
      capacity: capacity.trim() ? Number(capacity) : undefined,
      imageUrl: undefined,
      tags,
    });
  };

  const togglePicker = (field: PickerField) => {
    setPickerField(pickerField === field ? null : field);
  };

  const handleDateChange = (selected: Date | undefined, field: PickerField) => {
    if (Platform.OS !== 'ios') {
      setPickerField(null);
    }
    if (!selected) return;

    if (field === 'startDate') {
      const current = startDateTime ?? new Date();
      selected.setHours(current.getHours(), current.getMinutes());
      setStartDateTime(selected);
    } else if (field === 'startTime') {
      const current = startDateTime ?? new Date();
      current.setHours(selected.getHours(), selected.getMinutes());
      setStartDateTime(new Date(current));
    } else if (field === 'endDate') {
      const current = endDateTime ?? new Date();
      selected.setHours(current.getHours(), current.getMinutes());
      setEndDateTime(selected);
    } else if (field === 'endTime') {
      const current = endDateTime ?? new Date();
      current.setHours(selected.getHours(), selected.getMinutes());
      setEndDateTime(new Date(current));
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Card style={styles.sectionCard}>
        <Text variant="sectionTitle" color={Colors.purple} style={styles.sectionHeader}>
          Informations générales
        </Text>
        <Field label="Titre" error={errors.title}>
          <Input
            value={title}
            onChangeText={setTitle}
            placeholder="Titre de l'événement"
          />
        </Field>

        <Field label="Description" error={errors.description}>
          <Input
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            placeholder="Description de l'événement"
          />
        </Field>

        <Field label="Catégorie" error={errors.category}>
          <View style={styles.categoryRow}>
            {CATEGORY_OPTIONS.map((item) => {
              const selected = category === item;
              return (
                <Pressable
                  key={item}
                  onPress={() => setCategory(item)}
                  style={[styles.categoryChip, selected && styles.categoryChipSelected]}>
                  <CategoryChip category={item} size="md" />
                </Pressable>
              );
            })}
          </View>
        </Field>

        <Field label="Tags" error={errors.tags}>
          <Input
            value={tagInput}
            onChangeText={setTagInput}
            placeholder="Entrer un tag puis virgule"
            onSubmitEditing={handleTagSubmit}
          />
          <View style={styles.tagsRow}>
            {tags.map((tag) => (
              <Pressable key={tag} onPress={() => setTags(tags.filter((item) => item !== tag))}>
                <TagPill label={tag} />
              </Pressable>
            ))}
          </View>
        </Field>
      </Card>

      <Card style={styles.sectionCard}>
        <Text variant="sectionTitle" color={Colors.purple} style={styles.sectionHeader}>
          Planification
        </Text>
        <View style={styles.row}>
          <View style={styles.flex1}>
            <Field label="Date de début" error={errors.startDateTime}>
              <Pressable style={styles.inputPressable} onPress={() => togglePicker('startDate')}>
                <Text variant="body" color={startDateTime ? Colors.textPrimary : Colors.textHint}>
                  {startDateTime ? startDateTime.toLocaleDateString('fr-FR') : 'Sélectionner'}
                </Text>
              </Pressable>
            </Field>
          </View>
          <View style={styles.flex1}>
            <Field label="Heure">
              <Pressable style={styles.inputPressable} onPress={() => togglePicker('startTime')}>
                <Text variant="body" color={startDateTime ? Colors.textPrimary : Colors.textHint}>
                  {startDateTime ? startDateTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : 'Sélectionner'}
                </Text>
              </Pressable>
            </Field>
          </View>
        </View>

        {Platform.OS === 'ios' && (pickerField === 'startDate' || pickerField === 'startTime') ? (
          <View style={styles.inlinePicker}>
            <DateTimePicker
              value={startDateTime ?? new Date()}
              mode={pickerField === 'startTime' ? 'time' : 'date'}
              display="spinner"
              onChange={(_, selected) => handleDateChange(selected, pickerField)}
            />
          </View>
        ) : null}

        <View style={styles.row}>
          <View style={styles.flex1}>
            <Field label="Date de fin" error={errors.endDateTime}>
              <Pressable style={styles.inputPressable} onPress={() => togglePicker('endDate')}>
                <Text variant="body" color={endDateTime ? Colors.textPrimary : Colors.textHint}>
                  {endDateTime ? endDateTime.toLocaleDateString('fr-FR') : 'Optionnel'}
                </Text>
              </Pressable>
            </Field>
          </View>
          <View style={styles.flex1}>
            <Field label="Heure">
              <Pressable style={styles.inputPressable} onPress={() => togglePicker('endTime')}>
                <Text variant="body" color={endDateTime ? Colors.textPrimary : Colors.textHint}>
                  {endDateTime ? endDateTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : 'Optionnel'}
                </Text>
              </Pressable>
            </Field>
          </View>
        </View>

        {Platform.OS === 'ios' && (pickerField === 'endDate' || pickerField === 'endTime') ? (
          <View style={styles.inlinePicker}>
            <DateTimePicker
              value={endDateTime ?? new Date()}
              mode={pickerField === 'endTime' ? 'time' : 'date'}
              display="spinner"
              onChange={(_, selected) => handleDateChange(selected, pickerField)}
            />
          </View>
        ) : null}
      </Card>

      <Card style={styles.sectionCard}>
        <Text variant="sectionTitle" color={Colors.purple} style={styles.sectionHeader}>
          Lieu & Organisation
        </Text>
        <Field label="Lieu" error={errors.locationName}>
          <Input value={locationName} onChangeText={setLocationName} />
        </Field>

        <Field label="Adresse">
          <Input value={locationAddress} onChangeText={setLocationAddress} />
        </Field>

        <Field label="Organisateur">
          <Input value={organizerName} onChangeText={setOrganizerName} />
        </Field>

        <Field label="Capacité" error={errors.capacity}>
          <Input
            value={capacity}
            onChangeText={setCapacity}
            keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}
            placeholder="Ex: 50"
          />
        </Field>
      </Card>

      <View style={styles.submitContainer}>
        <Button label={submitLabel} onPress={handleSubmit} size="lg" />
      </View>

      {Platform.OS !== 'ios' && pickerField ? (
        <DateTimePicker
          value={
            pickerField === 'startDate' || pickerField === 'startTime'
              ? startDateTime ?? new Date()
              : endDateTime ?? new Date()
          }
          mode={pickerField === 'startTime' || pickerField === 'endTime' ? 'time' : 'date'}
          display="default"
          onChange={(_, selected) => handleDateChange(selected, pickerField)}
        />
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
    gap: Spacing.xl,
    paddingBottom: Spacing.xxl || 40,
  },
  sectionCard: {
    padding: Spacing.lg,
    gap: Spacing.md,
    borderWidth: 0,
    shadowColor: Colors.purple,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
  },
  sectionHeader: {
    marginBottom: Spacing.xs,
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  categoryChip: {
    borderRadius: Radius.full,
    opacity: 0.5,
  },
  categoryChipSelected: {
    opacity: 1,
    shadowColor: Colors.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputPressable: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  row: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  flex1: {
    flex: 1,
  },
  submitContainer: {
    marginTop: Spacing.sm,
  },
  inlinePicker: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    overflow: 'hidden',
  },
});
