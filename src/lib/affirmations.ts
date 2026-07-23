/**
 * Maps radar axis values to first-person affirmative statements.
 * Each axis has 3 tiers: low (0-33), mid (34-66), high (67-100).
 * The keys follow the pattern: profile.axis{N}{Low|Mid|High}
 *
 * Usage: getAffirmationKey(axisIndex, value) => i18n key
 */

/** Returns the i18n key for the affirmation matching a given axis value. */
export function getAffirmationKey(axisIndex: 0 | 1 | 2 | 3, value: number): string {
  const tier = value <= 33 ? "Low" : value <= 66 ? "Mid" : "High";
  return `profile.axis${axisIndex + 1}${tier}`;
}

/** Returns the default (center) affirmation for an axis. */
export function getDefaultAffirmationKey(axisIndex: 0 | 1 | 2 | 3): string {
  return `profile.axis${axisIndex + 1}Affirmation`;
}

/** Axis label keys for titles */
export const AFFIRMATION_AXIS_LABELS = [
  "orgOnboarding.axis1Label",
  "orgOnboarding.axis2Label",
  "orgOnboarding.axis3Label",
  "orgOnboarding.axis4Label",
] as const;

/** Icons per axis */
export const AFFIRMATION_ICONS = [
  "MessageSquare",
  "Target",
  "Eye",
  "SlidersHorizontal",
] as const;
