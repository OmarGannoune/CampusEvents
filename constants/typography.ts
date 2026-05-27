export const Typography = {
  // Sizes
  display: { fontSize: 24, fontWeight: '500' as const, letterSpacing: -0.5 },
  title: { fontSize: 20, fontWeight: '500' as const },
  sectionTitle: { fontSize: 16, fontWeight: '500' as const },
  body: { fontSize: 15, fontWeight: '400' as const, lineHeight: 24 },
  caption: { fontSize: 13, fontWeight: '400' as const, color: '#6B7280' },
  label: { fontSize: 12, fontWeight: '500' as const, letterSpacing: 0.5 },
  tiny: { fontSize: 11, fontWeight: '400' as const },

  // Logo type treatment
  logo: {
    fontSize: 20,
    fontWeight: '600' as const,
    letterSpacing: -0.5,
  },
} as const;
