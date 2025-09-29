'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Eye, EyeOff, CheckCircle, XCircle, GraduationCap, Mail, User, Building2, Lock, Sparkles, ChevronDown, Search } from 'lucide-react'
import Link from 'next/link'

// College data organized by region
const collegeData = {
  BENGALURU: [
    { code: 'AY', name: 'ACHARAYA INSTITUTE OF TECHNOLOGY' },
    { code: 'AP', name: 'A.P.S COLLEGE OF ENGINEERING' },
    { code: 'AM', name: 'AMC ENGINEERING COLLEGE' },
    { code: 'AR', name: 'AMRUTHA INSTITUTE OF ENGINEERING AND MGMT. SCIENCES' },
    { code: 'AT', name: 'ATRIA INSTITUTE OF TECHNOLOGY' },
    { code: 'BC', name: 'BENGALURU COLLEGE OF ENGINEERING AND TECHNOLOGY' },
    { code: 'BI', name: 'BENGALURU INSTITUTE OF TECHNOLOGY' },
    { code: 'BO', name: 'BRINDAVAN COLLEGE OF ENGG' },
    { code: 'CR', name: 'C.M.R INSTITUTE OF TECHNOLOGY' },
    { code: 'CD', name: 'CAMBRIDGE INSTITUTE OF TECHNOLOGY' },
    { code: 'CG', name: 'CHANNA BASAVESHWARA INSTITUTE OF TECHNOLOGY' },
    { code: 'CE', name: 'CITY ENGINEERING COLLEGE' },
    { code: 'DB', name: 'DON BOSCO INSTITUTE OF TECHNOLOGY' },
    { code: 'GV', name: 'DR. T THIMAIAH INSTITUTE OF TECHNOLOGY' },
    { code: 'EP', name: 'EAST POINT COLLEGE OF ENGINEERING AND TECHNOLOGY' },
    { code: 'EW', name: 'EAST WEST INSTITUTE OF TECHNOLOGY' },
    { code: 'GC', name: 'GHOUSIA COLLEGE OF ENGINEERING' },
    { code: 'SK', name: 'GOVERNMENT S.K.S.J.T. INSTITUTE OF TECHNOLOGY' },
    { code: 'GT', name: 'GOVERNMENT TOOL ROOM AND TRAINING CENTRE' },
    { code: 'GG', name: 'GOVT. ENGINEERING COLLEGE RAMNAGAR' },
    { code: 'HK', name: 'HKBK COLLEGE OF ENGINEERING' },
    { code: 'HM', name: 'HMS INSTITUTE OF TECHNOLOGY' },
    { code: 'IC', name: 'IMPACT COLLEGE OF ENGINEERING' },
    { code: 'JV', name: 'JNANA VIKAS INSTITUTE OF TENCNOLOGY' },
    { code: 'JS', name: 'JSS ACADEMY OF TECHNICIAL EDUCATION' },
    { code: 'KS', name: 'K.S.INSTITUTE OF TECHNOLOGY' },
    { code: 'KI', name: 'KALPATARU INSTITUTE OF TECHNOLOGY' },
    { code: 'KN', name: 'KNS INSTITUTE OF TECHNOLOGY' },
    { code: 'ME', name: 'M.S.ENGINEERING COLLEGE' },
    { code: 'OX', name: 'OXFORD COLLEGE OF ENGINEERING' },
    { code: 'RI', name: 'R R INSTITUTE OF TECHNOLOGY' },
    { code: 'RL', name: 'R.L.JALAPPA INSTITUTE OF TECHNOLOGY' },
    { code: 'RR', name: 'RAJARAJESWARI COLLEGE OF ENGINEERING' },
    { code: 'RG', name: 'RAJIV GANDHI INSTITUTE OF TECHNOLOGY' },
    { code: 'RN', name: 'RNS INSTITUTE OF TECHNOLOGY' },
    { code: 'SJ', name: 'S.J.C INSTITUTE OF TECHNOLOGY' },
    { code: 'VA', name: 'SAI VIDYA INSTITUTE OF TECHNOLOGY' },
    { code: 'ST', name: 'SAMBHRAM INSTITUTE OF TECHNOLOGY' },
    { code: 'SG', name: 'SAPTHAGIRI COLLEGE OF ENGINEERING' },
    { code: 'SP', name: 'SEA COLLEGE OF ENGINEERING AND TECHNOLOGY' },
    { code: 'SB', name: 'SRI SAIRAM COLLEGE OF ENGINEERING' },
    { code: 'SV', name: 'SHRIDEVI INSTITUTE OF ENGINEERING AND TECHNOLOGY' },
    { code: 'MV', name: 'SIR M. VISVESVARAYA INSTITUTE OF TECHNOLOGY' },
    { code: 'JB', name: 'SJB INSTITUTE OF TECHNOLOGY' },
    { code: 'CC', name: 'Dr. Sri Sri Sri SHIVKUMAR MAHASWAMY, COLLEGE OF ENGG.' },
    { code: 'KT', name: 'SRI KRISHNA INSTITUTE OF TECHNOLOGY' },
    { code: 'RC', name: 'SRI REVANASIDDESHWARA INSTITUTE OF TECHNOLOGY' },
    { code: 'VE', name: 'SRI VENKATESHWARA COLLEGE OF ENGINEERING' },
    { code: 'TJ', name: 'T. JOHN INSTITUTE OF TECHNOLOGY' },
    { code: 'VI', name: 'VEMANA INSTITUTE OF TECHNOLOGY' },
    { code: 'VK', name: 'VIVEKANANDA INSTITUTE OF TECHNOLOGY' },
    // Additional colleges from complete list
    { code: 'AA', name: 'ACHARYS NRV SCHOOL OF ARCHITECTURE' },
    { code: 'AH', name: 'ACS COLLEGE OF ENGINEERING' },
    { code: 'AK', name: 'AKSHAYA INSTITUTE OF TECHNOLOGY' },
    { code: 'CK', name: 'C BYEREGOWDA INSTITUTE OF TECHNOLOGY' },
    { code: 'VJ', name: 'VIJAYA VITTALA INSTITUTE OF TECHNOLOGY' },
    { code: 'HS', name: 'SHASHIB COLLEGE OF ENGINEERING' },
    { code: 'SZ', name: 'SAMPOORNA INSTITUTE OF TECHNOLOGY RESEARCH' },
    { code: 'KG', name: 'K.S SCHOOL OF ENGG & MGMT' },
    { code: 'GD', name: 'GOPALAN COLLEGE OF ENGINEERING MANAGEMENT' },
    { code: 'BH', name: 'BENGALURU TECHNOLOGICAL INSTITUTE' },
    { code: 'JT', name: 'JYOTHY INSTITUTE OF TECHNOLOGY' },
    { code: 'DT', name: 'DAYANANDA SAGAR ACADEMY OF TECHNOLOGY AND MGMT.' },
    { code: 'AJ', name: 'CAMBRIDGE INSITUTE OF TECHNOLOGY NORTH CAMPUS BANGALORE' },
    { code: 'DC', name: 'DAYANAND SAGAR SCHOOL OF ARCHITECTURE' },
    { code: 'IS', name: 'IMPACT SCHOOL OF ARCHITECTURE' },
    { code: 'RW', name: 'R V COLLEGE OF ARCHITECTURE' },
    { code: 'BQ', name: 'BMS SCHOOL OF ARCHITECTURE' },
    { code: 'JA', name: 'S J B School of Arch. & Planning' },
    { code: 'GO', name: 'GOPALAN SCHOOL OF ARCHITECTURE & PLANNING' },
    { code: 'RR', name: 'R.R. SCHOOL OF ARCHITECTURE' },
    { code: 'AN', name: 'ADITHYA ACADEMY OF ARCHITECTURE & DESGIN' },
    { code: 'PC', name: 'BGS SCHOOL OF ARCHITECTURE & PLANNING' },
    { code: 'KF', name: 'K S SCHOOL OF ARCHITECTURE' },
    { code: 'EE', name: 'EAST WEST COLLEGE OF ENGG' },
    { code: 'VB', name: 'SRI VINAYAKA INSTITUTE OF TECHNOLOGY' },
    { code: 'IV', name: 'Sir. M. V. School of Architecture' },
    { code: 'NS', name: 'Nitte School of Architecture' },
    { code: 'IT', name: 'HMS School of Architecture' },
    { code: 'IE', name: 'Brindavan College of Architecture' },
    { code: 'CF', name: 'BMS College of Architecture' },
    { code: 'OQ', name: 'OXFORD SCHOOL OF ARCHITECTURE' },
    { code: 'RQ', name: 'RNS SCHOOL OF ARCHITECTURE' },
    { code: 'SW', name: 'SRI BASAVESHWAR INSTITUTE OF TECHNOLOGY' },
    { code: 'RF', name: 'R V INSTITUTE OF TECHNOLOGY AND MGMT' },
    { code: 'WS', name: 'EAST WEST SCHOOL OF ARCHITECTURE' },
    { code: '', name: 'BGS College of Engineering & Technology' },
    { code: '', name: 'Aditya College of Engineering & Technology' },
    { code: '', name: 'Akash Institute of Engineering & Technology' },
    { code: '', name: 'Ghousia Institute of Technology for Women' },
  ],
  BELAGAVI: [
    { code: 'AB', name: 'ANJUMAN INSTITUTE OF TECHNOLOGY & MANAGEMENT' },
    { code: 'BL', name: 'BLDEAS COLLEGE OF ENGINEERING' },
    { code: 'GO', name: 'GOVT. ENGINEERING COLLEGE HAVERI' },
    { code: 'HN', name: 'HIRASUGAR INSTITUTE OF TECHNOLOGY' },
    { code: 'KD', name: 'KLE COLLEGE OF ENG. AND TECHNOLOGY CHIKODI' },
    { code: 'KE', name: 'KLE INSTITUTE OF TECH HUBLI' },
    { code: 'KL', name: 'KLE Dr M. S. SHESHGIRI COLLEGE OF ENGINEERING AND TECHNOLOGY' },
    { code: 'MB', name: 'MALIK SANDAL INSTITUTE OF ART AND ARCHITECTURE' },
    { code: 'MM', name: 'MARATHA MANDALS ENGINEERING COLLEGE' },
    { code: 'RH', name: 'RURAL ENGINEERING COLLEGE, HULKOTI' },
    { code: 'BU', name: 'S G BALEKUNDRI INST. OF TECH' },
    { code: 'SR', name: 'S.T.J. INSTITUTE OF TECHNOLOGY' },
    { code: 'SA', name: 'SECAB INSTITUTE OF ENGINEERING AND TECHNOLOGY' },
    { code: 'KA', name: 'SMT. KAMALA AND SRI VENKAPPA M. AGADI COLLEGE OF ENGINEERING AND TECHNOLOGY' },
    { code: 'TG', name: 'SRI TONTADARAYA COLLEGE OF ENGINEERING' },
    { code: 'VD', name: 'VISHWANATHARAO DESHPANDE INSTITUTE OF TECHNOLOGY, HALIYAL' },
  ],
  KALABURAGI: [
    { code: 'BK', name: 'BASAVAKALYAN ENGINEERING COLLEGE' },
    { code: 'GU', name: 'GOVT. ENGINEERING COLLEGE RAICHUR' },
    { code: 'GN', name: 'GURU NANAK DEV ENGINEERING COLLEGE' },
    { code: 'KC', name: 'K.C.T. ENGINEERING COLLEGE' },
    { code: 'KB', name: 'KHAJA BANDA NAWAZ COLLEGE OF ENGINEERING' },
    { code: 'NA', name: 'NAVODAYA INSTITUTE OF TECHNOLOGY' },
    { code: 'PG', name: 'PROUDADEVARAYA INSTITUTE OF TECHNOLOGY' },
    { code: 'VC', name: 'RAO BAHADDUR Y MAHABALESHWARAPPA ENGG COLLEGE' },
    { code: 'RB', name: 'BHEEMANNA KHANDRE INSTITUTE OF TECHNOLOGY, BHALKI' },
    { code: 'SL', name: 'SLN COLLEGE OF ENGINEERING' },
    { code: 'VN', name: 'VEERAPPA NISTY ENGINEERING COLLEGE' },
  ],
  MYSURU: [
    { code: 'AI', name: 'ADICHUNCHANAGIRI INSTITUTE OF TECHNOLOGY' },
    { code: 'AL', name: 'ALVAS INST. OF ENGG. AND TECHNOLOGY' },
    { code: 'BB', name: 'BAHUBALI COLLEGE OF ENGINEERING' },
    { code: 'BD', name: 'BAPUJI INSTITUTE OF ENGINEERING AND TECHNOLOGY' },
    { code: 'BP', name: 'BEARYS INSTITUTE OF TECHNOLOGY' },
    { code: 'CB', name: 'CANARA ENGINEERING COLLEGE' },
    { code: 'CI', name: 'COORG INSTITUTE OF TECHNOLOGY' },
    { code: 'DM', name: 'YENEPOYA INSTITUTE OF TECHNOLOGY' },
    { code: 'GM', name: 'GM.INSTITUTE OF TECHONOLOGY' },
    { code: 'GE', name: 'GOVT. ENGINEERING COLLEGE CHAMARAJANAGARA' },
    { code: 'GH', name: 'GOVT. ENGINEERING COLLEGE HASSAN' },
    { code: 'GL', name: 'GOVT. ENGINEERING COLLEGE KUSHAL NAGAR' },
    { code: 'GK', name: 'GOVT. ENGINEERING COLLEGE MANDYA' },
    { code: 'GR', name: 'GOVT. TOOL ROOM AND TRAINING CENTRE' },
    { code: 'GW', name: 'GSSS INSTITUTE OF ENGINEERING AND TECHNOLOGY FOR WOMEN' },
    { code: 'JN', name: 'JAWAHARLAL NEHRU NATIONAL COLLEGE OF ENGINERING' },
    { code: 'KV', name: 'K.V.G. COLLEGE OF ENGINEERING' },
    { code: 'KM', name: 'KARAVALI INSTITUTE OF TECHNOLOGY' },
    { code: 'MH', name: 'MAHARAJA INSTITUTE OF TECHNOLOGY MYSORE' },
    { code: 'MT', name: 'MANGALORE INSTITUTE OF TECHNOLOGY AND ENGINEERING' },
    { code: 'MK', name: 'MOODLAKATTE INSTITUTE OF TECHONOLOGY' },
    { code: 'NN', name: 'NIE INST. OF TECHNOLOGY' },
    { code: 'PA', name: 'P.A.COLLEGE OF ENGINEERING' },
    { code: 'PM', name: 'PES INSITUTE OF TECHNOLOGY AND MGMT.' },
    { code: 'RA', name: 'RAJEEV INST. OF TECHNOLOGY' },
    { code: 'SH', name: 'SHREE DEVI INSTITUTE OF TECHNOLOGY' },
    { code: 'SM', name: 'SJM INSTITUTE OF TECHNOLOGY' },
    { code: 'SU', name: 'SRI DHARMASTHAL MANJUNATHESHWAR INSTITUTE OF TECHNOLOGY' },
    { code: 'JE', name: 'SRI JAYACHAMRAJENDRA COLLEGE OFF ENGG. EVENING' },
    { code: 'SN', name: 'SRINIVAS INSTITUTE OF TECHNOLOGY' },
    { code: 'VM', name: 'VIDYA VIKAS INSTITUTE OF ENGINEERING AND TECHNOLOGY' },
    { code: 'VP', name: 'VIVEKANANDA COLLEGE OF ENGINEERING AND TECHNOLOGY' },
  ]
}

