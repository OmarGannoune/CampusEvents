import DateTimePicker from '@react-native-community/datetimepicker';
import { useMemo, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { Colors } from '@/constants/colors';
import { Radius, Spacing } from '@/constants/spacing';
import type { Event, EventCategory } from '@/types';

import { CategoryChip } from '@/components/ui/CategoryChip';

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
      <View style={styles.field}>
        <Text style={styles.label}>Titre</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          style={styles.input}
          placeholder="Titre de l'événement"
        />
        {errors.title ? <Text style={styles.error}>{errors.title}</Text> : null}
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          style={[styles.input, styles.textArea]}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          placeholder="Description de l'événement"
        />
        {errors.description ? <Text style={styles.error}>{errors.description}</Text> : null}
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Catégorie</Text>
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
        {errors.category ? <Text style={styles.error}>{errors.category}</Text> : null}
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Date de début</Text>
        <Pressable style={styles.input} onPress={() => setPickerField('start')}>
          <Text style={formattedStart ? styles.inputText : styles.placeholder}>
            {formattedStart || 'Sélectionner une date'}
          </Text>
        </Pressable>
        {errors.startDateTime ? <Text style={styles.error}>{errors.startDateTime}</Text> : null}
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Date de fin</Text>
        <Pressable style={styles.input} onPress={() => setPickerField('end')}>
          <Text style={formattedEnd ? styles.inputText : styles.placeholder}>
            {formattedEnd || 'Sélectionner une date (optionnel)'}
          </Text>
        </Pressable>
        {errors.endDateTime ? <Text style={styles.error}>{errors.endDateTime}</Text> : null}
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Lieu</Text>
        <TextInput value={locationName} onChangeText={setLocationName} style={styles.input} />
        {errors.locationName ? <Text style={styles.error}>{errors.locationName}</Text> : null}
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Adresse</Text>
        <TextInput
          value={locationAddress}
          onChangeText={setLocationAddress}
          style={styles.input}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Organisateur</Text>
        <TextInput value={organizerName} onChangeText={setOrganizerName} style={styles.input} />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Capacité</Text>
        <TextInput
          value={capacity}
          onChangeText={setCapacity}
          style={styles.input}
          keyboardType={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}
        />
        {errors.capacity ? <Text style={styles.error}>{errors.capacity}</Text> : null}
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Tags</Text>
        <TextInput
          value={tagInput}
          onChangeText={setTagInput}
          style={styles.input}
          placeholder="Entrer un tag puis virgule"
          onSubmitEditing={handleTagSubmit}
        />
        <View style={styles.tagsRow}>
          {tags.map((tag) => (
            <Pressable key={tag} onPress={() => setTags(tags.filter((item) => item !== tag))}>
              <View style={styles.tagPill}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            </Pressable>
          ))}
        </View>
        {errors.tags ? <Text style={styles.error}>{errors.tags}</Text> : null}
      </View>

      <Pressable style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>{submitLabel}</Text>
      </Pressable>

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
  inputText: {
    color: Colors.textPrimary,
    fontSize: 14,
  },
  placeholder: {
    color: Colors.textHint,
    fontSize: 14,
  },
  textArea: {
    minHeight: 90,
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
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
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
    fontSize: 11,
    color: Colors.danger,
  },
  submitButton: {
    marginTop: Spacing.lg,
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
});
