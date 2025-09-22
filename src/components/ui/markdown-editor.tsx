'use client'

import { useState, useCallback } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { 
  Eye, 
  Edit, 
  Type, 
  Code, 
  Bold, 
  Italic, 
  Link, 
  List, 
  ListOrdered,
  Quote,
  Image,
  Table,
  Heading1,
  Heading2,
  Heading3
} from 'lucide-react'

interface MarkdownEditorProps {
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  minHeight?: string
  className?: string
}

export function MarkdownEditor({ 
  value = '', 
  onChange, 
  placeholder = "Write your blog post content in Markdown...",
  minHeight = "400px",
  className = ""
}: MarkdownEditorProps) {
  const [activeTab, setActiveTab] = useState('edit')

  const insertMarkdown = useCallback((before: string, after: string = '') => {
    const textarea = document.querySelector('.markdown-textarea') as HTMLTextAreaElement
    if (!textarea) return

    const currentValue = value || ''
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = currentValue.substring(start, end)
    const newValue = currentValue.substring(0, start) + before + selectedText + after + currentValue.substring(end)
    
    onChange(newValue)
    
    // Reset cursor position
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length)
    }, 0)
  }, [value, onChange])

  const markdownButtons = [
    { icon: Heading1, label: 'H1', action: () => insertMarkdown('# ') },
    { icon: Heading2, label: 'H2', action: () => insertMarkdown('## ') },
    { icon: Heading3, label: 'H3', action: () => insertMarkdown('### ') },
    { icon: Bold, label: 'Bold', action: () => insertMarkdown('**', '**') },
    { icon: Italic, label: 'Italic', action: () => insertMarkdown('*', '*') },
    { icon: Link, label: 'Link', action: () => insertMarkdown('[Link Text](', ')') },
    { icon: Image, label: 'Image', action: () => insertMarkdown('![Alt Text](', ')') },
    { icon: Code, label: 'Code', action: () => insertMarkdown('`', '`') },
    { icon: Quote, label: 'Quote', action: () => insertMarkdown('> ') },
    { icon: List, label: 'List', action: () => insertMarkdown('- ') },
    { icon: ListOrdered, label: 'Ordered List', action: () => insertMarkdown('1. ') },
    { icon: Table, label: 'Table', action: () => insertMarkdown('\n| Column 1 | Column 2 |\n|----------|----------|\n| Cell 1   | Cell 2   |\n') }
  ]

  const addCodeBlock = () => {
    insertMarkdown('\n```javascript\n', '\n```\n')
  }

  return (
    <div className={`w-full ${className}`}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex items-center justify-between mb-4">
          <TabsList className="grid w-fit grid-cols-2">
            <TabsTrigger value="edit" className="flex items-center gap-2">
              <Edit className="w-4 h-4" />
              Edit
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Preview
            </TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              <Type className="w-3 h-3 mr-1" />
              Markdown Supported
            </Badge>
          </div>
        </div>

        <TabsContent value="edit" className="space-y-4">
          {/* Markdown Toolbar */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-700">Formatting Toolbar</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-wrap gap-1">
                {markdownButtons.map((button, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={button.action}
                    className="h-8 px-2 text-xs"
                    title={button.label}
                  >
                    <button.icon className="w-3 h-3" />
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addCodeBlock}
                  className="h-8 px-2 text-xs"
                  title="Code Block"
                >
                  <Code className="w-3 h-3 mr-1" />
                  Block
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Editor */}
          <div className="relative">
            <Textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className={`markdown-textarea font-mono text-sm resize-none ${className}`}
              style={{ minHeight }}
            />
            <div className="absolute bottom-2 right-2 text-xs text-gray-400 bg-white px-2 py-1 rounded">
              {(value || '').length} characters
            </div>
          </div>

          {/* Markdown Help */}
          <Card className="bg-gray-50/50">
            <CardContent className="pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs text-gray-600">
                <div>
                  <strong className="text-gray-800">Headers:</strong>
                  <div className="font-mono mt-1">
                    # H1<br />
                    ## H2<br />
                    ### H3
                  </div>
                </div>
                <div>
                  <strong className="text-gray-800">Text:</strong>
                  <div className="font-mono mt-1">
                    **bold**<br />
                    *italic*<br />
                    `code`
                  </div>
                </div>
                <div>
                  <strong className="text-gray-800">Lists:</strong>
                  <div className="font-mono mt-1">
                    - Bullet<br />
                    1. Numbered<br />
                    {'>'} Quote
                  </div>
                </div>
                <div>
                  <strong className="text-gray-800">Links:</strong>
                  <div className="font-mono mt-1">
                    [text](url)
                  </div>
                </div>
                <div>
                  <strong className="text-gray-800">Images:</strong>
                  <div className="font-mono mt-1">
                    ![alt](url)
                  </div>
                </div>
                <div>
                  <strong className="text-gray-800">Code Block:</strong>
                  <div className="font-mono mt-1">
                    ```language<br />
                    code<br />
                    ```
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-4">
          <Card style={{ minHeight }}>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Eye className="w-4 h-4" />
                Live Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              {value ? (
                <div className="prose prose-sm max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h1: ({ children }) => (
                        <h1 className="text-2xl font-bold text-gray-900 mb-4 mt-6 first:mt-0 border-b border-gray-200 pb-2">
                          {children}
                        </h1>
                      ),
                      h2: ({ children }) => (
                        <h2 className="text-xl font-bold text-gray-800 mb-3 mt-5 first:mt-0">
                          {children}
                        </h2>
                      ),
                      h3: ({ children }) => (
                        <h3 className="text-lg font-semibold text-gray-800 mb-2 mt-4 first:mt-0">
                          {children}
                        </h3>
                      ),
                      p: ({ children }) => (
                        <p className="text-gray-700 mb-4 leading-relaxed">
                          {children}
                        </p>
                      ),
                      ul: ({ children }) => (
                        <ul className="list-disc list-inside mb-4 space-y-1 text-gray-700">
                          {children}
                        </ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="list-decimal list-inside mb-4 space-y-1 text-gray-700">
                          {children}
                        </ol>
                      ),
                      li: ({ children }) => (
                        <li className="mb-1">{children}</li>
                      ),
                      blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-blue-500 pl-4 py-2 mb-4 bg-blue-50 text-gray-700 italic">
                          {children}
                        </blockquote>
                      ),
                      code: ({ children, className }) => {
                        const isBlock = className?.includes('language-')
                        if (isBlock) {
                          return (
                            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-4">
                              <code className={className}>{children}</code>
                            </pre>
                          )
                        }
                        return (
                          <code className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-sm font-mono">
                            {children}
                          </code>
                        )
                      },
                      a: ({ children, href }) => (
                        <a 
                          href={href} 
                          className="text-blue-600 hover:text-blue-800 underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {children}
                        </a>
                      ),
                      img: ({ src, alt }) => (
                        <img 
                          src={src} 
                          alt={alt} 
                          className="max-w-full h-auto rounded-lg shadow-md mb-4"
                        />
                      ),
                      table: ({ children }) => (
                        <div className="overflow-x-auto mb-4">
                          <table className="min-w-full border border-gray-300 rounded-lg">
                            {children}
                          </table>
                        </div>
                      ),
                      th: ({ children }) => (
                        <th className="border border-gray-300 px-4 py-2 bg-gray-100 font-semibold text-left">
                          {children}
                        </th>
                      ),
                      td: ({ children }) => (
                        <td className="border border-gray-300 px-4 py-2">
                          {children}
                        </td>
                      ),
                    }}
                  >
                    {value}
                  </ReactMarkdown>
                </div>
              ) : (
                <div className="text-gray-400 italic py-8 text-center">
                  Start writing in the Edit tab to see a live preview here...
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}