// Flatten all colleges into a single array for easy searching
const allColleges = Object.values(collegeData).flat().map(college => ({
  ...college,
  region: getRegionFromCollege(college)
}))

// Get region from college data
function getRegionFromCollege(college: { code: string; name: string }): string {
  for (const [region, colleges] of Object.entries(collegeData)) {
    if (colleges.some(c => c.code === college.code && c.name === college.name)) {
      return region
    }
  }
  return 'UNKNOWN'
}

// Advanced search utilities
const levenshteinDistance = (a: string, b: string): number => {
  const matrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null))
  
  for (let i = 0; i <= a.length; i++) matrix[0][i] = i
  for (let j = 0; j <= b.length; j++) matrix[j][0] = j
  
  for (let j = 1; j <= b.length; j++) {
    for (let i = 1; i <= a.length; i++) {
      const indicator = a[i - 1] === b[j - 1] ? 0 : 1
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + indicator
      )
    }
  }
  
  return matrix[b.length][a.length]
}

const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

const extractKeywords = (text: string): string[] => {
  const normalized = normalizeText(text)
  return normalized.split(' ').filter(word => word.length > 1)
}

// Common abbreviations and synonyms
const synonyms: Record<string, string[]> = {
  'engineering': ['engg', 'eng', 'engr', 'engineer'],
  'technology': ['tech', 'techno', 'technological'],
  'institute': ['inst', 'instt', 'institution'],
  'college': ['clg', 'coll'],
  'university': ['univ', 'uni'],
  'government': ['govt', 'gvt', 'gov'],
  'management': ['mgmt', 'mgt'],
  'science': ['sci', 'sciences'],
  'bangalore': ['bengaluru', 'blr'],
  'bengaluru': ['bangalore', 'blr'],
  'mysore': ['mysuru'],
  'mysuru': ['mysore'],
  'belagavi': ['belgaum'],
  'belgaum': ['belagavi']
}

