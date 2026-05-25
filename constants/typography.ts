export const Typography = {
  // Sizes
  display: { fontSize: 22, fontWeight: '500' as const, letterSpacing: -0.5 },
  title: { fontSize: 18, fontWeight: '500' as const },
  sectionTitle: { fontSize: 15, fontWeight: '500' as const },
  body: { fontSize: 14, fontWeight: '400' as const, lineHeight: 22 },
  caption: { fontSize: 12, fontWeight: '400' as const, color: '#6B7280' },
  label: { fontSize: 11, fontWeight: '500' as const, letterSpacing: 0.5 },
  tiny: { fontSize: 10, fontWeight: '400' as const },

  // Logo type treatment
  logo: {
    fontSize: 18,
    fontWeight: '600' as const,
    letterSpacing: -0.5,
  },
} as const;
