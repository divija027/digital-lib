'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Instagram, Twitter, Linkedin, Youtube } from 'lucide-react'

type ImageProps = {
  url?: string
  src: string
  alt?: string
}

type Links = {
  title: string
  url: string
}

type ColumnLinks = {
  links: Links[]
}

type SocialMediaLinks = {
  url: string
  icon: React.ReactNode
}

type FooterLink = {
  title: string
  url: string
}

type Props = {
  logo: ImageProps
  columnLinks: ColumnLinks[]
  socialMediaLinks: SocialMediaLinks[]
  footerText: string
  footerLinks: FooterLink[]
}

export type Footer4Props = React.ComponentPropsWithoutRef<"section"> & Partial<Props>

export const Footer4 = (props: Footer4Props) => {
  const { logo, footerText, columnLinks, footerLinks, socialMediaLinks } = {
    ...Footer4Defaults,
    ...props,
  }
  
  return (
    <footer id="relume" className="px-[5%] py-12 md:py-18 lg:py-20 bg-white">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 items-center justify-center justify-items-center gap-x-[4vw] gap-y-12 pb-12 md:pb-18 lg:grid-cols-[0.25fr_1fr_0.25fr] lg:justify-between lg:gap-y-4 lg:pb-20">
          <Link href={logo.url || '#'} className="lg:justify-self-start">
            <img src={logo.src} alt={logo.alt} className="inline-block h-8" />
          </Link>
          {columnLinks.map((column, index) => (
            <ul
              key={index}
              className="grid grid-flow-row grid-cols-1 items-start justify-center justify-items-center gap-6 md:grid-flow-col md:grid-cols-[max-content] md:justify-center md:justify-items-start"
            >
              {column.links.map((link, linkIndex) => (
                <li key={linkIndex} className="font-semibold">
                  <Link href={link.url} className="hover:text-blue-600 transition-colors">
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          ))}
          <div className="flex items-start justify-start justify-items-center gap-x-3 lg:justify-self-end">
            {socialMediaLinks.map((link, index) => (
              <Link 
                key={index} 
                href={link.url}
                className="hover:opacity-70 transition-opacity"
              >
                {link.icon}
              </Link>
            ))}
          </div>
        </div>
        <div className="h-px w-full bg-black" />
        <div className="flex flex-col-reverse items-center justify-center justify-items-center pb-4 pt-6 text-sm md:flex-row md:gap-x-6 md:pb-0 md:pt-8">
          <p className="mt-8 md:mt-0 text-gray-600">{footerText}</p>
          <ul className="grid grid-flow-row grid-cols-[max-content] items-center justify-center justify-items-center gap-y-4 text-sm md:grid-flow-col md:gap-x-6 md:gap-y-0">
            {footerLinks.map((link, index) => (
              <li key={index} className="underline decoration-black underline-offset-1">
                <Link href={link.url} className="hover:text-blue-600 transition-colors">
                  {link.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}

export const Footer4Defaults: Props = {
  logo: {
    url: "/dashboard",
    src: "https://d22po4pjz3o32e.cloudfront.net/logo-image.svg",
    alt: "Brainreef Logo",
  },
  columnLinks: [
    {
      links: [
        { title: "Dashboard", url: "/dashboard" },
        { title: "Quizzes", url: "/quiz" },
        { title: "Blog", url: "/blog" },
        { title: "About Us", url: "#" },
        { title: "Contact", url: "#" },
      ],
    },
  ],
  socialMediaLinks: [
    { url: "#", icon: <Facebook className="w-6 h-6" /> },
    { url: "#", icon: <Instagram className="w-6 h-6" /> },
    { url: "#", icon: <Twitter className="w-6 h-6 p-0.5" /> },
    { url: "#", icon: <Linkedin className="w-6 h-6" /> },
    { url: "#", icon: <Youtube className="w-6 h-6" /> },
  ],
  footerText: "© 2025 Brainreef. All rights reserved.",
  footerLinks: [
    { title: "Privacy Policy", url: "#" },
    { title: "Terms of Service", url: "#" },
    { title: "Cookies Settings", url: "#" },
  ],
}