const expandSynonyms = (word: string): string[] => {
  const normalized = normalizeText(word)
  const expansions = [normalized]
  
  Object.entries(synonyms).forEach(([key, syns]) => {
    if (syns.includes(normalized)) {
      expansions.push(key, ...syns)
    } else if (key === normalized) {
      expansions.push(...syns)
    }
  })
  
  return [...new Set(expansions)]
}

interface SearchResult {
  college: typeof allColleges[0]
  score: number
  matchType: string
}

const advancedSearch = (searchTerm: string, colleges: typeof allColleges): SearchResult[] => {
  if (!searchTerm.trim()) return []
  
  const normalizedSearch = normalizeText(searchTerm)
  const searchKeywords = extractKeywords(searchTerm)
  
  const results: SearchResult[] = colleges.map(college => {
    const normalizedName = normalizeText(college.name)
    const normalizedCode = normalizeText(college.code)
    const nameKeywords = extractKeywords(college.name)
    
    let score = 0
    let matchType = 'no-match'
    
    // Exact match
    if (normalizedName === normalizedSearch || normalizedCode === normalizedSearch) {
      score = 1000
      matchType = 'exact'
    }
    // Code prefix match
    else if (normalizedCode.startsWith(normalizedSearch)) {
      score = 900
      matchType = 'code-prefix'
    }
    // Name prefix match
    else if (normalizedName.startsWith(normalizedSearch)) {
      score = 850
      matchType = 'name-prefix'
    }
    // Word boundary match
    else if (normalizedName.includes(' ' + normalizedSearch)) {
      score = 800
      matchType = 'word-boundary'
    }
    // Acronym match
    else {
      const acronym = nameKeywords.map(word => word[0]).join('')
      if (acronym.includes(normalizedSearch)) {
        score = 750
        matchType = 'acronym'
      }
    }
    
    // Fuzzy matching
    if (score === 0) {
      const nameDistance = levenshteinDistance(normalizedSearch, normalizedName)
      const codeDistance = levenshteinDistance(normalizedSearch, normalizedCode)
      const minDistance = Math.min(nameDistance, codeDistance)
      
      const maxAllowedDistance = Math.max(2, Math.floor(normalizedSearch.length * 0.4))
      if (minDistance <= maxAllowedDistance) {
        score = 600 - (minDistance * 50)
        matchType = 'fuzzy'
      }
    }
    
    // Keyword matching with synonyms
    if (score === 0) {
      let keywordMatches = 0
      
      searchKeywords.forEach(searchKeyword => {
        const expandedKeywords = expandSynonyms(searchKeyword)
        
        nameKeywords.forEach(nameKeyword => {
          const expandedNameKeywords = expandSynonyms(nameKeyword)
          
          if (expandedKeywords.some(sk => expandedNameKeywords.some(nk => 
            nk.includes(sk) || sk.includes(nk) || levenshteinDistance(sk, nk) <= 1
          ))) {
            keywordMatches++
          }
        })
      })
      
      if (keywordMatches > 0 && searchKeywords.length > 0) {
        score = (keywordMatches / searchKeywords.length) * 500
        matchType = 'keyword'
      }
    }
    
    // Contains match (fallback)
    if (score === 0) {
      if (normalizedName.includes(normalizedSearch) || normalizedCode.includes(normalizedSearch)) {
        score = 300
        matchType = 'contains'
      }
    }
    
    return { college, score, matchType }
  }).filter(result => result.score > 0)
  
  return results.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score
    return a.college.name.localeCompare(b.college.name)
  }).slice(0, 50)
}

