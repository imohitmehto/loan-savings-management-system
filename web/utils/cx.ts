/**
 * Utility to combine conditional class names
 */
export default function cx(...classes: (string | false | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}
