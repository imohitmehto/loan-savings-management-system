"use client";

import { useState, useCallback, ChangeEvent, FormEvent } from "react";
import { LoanPolicy } from "@/types/LoanPolicy";
import { LoanPolicyFormSchema } from "@/validators/LoanPolicyFormSchema";
import {
  FeeType,
  InterestType,
  TermPeriod,
} from "@/utils/enums/loan-policy-enum";
import { emptyForm } from "@/utils/empty_form/loanPolicy";

function isValidEnumValue<T>(enumObj: T, value: unknown): value is T[keyof T] {
  return Object.values(enumObj).includes(value as T[keyof T]);
}

export const useLoanPolicyForm = (
  initialValues?: Partial<LoanPolicy>,
  onSubmit?: (data: FormData) => Promise<void>,
) => {
  const mergedInitial: Partial<LoanPolicy> = {
    ...emptyForm,
    ...initialValues,
    description: initialValues?.description ?? null,
    rules:
      initialValues?.rules && initialValues.rules.length > 0
        ? initialValues.rules
        : [""],
  };

  const [form, setForm] = useState<Partial<LoanPolicy>>(mergedInitial);
  const [rules, setRules] = useState<string[]>(mergedInitial.rules ?? [""]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  /** -------- Input Change Handler -------- */
  const handleChange = useCallback(
    (
      e: ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >,
    ) => {
      const { name, value } = e.target;

      setForm((prev) => {
        // Number fields to parse as float
        const numberFields = [
          "interestRate",
          "minAmount",
          "maxAmount",
          "maxTerm",
          "processingFee",
          "applicationFee",
          "latePaymentPenalties",
        ];

        if (numberFields.includes(name)) {
          const parsed = parseFloat(value);
          return { ...prev, [name]: isNaN(parsed) ? 0 : parsed };
        }

        // Enum fields: validate and cast
        if (name === "interestType" && isValidEnumValue(InterestType, value)) {
          return { ...prev, interestType: value as InterestType };
        }

        if (name === "termPeriod" && isValidEnumValue(TermPeriod, value)) {
          return { ...prev, termPeriod: value as TermPeriod };
        }

        if (
          [
            "applicationFeeType",
            "processingFeeType",
            "latePaymentPenaltiesType",
          ].includes(name) &&
          isValidEnumValue(FeeType, value)
        ) {
          return { ...prev, [name]: value as FeeType };
        }

        // Default: string or nullable values
        return { ...prev, [name]: value };
      });

      // Clear error for this field on change
      if (errors[name]) {
        setErrors((prev) => {
          const { [name]: _, ...rest } = prev;
          return rest;
        });
      }
    },
    [errors],
  );

  /** -------- Numeric Change Handler -------- */
  const handleNumericChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let sanitized = value.replace(/[^0-9.]/g, "");
    sanitized = sanitized.replace(/(\..*)\./g, "$1");
    sanitized = sanitized.replace(/^(\d*\.\d{0,2}).*$/, "$1");

    setForm((prev) => ({
      ...prev,
      [name]: sanitized,
    }));

    if (errors[name]) {
      setErrors((prev) => {
        const { [name]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  /** -------- Rule Handlers -------- */
  const handleRuleChange = (idx: number, value: string) => {
    setRules((prev) => {
      const newRules = [...prev];
      newRules[idx] = value;
      return newRules;
    });

    const errorKey = `rules.${idx}`;
    if (errors[errorKey]) {
      setErrors((prev) => {
        const { [errorKey]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const addRule = () => setRules((prev) => [...prev, ""]);
  const removeRule = (idx: number) => {
    if (rules.length > 1) {
      setRules((prev) => prev.filter((_, i) => i !== idx));
    }
  };

  /** -------- Submit Handler -------- */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const cleanedRules = rules.map((rule) => rule.trim()).filter(Boolean);
      if (cleanedRules.length === 0) {
        setErrors((prev) => ({
          ...prev,
          rules: "At least one rule is required",
        }));
        const rulesErrorEl = document.getElementById("rules-error");
        if (rulesErrorEl) {
          rulesErrorEl.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        return;
      }

      // Compose parsed form with proper types
      const parsedForm: LoanPolicy = {
        ...(form as LoanPolicy),
        rules: cleanedRules,
        interestRate: Number(form.interestRate),
        minAmount: Number(form.minAmount),
        maxAmount: Number(form.maxAmount),
        maxTerm: Number(form.maxTerm),
        processingFee: Number(form.processingFee),
        applicationFee: Number(form.applicationFee),
        latePaymentPenalties: Number(form.latePaymentPenalties),
      };

      const result = LoanPolicyFormSchema.safeParse(parsedForm);
      if (!result.success) {
        const fieldErrors: Record<string, string> = {};
        result.error.errors.forEach((err) => {
          fieldErrors[err.path.join(".")] = err.message;
        });
        setErrors(fieldErrors);

        const firstErrorFieldId = result.error.errors[0].path
          .map(String)
          .join(".");

        let element: HTMLElement | null =
          document.getElementById(firstErrorFieldId);

        if (!element) {
          element = document.querySelector(`[name="${firstErrorFieldId}"]`);
        }

        if (element && "scrollIntoView" in element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
          (element as HTMLElement).focus();
        }
        return;
      }

      // Convert to FormData for submission
      const formData = new FormData();
      Object.entries(parsedForm).forEach(([key, value]) => {
        formData.append(
          key,
          typeof value === "object" ? JSON.stringify(value) : String(value),
        );
      });

      if (onSubmit) await onSubmit(formData);
    } catch (err) {
      console.error("Loan Policy submission failed:", err);
      setErrors((prev) => ({
        ...prev,
        form: "An unexpected error occurred. Please try again.",
      }));
    }
  };

  return {
    form,
    rules,
    errors,
    setForm,
    setErrors,
    handleChange,
    handleNumericChange,
    handleRuleChange,
    addRule,
    removeRule,
    handleSubmit,
  };
};
