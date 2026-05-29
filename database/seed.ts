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
  {
    title: 'Code Blue Hackathon 2026',
    description: '48-hour hackathon focused on water sustainability, environmental innovation, and digital solutions. Teams collaborate to build impactful projects addressing real-world challenges.',
    category: 'Workshop',
    startDateTime: '2026-06-15T09:00:00',
    endDateTime: '2026-06-17T18:00:00',
    locationName: 'Hall Principal - FST Tanger',
    organizerName: 'IT Geeks FSTT',
    capacity: 200,
    tags: ['Hackathon', 'Sustainability', 'Technology']
  },
  {
    title: 'AI Bootcamp',
    description: 'A hands-on workshop introducing machine learning, computer vision, and modern AI tools through practical projects.',
    category: 'Workshop',
    startDateTime: '2026-06-20T09:00:00',
    endDateTime: '2026-06-20T17:00:00',
    locationName: 'Laboratoire Informatique 2',
    organizerName: 'IT Geeks FSTT',
    capacity: 40,
    tags: ['AI', 'Machine Learning', 'Workshop']
  },
  {
    title: 'Startup Weekend FST',
    description: 'Students work in teams to transform innovative ideas into viable startups and pitch them before a jury of entrepreneurs.',
    category: 'Workshop',
    startDateTime: '2026-06-25T08:30:00',
    endDateTime: '2026-06-27T17:00:00',
    locationName: 'Salle de Conférence',
    organizerName: 'Enactus FST Tanger',
    capacity: 100,
    tags: ['Startup', 'Entrepreneurship']
  },
  {
    title: 'Social Impact Forum',
    description: 'Conference gathering entrepreneurs, NGOs, and students to discuss sustainable development and social innovation.',
    category: 'Talk',
    startDateTime: '2026-02-20T14:00:00',
    endDateTime: '2026-02-20T18:00:00',
    locationName: 'Amphi A',
    organizerName: 'Enactus FST Tanger',
    capacity: 150,
    tags: ['Social Impact', 'NGO', 'Conference']
  },
  {
    title: '3D Printing Discovery Day',
    description: 'Introduction to additive manufacturing, rapid prototyping, and practical demonstrations using 3D printers.',
    category: 'Workshop',
    startDateTime: '2026-07-05T10:00:00',
    endDateTime: '2026-07-05T16:00:00',
    locationName: 'GreenLab Fablab',
    organizerName: 'GreenLab Fablab',
    capacity: 30,
    tags: ['3D Printing', 'Maker', 'Workshop']
  },
  {
    title: 'Robotics Challenge',
    description: 'Competition where student teams design and program autonomous robots to complete engineering challenges.',
    category: 'Other',
    startDateTime: '2026-07-18T09:00:00',
    endDateTime: '2026-07-18T18:00:00',
    locationName: 'GreenLab Arena',
    organizerName: 'GreenLab Fablab',
    capacity: 60,
    tags: ['Robotics', 'Competition']
  },
  {
    title: 'PET Recycling Workshop',
    description: 'Workshop focused on plastic recycling technologies and filament production for 3D printing applications.',
    category: 'Workshop',
    startDateTime: '2026-05-09T09:30:00',
    endDateTime: '2026-05-09T15:30:00',
    locationName: 'GreenLab Fablab',
    organizerName: 'GreenLab Fablab',
    capacity: 25,
    tags: ['Recycling', 'Sustainability', 'Workshop']
  },
  {
    title: 'Ramadan Solidarity Campaign',
    description: 'Charity initiative involving food collection and distribution to families in need across the Tangier region.',
    category: 'Club',
    startDateTime: '2026-03-07T09:00:00',
    endDateTime: '2026-03-07T17:00:00',
    locationName: 'Campus FST Tanger',
    organizerName: 'Bougeons Ensemble',
    capacity: undefined,
    tags: ['Charity', 'Humanitarian', 'Solidarity']
  },
  {
    title: 'Blood Donation Day',
    description: 'Awareness and blood donation campaign organized in partnership with local healthcare organizations.',
    category: 'Other',
    startDateTime: '2026-06-10T09:00:00',
    endDateTime: '2026-06-10T15:00:00',
    locationName: 'Hall Central',
    organizerName: 'Bougeons Ensemble',
    capacity: undefined,
    tags: ['Health', 'Donation', 'Community Service']
  },
  {
    title: 'University Football Tournament',
    description: 'Inter-department football competition promoting teamwork, sportsmanship, and student engagement.',
    category: 'Other',
    startDateTime: '2026-08-21T08:00:00',
    endDateTime: '2026-08-22T18:00:00',
    locationName: 'Terrain Sportif FST',
    organizerName: 'Club Sportif FST',
    capacity: 200,
    tags: ['Sports', 'Football', 'Tournament']
  },
  {
    title: 'FST Running Challenge',
    description: 'Campus-wide running event encouraging students to adopt healthy lifestyles and regular physical activity.',
    category: 'Other',
    startDateTime: '2026-05-16T08:00:00',
    endDateTime: '2026-05-16T12:00:00',
    locationName: 'Campus FST Tanger',
    organizerName: 'Club Sportif FST',
    capacity: 500,
    tags: ['Sports', 'Running', 'Health']
  },
  {
    title: 'Legends Leadership Summit',
    description: 'A leadership-focused conference featuring successful alumni, entrepreneurs, and industry professionals.',
    category: 'Talk',
    startDateTime: '2026-02-28T09:00:00',
    endDateTime: '2026-02-28T17:00:00',
    locationName: 'Amphi Principal',
    organizerName: 'The Legends FSTT',
    capacity: 300,
    tags: ['Leadership', 'Conference', 'Alumni']
  },
  {
    title: 'Personal Branding Masterclass',
    description: 'Training session on networking, personal branding, LinkedIn optimization, and career development.',
    category: 'Workshop',
    startDateTime: '2026-04-04T14:00:00',
    endDateTime: '2026-04-04T18:00:00',
    locationName: 'Salle Polyvalente',
    organizerName: 'The Legends FSTT',
    capacity: 50,
    tags: ['Career', 'Networking', 'Masterclass']
  },
  {
    title: 'Career Fair 2026',
    description: 'Networking event connecting students with recruiters, alumni, and professionals from various industries.',
    category: 'Other',
    startDateTime: '2026-06-25T09:00:00',
    endDateTime: '2026-06-25T17:00:00',
    locationName: 'Hall Principal - FST Tanger',
    organizerName: 'The Legends FSTT',
    capacity: 1000,
    tags: ['Career', 'Networking', 'Fair']
  }
];

export function seedDatabase(): void {
  const existing = getAllEvents();
  const existingTitles = new Set(existing.map((e) => e.title));
  
  SEED_EVENTS.forEach((event) => {
    if (!existingTitles.has(event.title)) {
      createEvent(event);
    }
  });
}
