import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BookOpen, ArrowRight, Search } from 'lucide-react'
import { useSubjects } from '@/hooks/useSubjects'
import { cn } from '@/lib/utils'

interface SubjectsSectionProps {
  className?: string
}

const SubjectsSection: React.FC<SubjectsSectionProps> = ({ className }) => {
  const { subjects, loading, error } = useSubjects()

  return (
    <section className={cn(
      "py-8 sm:py-12 md:py-16 lg:py-24 bg-gradient-to-b from-gray-50/50 to-white",
      className
    )} id="subjects">
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
        
        {/* Subjects Grid */}
        {loading ? (
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <Card className="min-h-[140px] sm:min-h-[160px] md:min-h-[180px] lg:min-h-[200px]">
                  <CardContent className="p-3 sm:p-4 md:p-6 lg:p-8 text-center h-full flex flex-col justify-center items-center">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-gray-200 rounded-lg sm:rounded-xl md:rounded-2xl mb-2 sm:mb-3 md:mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-1 sm:mb-1.5 md:mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-red-300 mx-auto mb-4" />
            <p className="text-red-500 mb-2">Error loading subjects</p>
            <p className="text-gray-500 text-sm">{error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
            {subjects.map((subject, index) => (
              <Link key={subject.slug} href="/dashboard" className="block h-full">
                <Card className="border-gray-200/80 hover:border-purple-200 hover:shadow-xl transition-all duration-300 cursor-pointer group h-full hover:-translate-y-1 min-h-[140px] sm:min-h-[160px] md:min-h-[180px] lg:min-h-[200px]">
                  <CardContent className="p-3 sm:p-4 md:p-6 lg:p-8 text-center h-full flex flex-col justify-center items-center">
                    {/* Icon Container */}
                    <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg sm:rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-2 sm:mb-3 md:mb-4 group-hover:from-purple-200 group-hover:to-purple-300 transition-all duration-300 shadow-md sm:shadow-lg">
                      <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-purple-600" />
                    </div>
                    
                    {/* Subject Title */}
                    <h3 className="font-bold text-sm sm:text-base md:text-lg text-gray-900 group-hover:text-purple-600 transition-colors mb-1 sm:mb-1.5 md:mb-2 leading-tight text-center px-1">
                      {subject.name}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-xs sm:text-sm text-gray-500 group-hover:text-gray-600 transition-colors leading-relaxed text-center px-1">
                      {subject.description}
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
        )}
        
        {/* Call-to-Action */}
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
  )
}

export default SubjectsSection