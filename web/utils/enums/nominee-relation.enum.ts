enum NomineeRelation {
  HUSBAND = "HUSBAND",
  WIFE = "WIFE",
  FATHER = "FATHER",
  MOTHER = "MOTHER",
  SON = "SON",
  DAUGHTER = "DAUGHTER",
  BROTHER = "BROTHER",
  SISTER = "SISTER",
  UNCLE = "UNCLE",
  AUNT = "AUNT",
  OTHER = "OTHER",
}

export const NomineeRelationOptions = [
  { value: "", label: "Select Relation" },
  ...Object.values(NomineeRelation).map((n) => ({
    value: n,
    label: n.charAt(0) + n.slice(1).toLowerCase(),
  })),
];
