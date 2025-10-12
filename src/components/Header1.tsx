'use client'

import { Button } from "@relume_io/relume-ui";
import type { ButtonProps } from "@relume_io/relume-ui";
import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

type ImageProps = {
  src: string;
  alt?: string;
};

type Props = {
  heading: string;
  description: string;
  buttons: ButtonProps[];
  authenticatedButtons: ButtonProps[];
  image: ImageProps;
};

export type Header1Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Header1 = (props: Header1Props) => {
  const { heading, description, buttons, authenticatedButtons, image } = {
    ...Header1Defaults,
    ...props,
  };
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  // Use authenticated buttons if logged in, otherwise use default buttons
  const displayButtons = isAuthenticated ? authenticatedButtons : buttons;

  const handleButtonClick = (index: number) => {
    if (isAuthenticated) {
      // Authenticated user buttons
      if (index === 0) {
        // Go to Dashboard
        router.push('/dashboard');
      } else if (index === 1) {
        // Practice Quiz
        router.push('/quiz');
      }
    } else {
      // Non-authenticated user buttons
      if (index === 0) {
        // Start Learning Free
        router.push('/register');
      } else if (index === 1) {
        // Explore Resources
        router.push('/dashboard');
      }
    }
  };

  return (
    <section id="relume" className="px-[5%] py-12 md:py-16 lg:py-20">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 gap-x-12 gap-y-8 md:gap-x-16 md:gap-y-12 lg:grid-cols-2 lg:items-center justify-items-center">
          <div className="text-center lg:text-left w-full px-4 md:px-0">
            <h1 className="mb-4 text-4xl font-bold leading-tight md:mb-6 md:text-6xl lg:text-7xl xl:text-8xl">
              {heading}
            </h1>
            <p className="text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed">
              {description}
            </p>
            <div className="mt-6 flex flex-col sm:flex-row flex-wrap gap-3 md:gap-4 md:mt-8 justify-center lg:justify-start">
              {displayButtons.map((button, index) => (
                <Button 
                  key={index} 
                  {...button}
                  className="w-full sm:w-auto px-6 py-3 text-sm md:text-base"
                  onClick={() => handleButtonClick(index)}
                >
                  {button.title}
                </Button>
              ))}
            </div>
          </div>
          <div className="w-full flex justify-center px-4 md:px-0">
            <div className="relative w-full max-w-xl lg:max-w-2xl">
              {/* Decorative background blur */}
              <div className="absolute -inset-2 md:-inset-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl md:rounded-3xl blur-xl md:blur-2xl opacity-20"></div>
              
              {/* Main image with professional styling */}
              <div className="relative">
                <img 
                  src={image.src} 
                  className="w-full h-auto object-cover rounded-xl md:rounded-2xl shadow-xl md:shadow-2xl ring-1 ring-gray-200/50 hover:scale-[1.02] transition-transform duration-500" 
                  alt={image.alt} 
                />
                
                {/* Subtle gradient overlay for depth */}
                <div className="absolute inset-0 rounded-xl md:rounded-2xl bg-gradient-to-tr from-blue-600/5 to-purple-600/5 pointer-events-none"></div>
              </div>
              
              {/* Floating accent elements - hidden on mobile */}
              <div className="hidden md:block absolute -top-4 -right-4 w-20 h-20 lg:w-24 lg:h-24 bg-blue-500 rounded-full blur-3xl opacity-30 animate-pulse"></div>
              <div className="hidden md:block absolute -bottom-4 -left-4 w-24 h-24 lg:w-32 lg:h-32 bg-purple-500 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const Header1Defaults: Props = {
  heading: "Dive into Knowledge, Rise with Skills",
  description:
    "Your one-stop student hub for MCQs, study notes, and past papers. Access VTU resources, practice time-bound quizzes, and track your progress—all tailored to your semester and branch.",
  buttons: [
    { title: "Start Learning Free", variant: "primary" },
    { title: "Explore Resources", variant: "secondary" },
  ],
  authenticatedButtons: [
    { title: "Go to Dashboard", variant: "primary" },
    { title: "Practice Quiz", variant: "secondary" },
  ],
  image: {
    src: "/female-employee-with-black-laptop-having-video-call-having-fun 2.jpg",
    alt: "Student studying with laptop",
  },
};
