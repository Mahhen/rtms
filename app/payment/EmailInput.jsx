import React, { useState } from "react";
import { useStripe, useElements } from "@stripe/react-stripe-js";

const EmailInput = () => {
  const stripe = useStripe();
  const elements = useElements();

  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);

  const handleBlur = async () => {
    if (!stripe || !elements) return;

    try {
      // You can attach email to the PaymentIntent metadata
      // OR use it when confirming the payment
      // This example only logs it for now
      console.log("User email entered:", email);
    } catch (err) {
      setError(err);
    }
  };

  const handleChange = (e) => {
    setError(null);
    setEmail(e.target.value);
  };

  return (
    <div className="flex flex-col space-y-2">
      <label htmlFor="email" className="text-sm font-medium text-gray-700">
        Email
      </label>
      <input
        id="email"
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={handleChange}
        onBlur={handleBlur}
        className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {error && (
        <div className="text-red-600 text-sm">{error.message || error.toString()}</div>
      )}
    </div>
  );
};

export default EmailInput;
