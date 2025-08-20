import cx from "./cx";

export default function inputErrorClass(
  name: string,
  errors: Record<string, string>,
  baseClass: string,
) {
  return cx(
    errors[name]
      ? "border-rose-500 focus:ring-rose-100"
      : "border-slate-300 focus:ring-blue-300",
    baseClass,
  );
}
