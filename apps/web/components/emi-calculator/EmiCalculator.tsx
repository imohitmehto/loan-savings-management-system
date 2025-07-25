'use client';

import React, { useState } from 'react';
import { EmiFormData } from '@/types/EmiFormData';
import { calculateEmi } from '@/lib/api/calculateEmi';
import { isValidForm } from '@/utils/validators/emiValidators';

const defaultForm: EmiFormData = {
  amount: 0,
  interestRate: 0,
  interestFrequency: 'MONTH',
  interestType: 'FIXED',
  term: 12,
  termPeriod: 'MONTH',
  firstPaymentDate: '',
  latePaymentPenalty: 0,
};

export const EmiCalculator: React.FC = () => {
  const [form, setForm] = useState<EmiFormData>(defaultForm);
  const [emi, setEmi] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Update form field
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: name === 'amount' ||
              name === 'interestRate' ||
              name === 'term' ||
              name === 'latePaymentPenalty'
        ? Number(value)
        : value,
    }));
  };

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setEmi(null);

    // Basic validation
    if (!isValidForm(form)) {
      setError('Please fill in all fields correctly.');
      setLoading(false);
      return;
    }

    try {
      const result = await calculateEmi(form);
      setEmi(result);
    } catch (err: any) {
      setError(err.message || 'Error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl p-6 mx-auto mt-8 border rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Loan EMI Calculator</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Amount */}
        <input
          type="number"
          name="amount"
          value={form.amount}
          onChange={handleChange}
          placeholder="Apply Amount (₹)"
          className="w-full px-3 py-2 border rounded"
          required
        />

        {/* Interest Rate */}
        <input
          type="number"
          name="interestRate"
          value={form.interestRate}
          onChange={handleChange}
          placeholder="Interest Rate (%)"
          className="w-full px-3 py-2 border rounded"
          required
        />

        {/* Interest Frequency */}
        <select
          name="interestFrequency"
          value={form.interestFrequency}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
          required
        >
          <option value="WEEK">Per Week</option>
          <option value="MONTH">Per Month</option>
          <option value="YEAR">Per Year</option>
        </select>

        {/* Interest Type */}
        <select
          name="interestType"
          value={form.interestType}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
          required
        >
          <option value="FLAT">Flat Rate</option>
          <option value="FIXED">Fixed Rate</option>
          <option value="MORTGAGE">Mortgage Amortization</option>
          <option value="REDUCING">Reducing Amount</option>
          <option value="ONE_TIME">One-Time Payment</option>
        </select>

        {/* Term */}
        <input
          type="number"
          name="term"
          value={form.term}
          onChange={handleChange}
          placeholder="Term"
          className="w-full px-3 py-2 border rounded"
          required
        />

        {/* Term Period */}
        <select
          name="termPeriod"
          value={form.termPeriod}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
          required
        >
          <option value="DAY">Per Day</option>
          <option value="WEEK">Per Week</option>
          <option value="MONTH">Per Month</option>
          <option value="YEAR">Per Year</option>
        </select>

        {/* First Payment Date */}
        <input
          type="date"
          name="firstPaymentDate"
          value={form.firstPaymentDate}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
          required
        />

        {/* Late Payment Penalty */}
        <input
          type="number"
          name="latePaymentPenalty"
          value={form.latePaymentPenalty}
          onChange={handleChange}
          placeholder="Late Payment Penalty (%)"
          className="w-full px-3 py-2 border rounded"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {loading ? 'Calculating...' : 'Calculate EMI'}
        </button>
      </form>

      {/* Result Display */}
      {emi !== null && (
        <div className="mt-4 text-green-700 font-medium">
          Your EMI: ₹{emi.toFixed(2)}
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mt-4 text-red-600">
          {error}
        </div>
      )}
    </div>
  );
};