'use client'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  BookOpen, 
  Download, 
  Users, 
  Shield, 
  FileText,
  GraduationCap,
  Award,
  Clock,
  CheckCircle,
  Search,
  BookMarked,
  TrendingUp,
  Star,
  ArrowRight,
  Play,
  Globe,
  Zap,
  Sparkles,
  Target,
  Brain,
  Trophy,
  Rocket,
  Heart,
  ChevronDown,
  ExternalLink
} from 'lucide-react'
import { useState, useEffect } from 'react'

export default function Home() {
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null)
  const [hoveredStat, setHoveredStat] = useState<number | null>(null)
  const [scrollY, setScrollY] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [heroVisible, setHeroVisible] = useState(false)
  const [typedText, setTypedText] = useState('')
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [isTyping, setIsTyping] = useState(true)
  const [showCursor, setShowCursor] = useState(true)
  const [navbarVisible, setNavbarVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isScrollingUp, setIsScrollingUp] = useState(false)

  const heroWords = ['Master', 'Excel', 'Succeed', 'Dominate', 'Conquer', 'Transform']
  const motivationalPhrases = [
    'Your Success Story Starts Here',
    'Unlock Your Academic Potential',
    'Engineering Excellence Awaits',
    'Dream • Study • Achieve • Repeat'
  ]

  // Enhanced typing animation effect
  useEffect(() => {
    let typingTimeout: NodeJS.Timeout
    let wordTimeout: NodeJS.Timeout
    
    const currentWord = heroWords[currentWordIndex]
    
    if (isTyping) {
      if (typedText.length < currentWord.length) {
        typingTimeout = setTimeout(() => {
          setTypedText(currentWord.substring(0, typedText.length + 1))
        }, 100 + Math.random() * 100) // Variable typing speed for natural feel
      } else {
        wordTimeout = setTimeout(() => {
          setIsTyping(false)
        }, 2000) // Pause at complete word
      }
    } else {
      if (typedText.length > 0) {
        typingTimeout = setTimeout(() => {
          setTypedText(typedText.substring(0, typedText.length - 1))
        }, 50) // Faster deletion
      } else {
        setCurrentWordIndex((prev) => (prev + 1) % heroWords.length)
        setIsTyping(true)
      }
    }

    return () => {
      clearTimeout(typingTimeout)
      clearTimeout(wordTimeout)
    }
  }, [typedText, currentWordIndex, isTyping, heroWords])

  // Cursor blinking effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev)
    }, 530)
    return () => clearInterval(cursorInterval)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setScrollY(currentScrollY)
      
      // Navbar visibility logic (Discord-style)
      if (currentScrollY < 100) {
        // At the top of the page - always show navbar
        setNavbarVisible(true)
        setIsScrollingUp(false)
      } else if (currentScrollY > lastScrollY && currentScrollY > 200) {
        // Scrolling down and past threshold - hide navbar
        setNavbarVisible(false)
        setIsScrollingUp(false)
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up - show navbar
        setNavbarVisible(true)
        setIsScrollingUp(true)
      }
      
      setLastScrollY(currentScrollY)
    }
    
    const handleVisibility = () => setIsVisible(true)
    const handleHeroVisibility = () => setHeroVisible(true)
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    setTimeout(handleVisibility, 100)
    setTimeout(handleHeroVisibility, 300)
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  useEffect(() => {
    const typeText = () => {
      const currentWord = heroWords[currentWordIndex]
      const timer = setTimeout(() => {
        if (typedText.length < currentWord.length) {
          setTypedText(currentWord.slice(0, typedText.length + 1))
        } else {
          setTimeout(() => {
            setTypedText('')
            setCurrentWordIndex((prev) => (prev + 1) % heroWords.length)
          }, 2000)
        }
      }, 150)
      return timer
    }

    const timer = typeText()
    return () => clearTimeout(timer)
  }, [typedText, currentWordIndex, heroWords])

  const stats = [
    { 
      number: '10,000+', 
      label: 'Study Materials', 
      icon: FileText,
      gradient: 'from-blue-500 to-cyan-500',
      bgGradient: 'from-blue-50 to-cyan-50'
    },
    { 
      number: '25,000+', 
      label: 'Active Students', 
      icon: Users,
      gradient: 'from-emerald-500 to-teal-500',
      bgGradient: 'from-emerald-50 to-teal-50'
    },
    { 
      number: '500+', 
      label: 'Question Papers', 
      icon: BookMarked,
      gradient: 'from-purple-500 to-indigo-500',
      bgGradient: 'from-purple-50 to-indigo-50'
    },
    { 
      number: '98%', 
      label: 'Success Rate', 
      icon: TrendingUp,
      gradient: 'from-orange-500 to-red-500',
      bgGradient: 'from-orange-50 to-red-50'
    }
  ]

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Learning',
      description: 'Smart recommendations and personalized study paths tailored to your learning style and progress.',
      color: 'bg-gradient-to-br from-blue-50 to-indigo-100',
      iconColor: 'text-blue-600',
      accent: 'bg-blue-600'
    },
    {
      icon: Trophy,
      title: 'Exam Excellence',
      description: 'Comprehensive previous year papers and expert solutions to master your VTU examinations.',
      color: 'bg-gradient-to-br from-emerald-50 to-green-100',
      iconColor: 'text-emerald-600',
      accent: 'bg-emerald-600'
    },
    {
      icon: Rocket,
      title: 'Career Ready',
      description: 'Industry-relevant projects and skills development to boost your engineering career prospects.',
      color: 'bg-gradient-to-br from-purple-50 to-violet-100',
      iconColor: 'text-purple-600',
      accent: 'bg-purple-600'
    }
  ]

  const subjects = [
    'Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Information Science', 'Electrical'
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Discord-Style Header - Mobile Optimized */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
        navbarVisible ? 'translate-y-0' : '-translate-y-full'
      }`}>
        {/* Main Navbar */}
        <div className="bg-white/90 backdrop-blur-xl border-b border-gray-200/50 shadow-lg shadow-gray-100/25">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
            <div className="flex justify-between items-center py-3 sm:py-4 lg:py-5">
              <div className="flex items-center group">
                <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center mr-2 sm:mr-3 lg:mr-4 shadow-lg sm:shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                  <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5 lg:h-7 lg:w-7 text-white drop-shadow-sm" />
                </div>
                <div>
                  <h1 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent tracking-tight">
                    BrainReef
                  </h1>
                  <p className="text-[9px] sm:text-xs text-gray-500 font-medium tracking-wider uppercase hidden sm:block">VTU Learning Hub</p>
                </div>
              </div>
              
              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center space-x-6 xl:space-x-10">
                <Link href="#features" className="text-gray-700 hover:text-blue-600 transition-all duration-200 font-medium text-base relative group">
                  Features
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-200 group-hover:w-full"></span>
                </Link>
                <Link href="#subjects" className="text-gray-700 hover:text-blue-600 transition-all duration-200 font-medium text-base relative group">
                  Subjects
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-200 group-hover:w-full"></span>
                </Link>
                <Link href="#about" className="text-gray-700 hover:text-blue-600 transition-all duration-200 font-medium text-base relative group">
                  About
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-200 group-hover:w-full"></span>
                </Link>
              </nav>

              {/* Mobile and Desktop Action Buttons */}
              <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4">
                <Link href="/login">
                  <Button variant="ghost" className="text-gray-700 hover:text-blue-600 font-medium hover:bg-blue-50 transition-all duration-200 px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 text-sm sm:text-base">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-3 sm:px-4 lg:px-6 py-1.5 sm:py-2 lg:py-2.5 font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-xs sm:text-sm lg:text-base">
                    <span className="hidden sm:inline">Get Started Free</span>
                    <span className="sm:hidden">Start</span>
                    <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Persistent Logo (Shows when navbar is hidden) - Mobile Optimized */}
      <div className={`fixed top-2 sm:top-3 lg:top-4 left-2 sm:left-3 lg:left-4 z-40 transition-all duration-500 ease-in-out ${
        !navbarVisible && scrollY > 200 ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
      }`}>
        <div className="flex items-center group cursor-pointer">
          <div className="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg sm:shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
            <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white drop-shadow-sm" />
          </div>
          <div className="ml-2 sm:ml-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:block">
            <h1 className="text-sm sm:text-lg lg:text-xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent tracking-tight">
              BrainReef
            </h1>
          </div>
        </div>
      </div>

      {/* Spacer to prevent content from going under fixed header - Mobile Optimized */}
      <div className="h-14 sm:h-16 lg:h-20 xl:h-24"></div>

      <main>
        {/* Enhanced Clean Hero Section */}
        <section className="relative min-h-[85vh] lg:min-h-[90vh] bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 overflow-hidden">
          {/* Refined Background Pattern */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_40%,rgba(59,130,246,0.08),transparent_50%)]"></div>
            <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(99,102,241,0.06),transparent_50%)]"></div>
          </div>
          
          {/* Subtle Grid Pattern */}
          <div className="absolute inset-0 opacity-[0.02]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat'
          }}></div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
            <div className="flex flex-col lg:flex-row items-center justify-between min-h-[85vh] lg:min-h-[90vh] py-16 lg:py-20 gap-12 lg:gap-16">
              
              {/* Content Section - Enhanced */}
              <div className={`flex-1 text-center lg:text-left transition-all duration-1000 transform ${heroVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                
                {/* Enhanced Trust Badge */}
                <div className="inline-flex items-center gap-2 bg-blue-50/80 backdrop-blur-sm border border-blue-200/60 rounded-full px-4 py-2.5 mb-8 shadow-sm hover:shadow-md transition-all duration-300">
                  <Star className="w-4 h-4 text-yellow-500 fill-current animate-pulse" />
                  <span className="text-sm font-medium text-blue-700">Trusted by 25,000+ VTU Students</span>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                </div>

                {/* Enhanced Hero Title */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] mb-8 tracking-tight">
                  <span className="text-gray-900 block">
                    <span className="inline-block">
                      {typedText}
                      <span className={`${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity duration-100 text-blue-600`}>|</span>
                    </span>
                  </span>
                  <span className="text-gray-900 block mt-2">Your Academic</span>
                  <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent block mt-2">
                    Success Story
                  </span>
                </h1>

                {/* Enhanced Subtitle */}
                <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
                  Access premium study materials, previous year papers, and AI-powered learning tools designed exclusively for VTU engineering students.
                </p>

                {/* Enhanced Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
                  <Link href="/register" className="group">
                    <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group-hover:-translate-y-1">
                      <Rocket className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                      Start Learning Free
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                    </Button>
                  </Link>
                  <Link href="/dashboard" className="group">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 px-8 py-4 text-lg font-semibold transition-all duration-300 hover:shadow-lg">
                      <BookOpen className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-200" />
                      Explore Resources
                    </Button>
                  </Link>
                </div>

                {/* Enhanced Key Features Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto lg:mx-0">
                  <div className="flex items-center justify-center lg:justify-start gap-3 p-4 bg-white/70 backdrop-blur-sm rounded-xl border border-gray-200/60 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center shadow-sm">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-gray-900">100% Free</p>
                      <p className="text-xs text-gray-500">Forever & Always</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center lg:justify-start gap-3 p-4 bg-white/70 backdrop-blur-sm rounded-xl border border-gray-200/60 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center shadow-sm">
                      <Zap className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-gray-900">Instant Access</p>
                      <p className="text-xs text-gray-500">No Waiting</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center lg:justify-start gap-3 p-4 bg-white/70 backdrop-blur-sm rounded-xl border border-gray-200/60 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center shadow-sm">
                      <Brain className="w-5 h-5 text-purple-600" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-gray-900">AI-Powered</p>
                      <p className="text-xs text-gray-500">Smart Learning</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Visual Section */}
              <div className={`flex-1 w-full max-w-xl mx-auto lg:mx-0 transition-all duration-1000 transform ${heroVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`} style={{ transitionDelay: '300ms' }}>
                
                {/* Enhanced Dashboard Preview */}
                <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-100/80 overflow-hidden backdrop-blur-sm hover:shadow-3xl transition-all duration-500">
                  
                  {/* Enhanced Browser Header */}
                  <div className="flex items-center gap-2 px-5 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200/80">
                    <div className="w-3 h-3 bg-red-400 rounded-full shadow-sm"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full shadow-sm"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full shadow-sm"></div>
                    <div className="flex-1 mx-4">
                      <div className="bg-white rounded-lg px-4 py-2 text-xs text-gray-500 border border-gray-200 shadow-sm">
                        🔒 brainreef.com/dashboard
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Dashboard Content */}
                  <div className="p-6 bg-gradient-to-br from-white to-gray-50/30">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-gray-900">Your Study Hub</h3>
                      <div className="flex items-center gap-2 bg-green-50 px-3 py-1 rounded-full">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-xs text-green-600 font-medium">Online</span>
                      </div>
                    </div>

                    {/* Enhanced Study Cards */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-xl border border-blue-200/60 shadow-sm hover:shadow-md transition-all duration-300">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                          <BookOpen className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">Data Structures & Algorithms</h4>
                          <p className="text-xs text-gray-500 mb-2">Complete notes & examples</p>
                          <div className="w-full bg-blue-200 rounded-full h-2">
                            <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full w-3/4 transition-all duration-500"></div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-bold text-blue-600">75%</span>
                          <p className="text-xs text-gray-500">Progress</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-green-100/50 rounded-xl border border-green-200/60 shadow-sm hover:shadow-md transition-all duration-300">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                          <FileText className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">Computer Networks - 2024</h4>
                          <p className="text-xs text-gray-500 mb-2">Latest question paper with solutions</p>
                          <div className="w-full bg-green-200 rounded-full h-2">
                            <div className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full w-full transition-all duration-500"></div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-bold text-green-600">100%</span>
                          <p className="text-xs text-gray-500">Complete</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-purple-100/50 rounded-xl border border-purple-200/60 shadow-sm hover:shadow-md transition-all duration-300">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                          <Award className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">Operating Systems</h4>
                          <p className="text-xs text-gray-500 mb-2">Comprehensive study guide</p>
                          <div className="w-full bg-purple-200 rounded-full h-2">
                            <div className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full w-1/2 transition-all duration-500"></div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-bold text-purple-600">50%</span>
                          <p className="text-xs text-gray-500">In Progress</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Enhanced Floating Stats */}
                <div className="absolute -top-6 -right-6 bg-white rounded-2xl shadow-xl border border-gray-200/80 p-5 transform rotate-3 hover:rotate-0 transition-all duration-300 hover:scale-105 backdrop-blur-sm">
                  <div className="text-center">
                    <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">25K+</p>
                    <p className="text-xs text-gray-500 font-medium">Active Students</p>
                  </div>
                </div>

                <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl border border-gray-200/80 p-5 transform -rotate-3 hover:rotate-0 transition-all duration-300 hover:scale-105 backdrop-blur-sm">
                  <div className="text-center">
                    <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">10K+</p>
                    <p className="text-xs text-gray-500 font-medium">Study Resources</p>
                  </div>
                </div>

                {/* New Achievement Badge */}
                <div className="absolute top-1/2 -left-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl shadow-lg p-3 transform -rotate-12 hover:rotate-0 transition-all duration-300 hover:scale-110">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            <div className="flex flex-col items-center text-gray-400 group cursor-pointer">
              <span className="text-xs font-medium mb-2 group-hover:text-gray-600 transition-colors duration-200">Discover More</span>
              <div className="animate-bounce group-hover:animate-pulse">
                <ChevronDown className="w-6 h-6 group-hover:text-blue-500 transition-colors duration-200" />
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Stats Section - Mobile Optimized */}
        <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
          {/* Background decoration - Mobile Optimized */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50/20 via-transparent to-purple-50/20"></div>
          <div className="absolute top-1/2 left-0 w-32 h-32 sm:w-48 sm:h-48 lg:w-72 lg:h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-1/3 right-0 w-32 h-32 sm:w-48 sm:h-48 lg:w-72 lg:h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-10 sm:mb-12 lg:mb-16">
              <div className={`transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                <Badge variant="outline" className="text-indigo-700 border-indigo-200 bg-indigo-50/80 mb-3 sm:mb-4 px-3 sm:px-4 py-1.5 sm:py-2">
                  <Sparkles className="w-2 h-2 sm:w-3 sm:h-3 mr-1 sm:mr-2 text-yellow-500" />
                  <span className="text-xs sm:text-sm">Platform Statistics</span>
                </Badge>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-3 sm:mb-4 px-2 sm:px-0">
                  Trusted by Students Across VTU
                </h2>
                <p className="text-sm sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed px-4 sm:px-0">
                  Join the growing community of successful engineering students achieving academic excellence
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 xl:gap-8">
              {stats.map((stat, index) => (
                <div 
                  key={index} 
                  className={`group cursor-pointer transition-all duration-500 transform ${
                    isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
                  } ${hoveredStat === index ? 'scale-105 -translate-y-2' : 'hover:scale-102 hover:-translate-y-1'}`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                  onMouseEnter={() => setHoveredStat(index)}
                  onMouseLeave={() => setHoveredStat(null)}
                >
                  <div className={`relative text-center p-3 sm:p-4 lg:p-6 xl:p-8 bg-gradient-to-br ${stat.bgGradient} rounded-2xl sm:rounded-3xl border border-white/60 backdrop-blur-sm shadow-lg group-hover:shadow-2xl transition-all duration-500`}>
                    {/* Animated background gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 rounded-2xl sm:rounded-3xl transition-opacity duration-500`}></div>
                    
                    {/* Icon with enhanced styling - Mobile Optimized */}
                    <div className={`relative inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 xl:w-18 xl:h-18 bg-gradient-to-br ${stat.gradient} rounded-lg sm:rounded-xl lg:rounded-2xl mb-2 sm:mb-3 lg:mb-4 xl:mb-6 shadow-lg group-hover:shadow-xl transform group-hover:scale-110 transition-all duration-300`}>
                      <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8 xl:w-9 xl:h-9 text-white drop-shadow-sm" />
                      {hoveredStat === index && (
                        <div className="absolute inset-0 bg-white/20 rounded-lg sm:rounded-xl lg:rounded-2xl animate-ping"></div>
                      )}
                    </div>
                    
                    {/* Number with enhanced typography - Mobile Optimized */}
                    <div className={`text-xl sm:text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-bold bg-gradient-to-br ${stat.gradient} bg-clip-text text-transparent mb-1 sm:mb-2 lg:mb-3 group-hover:scale-105 transition-transform duration-300`}>
                      {stat.number}
                    </div>
                    
                    {/* Label with improved styling - Mobile Optimized */}
                    <div className="text-gray-700 font-semibold text-xs sm:text-sm lg:text-base xl:text-lg group-hover:text-gray-800 transition-colors duration-300 leading-tight">
                      {stat.label}
                    </div>
                    
                    {/* Subtle shine effect */}
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 rounded-2xl sm:rounded-3xl"></div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Additional trust indicators - Mobile Optimized */}
            <div className="mt-8 sm:mt-12 lg:mt-16 flex flex-wrap justify-center items-center gap-4 sm:gap-6 lg:gap-8 opacity-60 px-4">
              <div className="flex items-center space-x-2 text-gray-600">
                <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-red-500 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-medium">Loved by students</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-medium">Verified content</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Target className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-medium">Goal-oriented</span>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Features Section - Highly Mobile Responsive */}
        <section id="features" className="py-8 sm:py-12 md:py-16 lg:py-24 bg-white relative overflow-hidden">
          {/* Animated background elements - Mobile Optimized */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-24 h-24 sm:w-32 sm:h-32 md:w-48 md:h-48 lg:w-64 lg:h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-20 sm:opacity-30 animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-24 h-24 sm:w-32 sm:h-32 md:w-48 md:h-48 lg:w-64 lg:h-64 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-20 sm:opacity-30 animate-pulse" style={{ animationDelay: '3s' }}></div>
          </div>
          
          <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 relative z-10">
            <div className="text-center mb-8 sm:mb-10 md:mb-14 lg:mb-20">
              <div className={`transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                <Badge variant="outline" className="text-blue-700 border-blue-200 bg-blue-50/80 mb-3 sm:mb-4 md:mb-5 lg:mb-6 px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 text-xs sm:text-sm">
                  <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 mr-1 sm:mr-1.5 md:mr-2 text-yellow-500" />
                  <span>Why Choose BrainReef</span>
                </Badge>
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-3 sm:mb-4 md:mb-5 lg:mb-6 leading-tight px-2 sm:px-3 md:px-0">
                  Everything You Need to <br className="hidden sm:block" />
                  <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">Succeed</span>
                </h2>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-gray-600 max-w-4xl mx-auto font-light leading-relaxed px-3 sm:px-4 md:px-6 lg:px-0">
                  Comprehensive learning resources designed specifically for VTU engineering students, 
                  curated by experts and verified by top performers.
                </p>
              </div>
            </div>
            
            {/* Mobile-First Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-8 xl:gap-10">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className={`group cursor-pointer transition-all duration-700 transform ${
                    isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
                  } ${hoveredFeature === index ? 'scale-105 -translate-y-3' : 'hover:scale-102 hover:-translate-y-1'}`}
                  style={{ transitionDelay: `${index * 200}ms` }}
                  onMouseEnter={() => setHoveredFeature(index)}
                  onMouseLeave={() => setHoveredFeature(null)}
                >
                  <Card className="relative border-0 shadow-lg group-hover:shadow-2xl transition-all duration-500 overflow-hidden bg-white/80 backdrop-blur-sm h-full min-h-[280px] sm:min-h-[320px] md:min-h-[350px]">
                    {/* Animated gradient background */}
                    <div className={`absolute inset-0 ${feature.color} opacity-70 group-hover:opacity-90 transition-opacity duration-500`}></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/10 group-hover:from-white/30 group-hover:to-white/20 transition-all duration-500"></div>
                    
                    {/* Floating accent element */}
                    <div className={`absolute top-2 sm:top-3 md:top-4 right-2 sm:right-3 md:right-4 w-1 h-1 sm:w-1.5 sm:h-1.5 md:w-2 md:h-2 ${feature.accent} rounded-full group-hover:w-1.5 group-hover:h-1.5 sm:group-hover:w-2 sm:group-hover:h-2 md:group-hover:w-3 md:group-hover:h-3 transition-all duration-300`}></div>
                    
                    <CardHeader className="text-center pb-3 sm:pb-4 md:pb-6 pt-4 sm:pt-6 md:pt-8 lg:pt-10 relative z-10 px-3 sm:px-4 md:px-6">
                      {/* Enhanced icon with animations - Mobile Optimized */}
                      <div className="relative mx-auto mb-3 sm:mb-4 md:mb-6">
                        <div className={`w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-white rounded-xl sm:rounded-2xl md:rounded-3xl flex items-center justify-center shadow-md sm:shadow-lg md:shadow-xl group-hover:shadow-2xl transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                          <feature.icon className={`w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 ${feature.iconColor} group-hover:scale-110 transition-transform duration-300`} />
                        </div>
                        {hoveredFeature === index && (
                          <div className="absolute inset-0 bg-white/30 rounded-xl sm:rounded-2xl md:rounded-3xl animate-ping"></div>
                        )}
                      </div>
                      
                      <CardTitle className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-800 mb-2 sm:mb-3 md:mb-4 group-hover:text-gray-900 transition-colors duration-300 leading-tight">
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    
                    <CardContent className="text-center px-3 sm:px-4 md:px-6 pb-4 sm:pb-6 md:pb-8 lg:pb-10 relative z-10">
                      <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-700 leading-relaxed group-hover:text-gray-800 transition-colors duration-300 line-clamp-3 sm:line-clamp-none">
                        {feature.description}
                      </p>
                      
                      {/* Call to action that appears on hover - Mobile Optimized */}
                      <div className={`mt-3 sm:mt-4 md:mt-6 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300`}>
                        <div className="flex items-center justify-center text-xs sm:text-sm font-semibold text-blue-600">
                          Learn More <ExternalLink className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 ml-1" />
                        </div>
                      </div>
                    </CardContent>
                    
                    {/* Shine effect */}
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Subjects Section - Highly Mobile Responsive */}
        <section id="subjects" className="py-8 sm:py-12 md:py-16 lg:py-24 bg-gradient-to-b from-gray-50/50 to-white">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
            <div className="text-center mb-6 sm:mb-8 md:mb-12 lg:mb-16">
              <Badge variant="outline" className="text-purple-700 border-purple-200 bg-purple-50/80 mb-2 sm:mb-3 md:mb-4 px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 text-xs sm:text-sm">
                <span>All Engineering Branches</span>
              </Badge>
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4 lg:mb-6 px-2 sm:px-3 md:px-0 leading-tight">
                Study Materials for <br className="block sm:hidden" />
                <span className="text-purple-600">Every Branch</span>
              </h2>
              <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto font-light px-3 sm:px-4 md:px-6 lg:px-0 leading-relaxed">
                Choose your engineering branch and access tailored study resources, notes, and question papers
              </p>
            </div>
            
            {/* Mobile-First Grid Layout for Subjects */}
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
              {subjects.map((subject, index) => (
                <Link key={index} href="/dashboard" className="block h-full">
                  <Card className="border-gray-200/80 hover:border-purple-200 hover:shadow-xl transition-all duration-300 cursor-pointer group h-full hover:-translate-y-1 min-h-[140px] sm:min-h-[160px] md:min-h-[180px] lg:min-h-[200px]">
                    <CardContent className="p-3 sm:p-4 md:p-6 lg:p-8 text-center h-full flex flex-col justify-center items-center">
                      {/* Icon Container - Mobile Optimized */}
                      <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg sm:rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-2 sm:mb-3 md:mb-4 group-hover:from-purple-200 group-hover:to-purple-300 transition-all duration-300 shadow-md sm:shadow-lg">
                        <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-purple-600" />
                      </div>
                      
                      {/* Subject Title - Mobile Optimized */}
                      <h3 className="font-bold text-sm sm:text-base md:text-lg text-gray-900 group-hover:text-purple-600 transition-colors mb-1 sm:mb-1.5 md:mb-2 leading-tight text-center px-1">
                        {subject}
                      </h3>
                      
                      {/* Description - Mobile Optimized */}
                      <p className="text-xs sm:text-sm text-gray-500 group-hover:text-gray-600 transition-colors leading-relaxed text-center px-1">
                        Complete study materials & papers
                      </p>
                      
                      {/* Arrow Indicator */}
                      <div className="mt-2 sm:mt-3 md:mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600 mx-auto" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
            
            {/* Mobile Call-to-Action */}
            <div className="mt-6 sm:mt-8 md:mt-10 lg:mt-12 text-center">
              <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4 px-3">
                Can't find your branch? We're constantly adding new subjects.
              </p>
              <Link href="/dashboard">
                <Button variant="outline" className="w-full sm:w-auto px-4 sm:px-6 md:px-8 py-2 sm:py-3 text-sm sm:text-base border-purple-200 text-purple-600 hover:bg-purple-50">
                  <Search className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                  Browse All Subjects
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section - Mobile Optimized */}
        <section className="py-12 sm:py-16 lg:py-24 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 relative overflow-hidden">
          {/* Background Pattern - Mobile Optimized */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundRepeat: 'repeat'
            }} />
          </div>
          
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <div className="space-y-6 sm:space-y-8">
              <div className="space-y-4 sm:space-y-6">
                <Badge variant="outline" className="border-blue-300/50 bg-blue-500/20 text-blue-100 px-3 sm:px-4 py-1.5 sm:py-2">
                  <Star className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2 text-yellow-300 fill-current" />
                  <span className="text-xs sm:text-sm">Join the Success Story</span>
                </Badge>
                
                <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white leading-tight px-2 sm:px-0">
                  Ready to Excel in <br />
                  <span className="text-blue-200">Your Studies?</span>
                </h2>
                
                <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed font-light px-4 sm:px-0">
                  Join thousands of VTU students who are already using BrainReef to achieve academic success. 
                  Start your learning journey today, completely free.
                </p>
              </div>
              
              <div className="flex flex-col gap-3 sm:gap-4 justify-center pt-2 sm:pt-4 max-w-md mx-auto lg:max-w-none lg:flex-row">
                <Link href="/register" className="w-full lg:w-auto">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-6 sm:px-8 lg:px-10 py-3 sm:py-4 text-sm sm:text-base font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 w-full group">
                    <span className="hidden sm:inline">Create Free Account</span>
                    <span className="sm:hidden">Get Started Free</span>
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                  </Button>
                </Link>
                <Link href="/dashboard" className="w-full lg:w-auto">
                  <Button variant="outline" size="lg" className="border-2 border-white/80 text-white hover:bg-white hover:text-blue-600 px-6 sm:px-8 lg:px-10 py-3 sm:py-4 text-sm sm:text-base font-medium backdrop-blur-sm w-full transition-all duration-300">
                    <BookOpen className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                    <span className="hidden sm:inline">Browse Resources</span>
                    <span className="sm:hidden">Browse</span>
                  </Button>
                </Link>
              </div>
              
              <div className="pt-6 sm:pt-8 border-t border-blue-400/30">
                <p className="text-blue-200 text-xs sm:text-sm font-medium px-4 sm:px-0">
                  No credit card required • Instant access • 100% free forever
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer - Mobile Optimized */}
      <footer className="bg-gray-900 text-gray-300 py-8 sm:py-10 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <div className="col-span-2 md:col-span-1 space-y-3 sm:space-y-4">
              <div className="flex items-center">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-600 rounded-md sm:rounded-lg flex items-center justify-center mr-2 sm:mr-3">
                  <GraduationCap className="h-3 w-3 sm:h-5 sm:w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-base sm:text-lg">BrainReef</h3>
                  <p className="text-[10px] sm:text-xs text-gray-400">VTU Learning Hub</p>
                </div>
              </div>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                Empowering VTU engineering students with quality educational resources and study materials.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Quick Links</h4>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                <li><Link href="/dashboard" className="hover:text-white transition-colors">Study Materials</Link></li>
                <li><Link href="/dashboard" className="hover:text-white transition-colors">Question Papers</Link></li>
                <li><Link href="/login" className="hover:text-white transition-colors">Login</Link></li>
                <li><Link href="/register" className="hover:text-white transition-colors">Sign Up</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Subjects</h4>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                <li><Link href="/dashboard" className="hover:text-white transition-colors">Computer Science</Link></li>
                <li><Link href="/dashboard" className="hover:text-white transition-colors">Electronics</Link></li>
                <li><Link href="/dashboard" className="hover:text-white transition-colors">Mechanical</Link></li>
                <li><Link href="/dashboard" className="hover:text-white transition-colors">Civil Engineering</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Support</h4>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center">
            <p className="text-gray-400 text-xs sm:text-sm px-4 sm:px-0">
              © 2025 BrainReef. All rights reserved. Made with ❤️ for VTU students.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
