"use client";

import { Button, useMediaQuery } from "@relume_io/relume-ui";
import type { ButtonProps } from "@relume_io/relume-ui";
import { MotionValue, useMotionValue, motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { RxChevronRight } from "react-icons/rx";
import clsx from "clsx";
import React from "react";

type ImageProps = {
  src: string;
  alt?: string;
};

type FeatureSectionProps = {
  tagline: string;
  heading: string;
  description: string;
  buttons: ButtonProps[];
  image: ImageProps;
};

type Props = {
  tagline: string;
  heading: string;
  description: string;
  featureSections: FeatureSectionProps[];
};

export type Layout409Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

const calculateScales = (totalSections: number, scrollYProgress: MotionValue<number>) => {
  return Array.from({ length: totalSections }, (_, index) => {
    const sectionFraction = 1 / totalSections;
    const start = sectionFraction * index;
    const end = sectionFraction * (index + 1);

    return index < totalSections - 1
      ? useTransform(scrollYProgress, [start, end], [1, 0.8])
      : useMotionValue(1);
  });
};

export const Layout409 = (props: Layout409Props) => {
  const { tagline, heading, description, featureSections } = {
    ...Layout409Defaults,
    ...props,
  };

  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end 60%"],
  });

  const scales = calculateScales(featureSections.length, scrollYProgress);

  return (
    <section id="relume" className="px-[5%] py-16 md:py-24 lg:py-28">
      <div className="container mx-auto max-w-7xl">
        <div className="mx-auto mb-12 w-full max-w-lg text-center md:mb-18 lg:mb-20">
          <p className="mb-3 font-semibold md:mb-4">{tagline}</p>
          <h1 className="mb-5 text-5xl font-bold md:mb-6 md:text-7xl lg:text-8xl">{heading}</h1>
          <p className="md:text-md">{description}</p>
        </div>
        <div ref={containerRef} className="sticky top-0 grid grid-cols-1 gap-6 md:gap-0">
          {featureSections.map((featureSection, index) => (
            <FeatureSection key={index} {...featureSection} scale={scales[index]} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

const FeatureSection = ({
  scale,
  index,
  ...featureSection
}: FeatureSectionProps & {
  scale: MotionValue<number>;
  index: number;
}) => {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const isEven = index % 2 === 0;

  return (
    <React.Fragment>
      {isMobile ? (
        <div className="static grid grid-cols-1 content-center overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg">
          <FeatureSectionContent isEven={isEven} {...featureSection} />
        </div>
      ) : (
        <motion.div
          className="static grid grid-cols-1 content-center overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl md:sticky md:top-[10%] md:mb-[10vh] md:h-[80vh] md:grid-cols-2"
          style={{ scale }}
        >
          <FeatureSectionContent isEven={isEven} {...featureSection} />
        </motion.div>
      )}
    </React.Fragment>
  );
};

const FeatureSectionContent = ({
  isEven,
  ...featureSection
}: FeatureSectionProps & { isEven: boolean }) => (
  <React.Fragment>
    <div
      className={clsx(
        "order-first flex flex-col justify-center p-6 md:p-8 lg:p-12",
        isEven ? "md:order-first" : "md:order-last",
      )}
    >
      <p className="mb-2 font-semibold">{featureSection.tagline}</p>
      <h2 className="rb-5 mb-5 text-4xl font-bold leading-[1.2] md:mb-6 md:text-5xl lg:text-6xl">
        {featureSection.heading}
      </h2>
      <p>{featureSection.description}</p>
      <div className="mt-6 flex items-center gap-x-4 md:mt-8">
        {featureSection.buttons.map((button, index) => (
          <Button key={index} {...button}>
            {button.title}
          </Button>
        ))}
      </div>
    </div>
    <div
      className={clsx(
        "order-last flex flex-col items-center justify-center p-6 md:p-8",
        isEven ? "md:order-last" : "md:order-first",
      )}
    >
      <img 
        src={featureSection.image.src} 
        alt={featureSection.image.alt}
        className="w-full h-full object-cover rounded-lg shadow-lg"
      />
    </div>
  </React.Fragment>
);

export const Layout409Defaults: Props = {
  tagline: "Why Choose BrainReef",
  heading: "Your Success Partner",
  description: "Everything you need to excel in your VTU academic journey and beyond.",
  featureSections: [
    {
      tagline: "Comprehensive Resources",
      heading: "Complete Study Materials at Your Fingertips",
      description:
        "Access thousands of curated study materials, notes, and previous year question papers. Everything organized by branch, semester, and subject for easy navigation.",
      buttons: [
        { title: "Explore Resources", variant: "secondary" },
        {
          title: "Learn More",
          variant: "link",
          size: "link",
          iconRight: <RxChevronRight />,
        },
      ],
      image: {
        src: "/choosesec1.jpg",
        alt: "Study materials and resources",
      },
    },
    {
      tagline: "Smart Practice",
      heading: "Master Concepts with MCQ Tests",
      description:
        "Practice with real company interview questions and technical assessments. Track your progress with instant feedback and detailed explanations for every question.",
      buttons: [
        { title: "Start Practice", variant: "secondary" },
        {
          title: "View Tests",
          variant: "link",
          size: "link",
          iconRight: <RxChevronRight />,
        },
      ],
      image: {
        src: "/choosesec2.jpg",
        alt: "MCQ practice tests",
      },
    },
    {
      tagline: "Community Learning",
      heading: "Learn Together, Grow Together",
      description:
        "Join thousands of VTU students in our vibrant community. Share knowledge, discuss concepts, and stay motivated with fellow learners on the same journey.",
      buttons: [
        { title: "Join Community", variant: "secondary" },
        {
          title: "Explore",
          variant: "link",
          size: "link",
          iconRight: <RxChevronRight />,
        },
      ],
      image: {
        src: "/choosesec3.jpg",
        alt: "Student community",
      },
    },
    {
      tagline: "Always Free",
      heading: "Quality Education for Everyone",
      description:
        "We believe education should be accessible to all. That's why BrainReef is and will always be 100% free. No hidden costs, no premium features, just quality learning resources for every VTU student.",
      buttons: [
        { title: "Get Started Free", variant: "secondary" },
        {
          title: "Our Mission",
          variant: "link",
          size: "link",
          iconRight: <RxChevronRight />,
        },
      ],
      image: {
        src: "/choosesec4.jpg",
        alt: "Free education for all",
      },
    },
  ],
};
