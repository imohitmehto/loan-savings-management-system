/**
 * Calculates age in years from a date string.
 */
export default function calculateAge(dob: string | undefined): number | null {
  if (!dob) return null;
  const dobDate = new Date(dob);
  if (isNaN(dobDate.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - dobDate.getFullYear();
  const monthDiff = today.getMonth() - dobDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < dobDate.getDate())
  ) {
    age--;
  }
  return age >= 0 ? age : null;
}
