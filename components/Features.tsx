"use client";

import { Shield, CheckCircle2, Clock } from "lucide-react";

const Features = () => {
  return (
    <section className="w-full py-20 bg-white">
      <div className="container mx-auto px-6 text-center">
        {/* Heading */}
        <h2 className="text-3xl font-bold mb-4 text-gray-900">
          Why Choose RailBuddy?
        </h2>
        <p className="text-lg text-gray-600 mb-12">
          Experience the best in railway booking and travel
        </p>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Easy Booking */}
          <div className="bg-white rounded-xl shadow-md p-8 border hover:shadow-lg transition">
            <CheckCircle2 className="text-green-600 w-12 h-12 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-gray-900">
              Easy Booking
            </h3>
            <p className="text-gray-600">
              Simple and intuitive booking process with instant confirmation.
            </p>
          </div>

          {/* Secure Payment */}
          <div className="bg-white rounded-xl shadow-md p-8 border hover:shadow-lg transition">
            <Shield className="text-blue-600 w-12 h-12 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-gray-900">
              Secure Payment
            </h3>
            <p className="text-gray-600">
              Your payments are protected with bank-level security.
            </p>
          </div>

          {/* Instant Confirmation */}
          <div className="bg-white rounded-xl shadow-md p-8 border hover:shadow-lg transition">
            <Clock className="text-purple-600 w-12 h-12 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-gray-900">
              Instant Confirmation
            </h3>
            <p className="text-gray-600">
              Get your tickets immediately after successful payment.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
