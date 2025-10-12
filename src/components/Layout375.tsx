'use client'

import { useState, useEffect } from "react";
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
  mcqSetId?: string; // Track MCQ set ID for navigation
};

type CardsSmallProps = CardBaseProps & {
  button: ButtonProps;
};

type CardBigProps = CardBaseProps & {
  buttons: ButtonProps[];
};

export type Layout375Props = React.ComponentPropsWithoutRef<"section">;

export const Layout375 = (props: Layout375Props) => {
  const router = useRouter();
  const [mcqSets, setMcqSets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Section content
  const tagline = "Technical Assessment Prep";
  const heading = "Master MCQ Tests";
  const description = "Practice with real company questions from top tech giants. Build confidence for your dream job interviews.";

  // Fetch MCQ sets marked for home preview, ordered by position
  useEffect(() => {
    const fetchMCQSets = async () => {
      try {
        const response = await fetch('/api/mcq/sets?showInHomePreview=true&orderBy=homePreviewPosition');
        if (response.ok) {
          const data = await response.json();
          // Filter to only show sets with assigned positions
          const orderedSets = data.filter((set: any) => set.homePreviewPosition);
          setMcqSets(orderedSets);
        }
      } catch (error) {
        console.error('Failed to fetch MCQ sets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMCQSets();
  }, []);

  // Filter sets by position: 1-4 for small cards, 5 for big card
  const smallCardSets = mcqSets.filter(set => set.homePreviewPosition >= 1 && set.homePreviewPosition <= 4);
  const bigCardSet = mcqSets.find(set => set.homePreviewPosition === 5);

  // Map small card sets (positions 1-4)
  const cardsSmall: CardsSmallProps[] = smallCardSets.map(set => ({
    tagline: set.category || "MCQ Set",
    image: { src: set.bannerImage || '/quiz1.jpg', alt: set.title },
    heading: set.title,
    description: set.description,
    mcqSetId: set.id,
    button: {
      title: "Start Quiz",
      variant: "link" as const,
      size: "link" as const,
      iconRight: <RxChevronRight />,
    },
  }));

  // Map big card set (position 5)
  const cardBig: CardBigProps | null = bigCardSet ? {
    tagline: "Featured Assessment",
    image: { src: bigCardSet.bannerImage || '/quiz1.jpg', alt: bigCardSet.title },
    heading: bigCardSet.title,
    description: bigCardSet.description,
    mcqSetId: bigCardSet.id,
    buttons: [
      { title: "Start Assessment", variant: "secondary" as const },
      {
        title: "View Details",
        variant: "link" as const,
        size: "link" as const,
        iconRight: <RxChevronRight />,
      },
    ],
  } : null;

  const handleCardClick = (mcqSetId?: string) => {
    if (mcqSetId) {
      router.push(`/dashboard/quiz/practice/${mcqSetId}`);
    } else {
      router.push('/quiz');
    }
  };

  const handleViewAllClick = () => {
    router.push('/quiz');
  };

  return (
    <section id="relume" className="px-[5%] py-12 md:py-16 lg:py-20 bg-white">
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
        
        {loading ? (
          // Loading skeleton
          <div className="flex justify-center px-4 md:px-0">
            <div className="grid grid-cols-1 gap-4 md:gap-6 lg:gap-8 w-full max-w-7xl">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-4 lg:gap-8">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex flex-col border border-gray-200 rounded-lg md:rounded-xl overflow-hidden">
                    <div className="h-40 md:h-48 bg-gray-200 animate-pulse" />
                    <div className="p-4 md:p-6 space-y-3">
                      <div className="h-4 bg-gray-200 animate-pulse rounded w-1/3" />
                      <div className="h-6 bg-gray-200 animate-pulse rounded w-3/4" />
                      <div className="h-4 bg-gray-200 animate-pulse rounded w-full" />
                      <div className="h-4 bg-gray-200 animate-pulse rounded w-2/3" />
                    </div>
                  </div>
                ))}
                <div className="flex flex-col border border-gray-200 sm:col-span-2 sm:row-span-2 lg:col-span-2 lg:row-span-2 rounded-lg md:rounded-xl overflow-hidden">
                  <div className="h-48 sm:h-56 md:h-64 lg:h-80 bg-gray-200 animate-pulse" />
                  <div className="p-4 md:p-6 lg:p-8 space-y-4">
                    <div className="h-4 bg-gray-200 animate-pulse rounded w-1/4" />
                    <div className="h-8 bg-gray-200 animate-pulse rounded w-3/4" />
                    <div className="h-4 bg-gray-200 animate-pulse rounded w-full" />
                    <div className="h-4 bg-gray-200 animate-pulse rounded w-5/6" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : mcqSets.length === 0 ? (
          <div className="flex justify-center px-4 md:px-0">
            <p className="text-center text-gray-500 text-lg">No MCQ sets available at the moment. Check back soon!</p>
          </div>
        ) : (
          <div className="flex justify-center px-4 md:px-0">
            <div className="grid grid-cols-1 gap-4 md:gap-6 lg:gap-8 w-full max-w-7xl">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-4 lg:gap-8">
              {cardsSmall.map((card, index) => (
                <div 
                  key={index} 
                  className="flex flex-col border border-gray-200 w-full rounded-lg md:rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer"
                  onClick={() => handleCardClick(card.mcqSetId)}
                >
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
                        className="text-sm md:text-base w-full sm:w-auto pointer-events-none"
                      >
                        {card.button.title}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              {cardBig && (
                <div 
                  className="flex flex-col border border-gray-200 sm:col-span-2 sm:col-start-1 sm:row-span-2 sm:row-start-3 lg:col-span-2 lg:col-start-3 lg:row-span-2 lg:row-start-1 rounded-lg md:rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
                  onClick={() => handleCardClick(cardBig.mcqSetId)}
                >
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
                          className="text-sm md:text-base w-full sm:w-auto pointer-events-none"
                        >
                          {button.title}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        )}

        {/* View All MCQ Sets Button */}
        {!loading && (
          <div className="mt-12 md:mt-16 flex justify-center">
            <Button
              onClick={handleViewAllClick}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-6 text-base md:text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3 group"
              variant="secondary"
            >
              <span>View All MCQ Sets</span>
              <RxChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};