const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters').max(50),
  collegeName: z.string().min(2, 'Please select a college from the dropdown').max(100),
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one digit')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type RegisterForm = z.infer<typeof registerSchema>

// Intelligent College Dropdown Component
interface CollegeDropdownProps {
  value: string
  onChange: (value: string) => void
  error?: string
}

function CollegeDropdown({ value, onChange, error }: CollegeDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const searchResults = advancedSearch(searchTerm, allColleges)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setSearchTerm(newValue)
    onChange(newValue)
    setIsOpen(true)
  }

  const handleCollegeSelect = (college: { code: string; name: string }) => {
    onChange(college.name)
    setSearchTerm('')
    setIsOpen(false)
  }

  const handleInputFocus = () => {
    setIsOpen(true)
    setSearchTerm(value)
  }

  const getMatchQualityIndicator = (score: number) => {
    if (score >= 800) return <div className="w-3 h-3 bg-green-500 rounded-full" title="Excellent match" />
    if (score >= 600) return <div className="w-3 h-3 bg-blue-500 rounded-full" title="Good match" />
    if (score >= 400) return <div className="w-3 h-3 bg-yellow-500 rounded-full" title="Fair match" />
    return <div className="w-3 h-3 bg-gray-400 rounded-full" title="Partial match" />
  }

  const highlightMatch = (text: string, searchTerm: string): React.ReactNode => {
    if (!searchTerm) return text
    
    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
    const parts = text.split(regex)
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-blue-100 text-blue-800 px-1 rounded font-medium">
          {part}
        </mark>
      ) : part
    )
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="relative">
        <Building2 className="absolute left-3 top-3 h-5 w-5 text-gray-400 z-10" />
        <Input
          ref={inputRef}
          placeholder="🧠 Smart search: college name, code, or keywords (e.g., 'engineering', 'AY', 'bangalore')"
          className="pl-10 pr-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 bg-white/80"
          value={isOpen ? searchTerm : value}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          autoComplete="off"
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0 h-12 px-3 py-2 hover:bg-transparent"
          onClick={() => setIsOpen(!isOpen)}
        >
          <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </Button>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-80 overflow-y-auto">
          {searchTerm && searchResults.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              <div className="text-sm mb-2 font-medium">No colleges found for "{searchTerm}"</div>
              <div className="text-xs text-gray-400 space-y-1">
                <div>Try searching with:</div>
                <div>• College codes (e.g., "AY", "BI", "MT")</div>
                <div>• Keywords (e.g., "engineering", "technology", "govt")</div>
                <div>• Cities (e.g., "bangalore", "mysore", "hubli")</div>
                <div>• Even with typos - we'll find the best matches!</div>
              </div>
            </div>
          ) : !searchTerm ? (
            <div className="p-4 text-center text-gray-500">
              <div className="flex justify-center mb-3">
                <Search className="w-8 h-8 text-gray-300" />
              </div>
              <div className="text-sm mb-2 font-medium">🧠 Intelligent VTU College Search</div>
              <div className="text-xs text-gray-400 space-y-1">
                <div>🔍 Advanced fuzzy matching with typo tolerance</div>
                <div>📝 Search by name, code, keywords, or abbreviations</div>
                <div>🎯 Finds exact matches even with partial input</div>
                <div>🚀 Powered by advanced search algorithms</div>
              </div>
            </div>
          ) : (
            <div className="py-1">
              {searchResults.map((result, index) => (
                <button
                  key={`${result.college.code}-${index}`}
                  type="button"
                  className="w-full text-left px-4 py-3 hover:bg-blue-50 hover:text-blue-700 transition-colors border-b border-gray-50 last:border-b-0"
                  onClick={() => handleCollegeSelect(result.college)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm leading-5">
                        {highlightMatch(result.college.name, searchTerm)}
                      </div>
                      {result.college.code && (
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-500">
                            Code: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{result.college.code}</span>
                          </span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-500 capitalize">
                            {result.college.region.toLowerCase()}
                          </span>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-blue-600 capitalize">
                            {result.matchType.replace('-', ' ')} match
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-shrink-0 ml-2 flex items-center">
                      {getMatchQualityIndicator(result.score)}
                    </div>
                  </div>
                </button>
              ))}
              
              {searchResults.length === 50 && (
                <div className="p-3 text-center text-gray-500 text-xs bg-gray-50 border-t">
                  <div className="font-medium mb-1">Showing top 50 matches</div>
                  <div>🎯 Refine your search for more specific results</div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [emailVerificationSent, setEmailVerificationSent] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  })

  const password = watch('password', '')

  // Password validation helpers
  const passwordValidations = {
    length: password?.length >= 6,
    uppercase: /[A-Z]/.test(password || ''),
    digit: /[0-9]/.test(password || ''),
    special: /[^A-Za-z0-9]/.test(password || ''),
  }

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: data.fullName,
          collegeName: data.collegeName,
          email: data.email,
          password: data.password,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error)
      }

      setSuccess(true)
      setEmailVerificationSent(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed')
    } finally {
      setIsLoading(false)
    }
  }

  if (success && emailVerificationSent) {
    return (
      <div className="w-full max-w-md mx-auto">
        <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-xl">
          <CardContent className="pt-8 pb-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-200 rounded-full flex items-center justify-center mx-auto shadow-lg">
                <Mail className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Check Your Email!</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  We've sent a verification link to your email address. Please click the link to verify your account and complete your registration.
                </p>
              </div>
              <div className="pt-4">
                <Link href="/login">
                  <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
                    Go to Login
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto border-0 shadow-2xl bg-white/80 backdrop-blur-xl">
      <CardHeader className="text-center pb-4">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <GraduationCap className="w-8 h-8 text-white" />
        </div>
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
          Join BrainReef
        </CardTitle>
        <p className="text-sm text-gray-600 mt-2">Start your academic success journey today</p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive" className="border-red-200 bg-red-50">
            <XCircle className="h-4 w-4" />
            <AlertDescription className="text-red-700">{error}</AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-gray-700 font-medium">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                id="fullName"
                placeholder="Enter your full name"
                className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 bg-white/80"
                {...register('fullName')}
              />
            </div>
            {errors.fullName && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <XCircle className="w-4 h-4" />
                {errors.fullName.message}
              </p>
            )}
          </div>

          {/* Intelligent College Selection */}
          <div className="space-y-2">
            
              
              
            <Controller
              name="collegeName"
              control={control}
              render={({ field }) => (
                <CollegeDropdown
                  value={field.value || ''}
                  onChange={field.onChange}
                  error={errors.collegeName?.message}
                />
              )}
            />
            {errors.collegeName && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <XCircle className="w-4 h-4" />
                {errors.collegeName.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700 font-medium">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email address"
                className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 bg-white/80"
                {...register('email')}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <XCircle className="w-4 h-4" />
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a strong password"
                className="pl-10 pr-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 bg-white/80"
                {...register('password')}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-12 px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-500" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-500" />
                )}
              </Button>
            </div>
            
            {/* Password Requirements */}
            {password && (
              <div className="space-y-2 mt-3 p-3 bg-gray-50 rounded-lg border">
                <p className="text-xs font-medium text-gray-700 mb-2">Password Requirements:</p>
                <div className="grid grid-cols-2 gap-2">
                  <div className={`flex items-center gap-1 text-xs ${passwordValidations.length ? 'text-green-600' : 'text-gray-500'}`}>
                    {passwordValidations.length ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                    6+ characters
                  </div>
                  <div className={`flex items-center gap-1 text-xs ${passwordValidations.uppercase ? 'text-green-600' : 'text-gray-500'}`}>
                    {passwordValidations.uppercase ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                    Uppercase letter
                  </div>
                  <div className={`flex items-center gap-1 text-xs ${passwordValidations.digit ? 'text-green-600' : 'text-gray-500'}`}>
                    {passwordValidations.digit ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                    Number
                  </div>
                  <div className={`flex items-center gap-1 text-xs ${passwordValidations.special ? 'text-green-600' : 'text-gray-500'}`}>
                    {passwordValidations.special ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                    Special character
                  </div>
                </div>
              </div>
            )}
            
            {errors.password && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <XCircle className="w-4 h-4" />
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">Confirm Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your password"
                className="pl-10 pr-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20 bg-white/80"
                {...register('confirmPassword')}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-12 px-3 py-2 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-500" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-500" />
                )}
              </Button>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <XCircle className="w-4 h-4" />
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]" 
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Creating Account...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Create Account
              </div>
            )}
          </Button>
        </form>

        <div className="text-center pt-2">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-600 hover:text-blue-800 font-semibold hover:underline transition-colors">
              Sign in here
            </Link>
          </p>
        </div>

        <div className="text-center pt-2">
          <p className="text-xs text-gray-500 leading-relaxed">
            By creating an account, you agree to our{' '}
            <Link href="/terms" className="text-blue-600 hover:underline">Terms of Service</Link>{' '}
            and{' '}
            <Link href="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
