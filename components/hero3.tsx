"use client";

import {Star} from "lucide-react";
import {HeroInput} from "@/components/hero-input";

interface Hero3Props {
  heading?: string;
  description?: string;
  buttons?: {
    primary?: { text: string; url: string };
    secondary?: { text: string; url: string };
  };
  reviews?: { count: number; rating?: number };
}

const Hero3 = ({
  heading = "Book Railway Tickets instantly with RailBuddy Today!",
  description = "Search trains, check real-time seat availability, book tickets securely, and manage your journeys — all in one streamlined platform.",
  buttons = {
    primary: { text: "Sign Up", url: "#" },
    secondary: { text: "Login", url: "#" },
  },
  reviews = { count: 200, rating: 5.0 },
}: Hero3Props) => {


  return (
    <section
      className="relative flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://res.cloudinary.com/dx0me99re/image/upload/v1755026464/train_sguwzu.jpg')",
      }}
    >
      {/* Overlay for better contrast */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center text-center text-white px-6 max-w-5xl">
        <h1 className="my-6 text-4xl font-bold lg:text-6xl xl:text-7xl">
          {heading}
        </h1>
        <p className="mb-8 max-w-2xl text-lg lg:text-xl">{description}</p>

        {/* Reviews */}
        <div className="flex items-center gap-2 mb-6">
          {[...Array(5)].map((_, index) => (
            <Star
              key={index}
              className="size-5 fill-yellow-400 text-yellow-400"
            />
          ))}
          <span className="ml-2 font-semibold">{reviews.rating?.toFixed(1)}</span>
          <p className="ml-2 text-sm text-gray-200">
            from {reviews.count}+ reviews
          </p>
        </div>

        {/* Tabs + Search Box */}
        <HeroInput />
      </div>
    </section>
  );
};

export { Hero3 };
