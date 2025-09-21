'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface MarkdownRendererProps {
  content: string
  className?: string
}

export function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  return (
    <div className={`prose prose-lg max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 mt-8 first:mt-0 leading-tight border-b border-gray-200 pb-4">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-5 mt-8 first:mt-0 leading-tight">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 mt-6 first:mt-0 leading-tight">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 mt-5 first:mt-0">
              {children}
            </h4>
          ),
          h5: ({ children }) => (
            <h5 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 mt-4 first:mt-0">
              {children}
            </h5>
          ),
          h6: ({ children }) => (
            <h6 className="text-sm sm:text-base font-semibold text-gray-800 mb-2 mt-4 first:mt-0">
              {children}
            </h6>
          ),
          p: ({ children }) => (
            <p className="text-gray-700 mb-6 leading-relaxed text-base sm:text-lg">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-outside mb-6 space-y-2 text-gray-700 pl-6">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-outside mb-6 space-y-2 text-gray-700 pl-6">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="mb-1 text-base sm:text-lg leading-relaxed">{children}</li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-blue-500 pl-6 py-4 mb-6 bg-gradient-to-r from-blue-50 to-transparent text-gray-700 italic rounded-r-lg">
              <div className="text-base sm:text-lg leading-relaxed">
                {children}
              </div>
            </blockquote>
          ),
          code: ({ children, className }) => {
            const match = /language-(\w+)/.exec(className || '')
            const language = match ? match[1] : ''
            
            if (language) {
              return (
                <div className="mb-6 rounded-lg overflow-hidden shadow-lg bg-gray-900">
                  <div className="bg-gray-800 text-gray-200 px-4 py-2 text-sm font-medium border-b border-gray-700">
                    {language}
                  </div>
                  <pre className="p-6 text-gray-100 overflow-x-auto">
                    <code className="text-sm font-mono leading-relaxed">
                      {String(children).replace(/\n$/, '')}
                    </code>
                  </pre>
                </div>
              )
            }
            
            return (
              <code className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono font-medium">
                {children}
              </code>
            )
          },
          pre: ({ children }) => (
            <div className="mb-6">
              {children}
            </div>
          ),
          a: ({ children, href }) => (
            <a 
              href={href} 
              className="text-blue-600 hover:text-blue-800 underline decoration-2 underline-offset-2 hover:decoration-blue-800 transition-colors duration-200 font-medium"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          img: ({ src, alt }) => (
            <div className="mb-8">
              <img 
                src={src} 
                alt={alt} 
                className="max-w-full h-auto rounded-xl shadow-lg mx-auto"
              />
              {alt && (
                <p className="text-center text-sm text-gray-500 mt-2 italic">
                  {alt}
                </p>
              )}
            </div>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto mb-8 rounded-lg shadow-md">
              <table className="min-w-full border-collapse bg-white">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-gray-50 border-b border-gray-200">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-gray-200">
              {children}
            </tbody>
          ),
          th: ({ children }) => (
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 border-r border-gray-200 last:border-r-0">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-6 py-4 text-sm text-gray-700 border-r border-gray-200 last:border-r-0">
              {children}
            </td>
          ),
          hr: () => (
            <hr className="my-8 border-0 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
          ),
          strong: ({ children }) => (
            <strong className="font-bold text-gray-900">
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className="italic text-gray-800">
              {children}
            </em>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}