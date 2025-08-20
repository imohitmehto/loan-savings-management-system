export enum OccupationType {
  BUSINESS = "BUSINESS",
  JOB = "JOB",
  SELF_EMPLOYED = "SELF_EMPLOYED",
  STUDENT = "STUDENT",
  UNEMPLOYED = "UNEMPLOYED",
}

export const OccupationOptions = [
  { value: "", label: "Select Occupation" },
  ...Object.values(OccupationType).map((o) => ({
    value: o,
    label: o
      .replace(/_/g, " ") // ✅ replace underscores with spaces
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase()), // capitalize each word
  })),
];
