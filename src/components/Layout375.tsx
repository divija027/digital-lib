'use client'

import { Button } from "@relume_io/relume-ui";
import type { ButtonProps } from "@relume_io/relume-ui";
import { RxChevronRight } from "react-icons/rx";
import { useRouter } from "next/navigation";

type ImageProps = {
  src: string;
  alt?: string;
};

type CardBaseProps = {
  tagline: string;
  image: ImageProps;
  heading: string;
  description: string;
};

type CardsSmallProps = CardBaseProps & {
  button: ButtonProps;
};

type CardBigProps = CardBaseProps & {
  buttons: ButtonProps[];
};

type Props = {
  tagline: string;
  heading: string;
  description: string;
  cardsSmall: CardsSmallProps[];
  cardBig: CardBigProps;
};

export type Layout375Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>;

export const Layout375 = (props: Layout375Props) => {
  const { tagline, heading, description, cardsSmall, cardBig } = {
    ...Layout375Defaults,
    ...props,
  };
  const router = useRouter();

  const handleCardClick = () => {
    router.push('/quiz');
  };

  return (
    <section id="relume" className="px-[5%] py-12 md:py-16 lg:py-20 bg-gray-50">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-8 md:mb-12 lg:mb-16">
          <div className="mx-auto max-w-3xl text-center px-4">
            <p className="mb-2 md:mb-3 font-semibold text-sm md:text-base text-blue-600">{tagline}</p>
            <h2 className="mb-4 md:mb-5 text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight">
              {heading}
            </h2>
            <p className="text-base md:text-lg text-gray-600">{description}</p>
          </div>
        </div>
        <div className="flex justify-center px-4 md:px-0">
          <div className="grid grid-cols-1 gap-4 md:gap-6 lg:gap-8 w-full max-w-7xl">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-4 lg:gap-8">
              {cardsSmall.map((card, index) => (
                <div key={index} className="flex flex-col border border-gray-200 w-full rounded-lg md:rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
                  <div className="flex items-center justify-center overflow-hidden">
                    <img src={card.image.src} alt={card.image.alt} className="w-full h-40 md:h-48 object-cover" />
                  </div>
                  <div className="flex flex-col justify-center p-4 md:p-6 bg-white flex-grow">
                    <div className="flex-grow">
                      <p className="mb-1 md:mb-2 text-xs md:text-sm font-semibold text-blue-600">{card.tagline}</p>
                      <h3 className="mb-2 text-lg md:text-xl lg:text-2xl font-bold">{card.heading}</h3>
                      <p className="text-sm md:text-base text-gray-600 line-clamp-2">{card.description}</p>
                    </div>
                    <div className="mt-4 md:mt-5 lg:mt-6">
                      <Button 
                        {...card.button}
                        className="text-sm md:text-base w-full sm:w-auto"
                        onClick={handleCardClick}
                      >
                        {card.button.title}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex flex-col border border-gray-200 sm:col-span-2 sm:col-start-1 sm:row-span-2 sm:row-start-3 lg:col-span-2 lg:col-start-3 lg:row-span-2 lg:row-start-1 rounded-lg md:rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer">
                <div className="flex items-center justify-center overflow-hidden">
                  <img
                    src={cardBig.image.src}
                    alt={cardBig.image.alt}
                    className="w-full h-48 sm:h-56 md:h-64 lg:h-80 object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-center p-4 md:p-6 lg:p-8 xl:p-12 bg-white">
                  <div className="flex-grow">
                    <p className="mb-2 text-xs md:text-sm font-semibold text-purple-600">{cardBig.tagline}</p>
                    <h3 className="mb-3 md:mb-4 lg:mb-5 text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold leading-tight">
                      {cardBig.heading}
                    </h3>
                    <p className="text-sm md:text-base lg:text-lg text-gray-600">{cardBig.description}</p>
                  </div>
                  <div className="mt-4 md:mt-6 lg:mt-8 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 md:gap-4">
                    {cardBig.buttons.map((button, index) => (
                      <Button 
                        key={index} 
                        {...button}
                        className="text-sm md:text-base w-full sm:w-auto"
                        onClick={handleCardClick}
                      >
                        {button.title}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export const Layout375Defaults: Props = {
  tagline: "Technical Assessment Prep",
  heading: "Master MCQ Tests",
  description: "Practice with real company questions from top tech giants. Build confidence for your dream job interviews.",
  cardsSmall: [
    {
      tagline: "Core Subjects",
      image: {
        src: "/quiz1.jpg",
        alt: "Data Structures & Algorithms Quiz",
      },
      heading: "Data Structures",
      description: "Master fundamental DSA concepts with comprehensive MCQ practice tests.",
      button: {
        title: "Practice Now",
        variant: "link",
        size: "link",
        iconRight: <RxChevronRight />,
      },
    },
    {
      tagline: "Programming",
      image: {
        src: "/quiz2.jpg",
        alt: "Object Oriented Programming Quiz",
      },
      heading: "OOP Concepts",
      description: "Test your object-oriented programming knowledge with targeted questions.",
      button: {
        title: "Start Quiz",
        variant: "link",
        size: "link",
        iconRight: <RxChevronRight />,
      },
    },
    {
      tagline: "Systems",
      image: {
        src: "/quiz3.jpg",
        alt: "Operating Systems Quiz",
      },
      heading: "Operating Systems",
      description: "Practice OS concepts, processes, memory management, and more.",
      button: {
        title: "Begin Test",
        variant: "link",
        size: "link",
        iconRight: <RxChevronRight />,
      },
    },
    {
      tagline: "Databases",
      image: {
        src: "/quiz4.jpg",
        alt: "Database Management Systems Quiz",
      },
      heading: "DBMS & SQL",
      description: "Strengthen your database knowledge with comprehensive MCQ assessments.",
      button: {
        title: "Try Now",
        variant: "link",
        size: "link",
        iconRight: <RxChevronRight />,
      },
    },
  ],
  cardBig: {
    tagline: "Featured Assessment",
    image: {
      src: "/quiz1.jpg",
      alt: "Full Stack Development Mock Interview",
    },
    heading: "Full Stack Mock Interview",
    description:
      "Take our comprehensive full-stack development assessment covering frontend, backend, databases, and system design. Perfect for placement preparation.",
    buttons: [
      { title: "Start Assessment", variant: "secondary" },
      {
        title: "View Details",
        variant: "link",
        size: "link",
        iconRight: <RxChevronRight />,
      },
    ],
  },
};
