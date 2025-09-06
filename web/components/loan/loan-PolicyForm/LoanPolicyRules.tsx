"use client";

import TextField from "@/components/common/fields/TextField";

interface Props {
  rules: string[];
  errors: Record<string, string>;
  readOnly: boolean;
  handleRuleChange: (idx: number, value: string) => void;
  addRule: () => void;
  removeRule: (idx: number) => void;
}

export default function LoanPolicyRules({
  rules,
  errors,
  readOnly,
  handleRuleChange,
  addRule,
  removeRule,
}: Props) {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Policy Rules
      </label>
      <div className="space-y-2">
        {rules.map((rule, idx) => (
          <div key={idx} className="flex gap-1.5 w-full items-start">
            <div className="flex-1">
              <TextField
                label={`Rule ${idx + 1}`}
                id={`rule.${idx}`}
                name={`rule.${idx}`}
                value={rule}
                onChange={(e) => handleRuleChange(idx, e.target.value)}
                multiline
                rows={2}
                required
                error={errors[`rules.${idx}`]}
                disabled={readOnly}
                className="w-full"
              />
            </div>

            {!readOnly && rules.length > 1 && (
              <button
                type="button"
                onClick={() => removeRule(idx)}
                className="px-2 py-2 bg-red-500 text-white rounded hover:bg-red-600 self-start"
                style={{ height: "42px" }}
              >
                ×
              </button>
            )}
          </div>
        ))}
        {!readOnly && (
          <button
            type="button"
            onClick={addRule}
            className="mt-2 px-3 py-1 rounded bg-green-600 text-white hover:bg-green-700"
          >
            + Add Rule
          </button>
        )}
      </div>

      {errors.rules && (
        <p className="text-sm text-red-500 mt-1">{errors.rules}</p>
      )}
    </div>
  );
}
