import type { Event } from '@/types';

import { createEvent, getAllEvents } from './events';

const SEED_EVENTS: Array<Omit<Event, 'id' | 'createdAt' | 'registeredCount'>> = [
  {
    title: 'Machine Learning avec TensorFlow',
    description:
      "Découvrez les fondamentaux du ML avec TensorFlow 2.x. Travaux pratiques sur des datasets réels incluant classification d'images et prédiction de séries temporelles.",
    category: 'Workshop',
    startDateTime: '2026-05-26T14:00:00',
    endDateTime: '2026-05-26T17:00:00',
    locationName: 'Amphi B',
    locationAddress: 'Bâtiment Sciences, Université Abdelmalek Essaâdi',
    organizerName: 'Club IA Campus',
    capacity: 30,
    tags: ['python', 'machine-learning', 'tensorflow', 'data-science'],
  },
  {
    title: 'Entrepreneuriat & Startups Tech',
    description:
      'Table ronde avec 4 fondateurs de startups marocaines sur les défis du financement, du recrutement et de la croissance en phase early-stage.',
    category: 'Talk',
    startDateTime: '2026-05-27T10:00:00',
    endDateTime: '2026-05-27T12:00:00',
    locationName: 'Salle C1',
    organizerName: 'Bureau des Étudiants',
    capacity: 80,
    tags: ['startup', 'entrepreneuriat', 'financement', 'carrière'],
  },
  {
    title: 'IEEE Student Branch — Monthly Meet',
    description:
      'Réunion mensuelle du club IEEE. Présentation des projets en cours, annonces des prochaines compétitions et hackathons internationaux.',
    category: 'Club',
    startDateTime: '2026-05-28T16:00:00',
    locationName: 'Salle D2',
    organizerName: 'IEEE Student Branch UAE',
    tags: ['ieee', 'électronique', 'networking', 'compétition'],
  },
  {
    title: 'Workshop Design System avec Figma',
    description:
      'Maîtrisez la création de design systems professionnels avec Figma : composants, variantes, auto-layout et tokens. Projet pratique inclus.',
    category: 'Workshop',
    startDateTime: '2026-05-30T15:00:00',
    endDateTime: '2026-05-30T18:00:00',
    locationName: 'Labo Design',
    organizerName: 'Club UX/UI',
    capacity: 20,
    tags: ['figma', 'design', 'ui-ux', 'design-system'],
  },
  {
    title: 'Data Science avec Python — Initiation',
    description:
      'Introduction aux bibliothèques numpy, pandas et matplotlib. Nettoyage de données, analyse exploratoire et première visualisation sur un dataset réel.',
    category: 'Workshop',
    startDateTime: '2026-06-02T14:00:00',
    endDateTime: '2026-06-02T17:00:00',
    locationName: 'Labo Informatique 2',
    organizerName: 'Département Informatique',
    capacity: 25,
    tags: ['python', 'data-science', 'pandas', 'visualisation'],
  },
  {
    title: 'Kubernetes & DevOps — Introduction',
    description:
      "Déploiement d'applications avec Kubernetes, Docker, et CI/CD. Comprendre les architectures cloud-native et les pipelines modernes.",
    category: 'Workshop',
    startDateTime: '2026-06-04T09:00:00',
    endDateTime: '2026-06-04T12:00:00',
    locationName: 'Salle Réseau',
    organizerName: 'Club DevOps',
    capacity: 20,
    tags: ['kubernetes', 'docker', 'devops', 'cloud'],
  },
  {
    title: 'Cérémonie de remise des diplômes 2026',
    description:
      'Cérémonie officielle de remise des diplômes de la promotion 2025-2026. Accueil des familles et autorités universitaires.',
    category: 'Other',
    startDateTime: '2026-06-15T10:00:00',
    locationName: 'Amphi Principal',
    organizerName: 'Administration',
    tags: ['diplômes', 'cérémonie', 'promotion-2026'],
  },
  {
    title: 'Exam Algorithmique Avancée',
    description: 'Examen final du module Algorithmique Avancée. Calculatrice non autorisée. Durée : 2h30.',
    category: 'Exam',
    startDateTime: '2026-05-22T08:00:00',
    endDateTime: '2026-05-22T10:30:00',
    locationName: 'Amphi A',
    organizerName: 'Département Informatique',
    tags: ['algorithmique', 'exam', 'informatique'],
  },
];

export function seedDatabase(): void {
  const existing = getAllEvents();
  if (existing.length > 0) {
    return;
  }
  SEED_EVENTS.forEach((event) => {
    createEvent(event);
  });
}
