/**
 * Shared UI theme tokens for palette, typography, and motion.
 * Milestone 2.5 will extend these values as bespoke art lands.
 */

const basePalette = {
  background: '#0A2239',
  backgroundAlt: '#071629',
  backgroundMuted: '#0F4C75',
  backgroundOverlay: '#091540',
  frame: '#1F1F3B',
  headerAccent: '#7FDBFF',
  headerOutline: '#001F3F',
  personaAccent: '#FFE45E',
  personaSupport: '#F5EE9E',
  optionBase: '#1B98E0',
  optionHover: '#56CCF2',
  optionText: '#041C32',
  optionFocus: '#FFE45E',
  textPrimary: '#FFFFFF',
  textMuted: '#B8E1FF',
  textOverlay: '#E9F1F7',
  promptOutline: '#000000',
  achievementActive: '#FFD166',
  achievementFresh: '#65FFDA',
  achievementPulse: '#4CC9F0',
  achievementBadgeBg: '#F7B801',
  scoreboardText: '#FFFFFF',
  scoreboardAccent: '#4CE0D2',
  scoreboardHeading: '#D8F3FF',
  scoreboardOutline: '#001F3F',
  stubBg: '#0D1E30',
  stubText: '#D8F3FF',
  stubAccent: '#FFE45E',
  stubCollapsedBg: '#091540',
  stubCollapsedBorder: '#001F3F',
  stubCollapsedText: '#D8F3FF',
  stubCollapsedAccent: '#4CE0D2',
  stubCollapsedInactive: '#7A8BA3',
  focusOutline: '#FFE45E',
};

const highContrastPalette = {
  background: '#000000',
  backgroundAlt: '#000000',
  backgroundMuted: '#FFFFFF',
  backgroundOverlay: '#000000',
  frame: '#FFFFFF',
  headerAccent: '#FFD166',
  headerOutline: '#000000',
  personaAccent: '#FFD166',
  personaSupport: '#FFFFFF',
  optionBase: '#CCCCCC',
  optionHover: '#FFFFFF',
  optionText: '#000000',
  optionFocus: '#FFD166',
  textPrimary: '#FFFFFF',
  textMuted: '#FFFFFF',
  textOverlay: '#FFFFFF',
  promptOutline: '#000000',
  achievementActive: '#FFD166',
  achievementFresh: '#FFD166',
  achievementPulse: '#F7B801',
  achievementBadgeBg: '#FFD166',
  scoreboardText: '#FFFFFF',
  scoreboardAccent: '#FFFFFF',
  scoreboardHeading: '#FFFFFF',
  scoreboardOutline: '#000000',
  stubBg: '#000000',
  stubText: '#FFFFFF',
  stubAccent: '#FFD166',
  stubCollapsedBg: '#000000',
  stubCollapsedBorder: '#000000',
  stubCollapsedText: '#FFFFFF',
  stubCollapsedAccent: '#FFFFFF',
  stubCollapsedInactive: '#CCCCCC',
  focusOutline: '#FFD166',
};

export function getPalette(highContrast = false) {
  return highContrast ? highContrastPalette : basePalette;
}

export const motion = {
  hover: 0.18,
  callPulse: 0.5,
  empathyPulse: 0.6,
  achievementPulse: 0.8,
};

export const typography = {
  baseSize: 16,
  scale: {
    small: 0.85,
    default: 1,
    large: 1.25,
    xlarge: 1.5,
  },
};

export const notes = {
  contrast: 'Palette values target ≥4.5:1 contrast ratios where text is involved.',
  motion: 'Durations align with docs/art/ui-style-guide.md; tweak here as animations evolve.',
};
