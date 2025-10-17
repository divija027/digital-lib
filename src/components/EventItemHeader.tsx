'use client'

import * as React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { DateTime, Duration } from "luxon"

type ImageProps = {
  src: string
  alt?: string
}

type BreadcrumbProps = {
  url: string
  title: string
}

type DateInfo = {
  weekday: string
  day: string
  month: string
  year: string | null
}

type CountdownValues = {
  days: string
  hours: string
  minutes: string
  seconds: string
}

type CountdownProps = {
  countdownIsoDate: string
  className?: string
  cellClassName?: string
  dividerClassName?: string
}

type Props = {
  breadcrumbs: BreadcrumbProps[]
  heading: string
  description: string
  image: ImageProps
  buttons?: Array<{
    title: string
    variant?: "default" | "secondary" | "outline" | "ghost" | "link"
    onClick?: () => void
    href?: string
  }>
  date: DateInfo
  location: string
  type: string
  animationStep?: number
  countdownIsoDate?: string
}

export type EventItemHeaderProps = React.ComponentPropsWithoutRef<"section"> & Partial<Props>

export const EventItemHeader = (props: EventItemHeaderProps) => {
  const { breadcrumbs, heading, description, image, buttons, date, location, type, animationStep = 5, countdownIsoDate, className } = {
    ...EventItemHeaderDefaults,
    ...props,
  }

  return (
    <section className={cn("relative px-[5%] py-16 md:py-24 lg:py-28", className)}>
      <div className="container relative z-10">
        <div className="grid grid-cols-1 items-start gap-12 text-white md:grid-cols-[1.5fr_1fr] lg:gap-20">
          {/* Left Column - Main Content */}
          <div className="flex flex-col items-start">
            {/* Breadcrumbs */}
            <nav 
              className={cn(
                "flex items-center text-sm text-white/80 mb-8 transition-all duration-700 ease-out",
                animationStep >= 1 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
            >
              {breadcrumbs.map((item, index) => (
                <React.Fragment key={index}>
                  <a 
                    href={item.url} 
                    className="hover:text-white transition-colors"
                  >
                    {item.title}
                  </a>
                  {index < breadcrumbs.length - 1 && (
                    <ChevronRight className="mx-2 h-4 w-4" />
                  )}
                </React.Fragment>
              ))}
            </nav>

            {/* Heading */}
            <h1 
              className={cn(
                "text-5xl font-bold md:text-7xl lg:text-8xl transition-all duration-700 ease-out",
                animationStep >= 2 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
            >
              {heading}
            </h1>

            {/* Description */}
            <p 
              className={cn(
                "mt-5 text-base md:mt-6 md:text-md text-white/90 transition-all duration-700 ease-out",
                animationStep >= 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
            >
              {description}
            </p>

            {/* Action Buttons */}
            {buttons && buttons.length > 0 && (
              <div 
                className={cn(
                  "mt-6 flex flex-wrap items-center gap-4 md:mt-8 transition-all duration-700 ease-out",
                  animationStep >= 5 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                )}
              >
                {buttons.map((button, index) => (
                  <Button 
                    key={index} 
                    variant={button.variant || "default"}
                    size="lg"
                    onClick={button.onClick}
                    asChild={!!button.href}
                  >
                    {button.href ? (
                      <a href={button.href}>{button.title}</a>
                    ) : (
                      button.title
                    )}
                  </Button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column - Event Details & Countdown */}
          <div 
            className={cn(
              "flex flex-col gap-16 transition-all duration-700 ease-out",
              animationStep >= 4 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            {/* Event Details Grid */}
            <div className="grid grid-cols-2 gap-8">
              {/* Date */}
              <div>
                <h6 className="mb-2 text-md font-bold leading-[1.4] md:text-xl">
                  Date
                </h6>
                <p className="text-white/90">
                  {date.weekday} {date.day} {date.month} {date.year}
                </p>
              </div>

              {/* Location */}
              <div>
                <h6 className="mb-2 text-md font-bold leading-[1.4] md:text-xl">
                  Location
                </h6>
                <p className="text-white/90">{location}</p>
              </div>

              {/* Type */}
              <div>
                <h6 className="mb-2 text-md font-bold leading-[1.4] md:text-xl">
                  Type
                </h6>
                <p className="text-white/90">{type}</p>
              </div>
            </div>

            {/* Countdown Timer */}
            {countdownIsoDate && (
              <div className="w-full">
                <Countdown 
                  countdownIsoDate={countdownIsoDate} 
                  className="w-full" 
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={image.src} 
          className="size-full object-cover" 
          alt={image.alt} 
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>
    </section>
  )
}

const Countdown: React.FC<CountdownProps> = ({
  countdownIsoDate,
  className,
  cellClassName,
  dividerClassName,
}) => {
  const [countdown, setCountdown] = useState<CountdownValues>({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  })

  useEffect(() => {
    const targetDate = DateTime.fromISO(countdownIsoDate)

    const updateCountdown = () => {
      const now = DateTime.now()
      const diff = targetDate.diff(now)

      if (diff.milliseconds <= 0) {
        setCountdown({ days: "00", hours: "00", minutes: "00", seconds: "00" })
        return
      }

      const duration = Duration.fromObject(diff.toObject()).shiftTo(
        "days",
        "hours",
        "minutes",
        "seconds",
      )

      const padZero = (num: number): string => {
        return num < 10 ? `0${num}` : num.toString()
      }

      setCountdown({
        days: padZero(Math.floor(duration.days)),
        hours: padZero(Math.floor(duration.hours)),
        minutes: padZero(Math.floor(duration.minutes)),
        seconds: padZero(Math.floor(duration.seconds)),
      })
    }

    updateCountdown()
    const intervalId = setInterval(updateCountdown, 1000)

    return () => clearInterval(intervalId)
  }, [countdownIsoDate])

  const renderCell = (value: string, label: string) => (
    <div className={cn("flex min-w-18 flex-col items-center", cellClassName)}>
      <span className="text-4xl font-bold leading-[1.2] md:text-5xl lg:text-6xl text-white">{value}</span>
      <span className="text-white/80">{label}</span>
    </div>
  )

  const renderDivider = () => (
    <div
      className={cn("hidden w-px bg-white/20 sm:block", dividerClassName)}
    />
  )

  return (
    <div
      className={cn(
        "flex flex-wrap justify-center gap-4 border border-white/30 px-4 py-4 sm:flex-nowrap sm:px-6 bg-white/10 backdrop-blur-sm",
        className,
      )}
    >
      {renderCell(countdown.days, "Days")}
      {renderDivider()}
      {renderCell(countdown.hours, "Hours")}
      {renderDivider()}
      {renderCell(countdown.minutes, "Mins")}
      {renderDivider()}
      {renderCell(countdown.seconds, "Secs")}
    </div>
  )
}

export const EventItemHeaderDefaults: Props = {
  breadcrumbs: [
    { url: "/events", title: "Events" },
    { url: "#", title: "Event title" },
  ],
  heading: "Event title heading",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
  image: {
    src: "https://d22po4pjz3o32e.cloudfront.net/placeholder-image.svg",
    alt: "Event cover image",
  },
  buttons: [
    { title: "Save my spot", variant: "default" },
    { title: "View event", variant: "secondary" }
  ],
  date: {
    weekday: "Sat",
    day: "10",
    month: "Feb",
    year: "2024",
  },
  location: "Sydney, Australia",
  type: "In-person",
  countdownIsoDate: "2025-12-31T23:59:59.000+00:00",
}
