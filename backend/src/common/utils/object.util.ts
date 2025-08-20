export function toPrismaUpdate<T extends object>(
  value: T,
): Record<string, any> {
  return Object.fromEntries(
    Object.entries(value).filter(
      ([, v]) => v !== undefined, // Only pass keys where value is not undefined
    ),
  );
}
