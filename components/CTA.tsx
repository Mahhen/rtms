"use client";

import { Button } from "@/components/ui/button";

const CTA = () => {
  return (
    <section className="w-full py-20 bg-gray-50">
      <div className="container mx-auto px-6 text-center">
        {/* Heading */}
        <h2 className="text-3xl font-bold mb-4 text-gray-900">
          Ready to Start Your Journey?
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          Join thousands of satisfied passengers who trust RailBuddy with their travel needs.
        </p>

        {/* CTA Button */}
        <Button className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 text-lg rounded-full shadow-md">
          Book Now
        </Button>
      </div>
    </section>
  );
};

export default CTA;
