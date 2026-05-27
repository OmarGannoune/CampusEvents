import DateTimePicker from '@react-native-community/datetimepicker';
import { useMemo, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Button } from '@/components/ui/Button';
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

type PickerField = 'start' | 'end' | null;

const CATEGORY_OPTIONS: EventCategory[] = ['Talk', 'Workshop', 'Club', 'Exam', 'Other'];

function formatDateTime(value?: Date | null): string {
  if (!value) {
    return '';
  }
  const date = value.toLocaleDateString('fr-FR', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
  const time = value.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  return `${date} · ${time}`;
}

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

  const formattedStart = useMemo(() => formatDateTime(startDateTime), [startDateTime]);
  const formattedEnd = useMemo(() => formatDateTime(endDateTime), [endDateTime]);

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

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
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
                <CategoryChip category={item} size="sm" />
              </Pressable>
            );
          })}
        </View>
      </Field>

      <Field label="Date de début" error={errors.startDateTime}>
        <Pressable style={styles.inputPressable} onPress={() => setPickerField('start')}>
          <Text
            variant="body"
            color={formattedStart ? Colors.textPrimary : Colors.textHint}>
            {formattedStart || 'Sélectionner une date'}
          </Text>
        </Pressable>
      </Field>

      <Field label="Date de fin" error={errors.endDateTime}>
        <Pressable style={styles.inputPressable} onPress={() => setPickerField('end')}>
          <Text
            variant="body"
            color={formattedEnd ? Colors.textPrimary : Colors.textHint}>
            {formattedEnd || 'Sélectionner une date (optionnel)'}
          </Text>
        </Pressable>
      </Field>

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
        />
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

      <Button label={submitLabel} onPress={handleSubmit} />

      {pickerField ? (
        <DateTimePicker
          value={pickerField === 'start' ? startDateTime ?? new Date() : endDateTime ?? new Date()}
          mode="datetime"
          display="default"
          onChange={(_, selected) => {
            if (Platform.OS !== 'ios') {
              setPickerField(null);
            }
            if (!selected) {
              return;
            }
            if (pickerField === 'start') {
              setStartDateTime(selected);
            } else {
              setEndDateTime(selected);
            }
          }}
        />
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  categoryChip: {
    borderRadius: Radius.full,
  },
  categoryChipSelected: {
    borderWidth: 1,
    borderColor: Colors.borderStrong,
  },
  inputPressable: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.borderDefault,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
});
