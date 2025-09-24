'use client'

/**
 * Enhanced Markdown Editor with Image Upload
 *export export function MarkdownEditorWithImages({ 
  value = '', 
  onChange, 
  placeholder = "Write your blog post content in Markdown...",
  minHeight = "400px",
  className,
  featuredImageUrl,
  onFeaturedImageChange
}: MarkdownEditorWithImagesProps) {n MarkdownEditorWithImages({ 
  value = '', 
  onChange, 
  placeholder = "Write your blog post content in Markdown...",
  minHeight = "400px",
  className,
  featuredImageUrl,
  onFeaturedImageChange
}: MarkdownEditorWithImagesProps) {comprehensive markdown editor component with integrated image upload
 * functionality. Features include:
 * 
 * - Rich markdown editing with toolbar
 * - Live preview with syntax highlighting
 * - Drag-and-drop image upload
 * - Image management panel
 * - Progress tracking for uploads
 * - One-click image insertion into markdown
 * - Copy image markdown to clipboard
 * - Dual upload system (direct R2 + server proxy fallback)
 */

import { useState, useCallback, useRef, useEffect } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useDropzone } from 'react-dropzone'
import { useBlogImageUpload, BlogImage } from '@/hooks/useBlogImageUpload'
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
  Image as ImageIcon,
  Table,
  Heading1,
  Heading2,
  Heading3,
  Upload,
  X,
  Check,
  AlertCircle,
  Copy,
  Trash2,
  ImagePlus
} from 'lucide-react'

interface MarkdownEditorWithImagesProps {
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  minHeight?: string
  className?: string
  // Featured image props
  featuredImageUrl?: string
  onFeaturedImageChange?: (imageUrl: string | null) => void
}

export function MarkdownEditorWithImages({ 
  value = '', 
  onChange, 
  placeholder = "Write your blog post content in Markdown...",
  minHeight = "400px",
  className = "",
  featuredImageUrl,
  onFeaturedImageChange
}: MarkdownEditorWithImagesProps) {
  const [activeTab, setActiveTab] = useState('edit')
  const [showImagePanel, setShowImagePanel] = useState(false)
  const [featuredImageUploading, setFeaturedImageUploading] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const {
    images,
    isUploading,
    uploadImage,
    uploadMultipleImages,
    removeImage,
    getCompletedImages,
    getFailedImages,
  } = useBlogImageUpload()

  // Separate hook for featured image upload
  const {
    uploadImage: uploadFeaturedImage,
  } = useBlogImageUpload({
    onSuccess: (image) => {
      onFeaturedImageChange?.(image.publicUrl)
      setFeaturedImageUploading(false)
    },
    onError: () => {
      setFeaturedImageUploading(false)
    },
  })

  const insertMarkdown = useCallback((before: string, after: string = '') => {
    const textarea = textareaRef.current
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

  const insertImageMarkdown = useCallback((image: BlogImage, altText: string = '') => {
    const markdownImage = `![${altText || image.fileName}](${image.publicUrl})`
    const textarea = textareaRef.current
    
    if (!textarea) {
      // Fallback: append to end
      onChange(value + '\n\n' + markdownImage)
      return
    }

    const currentValue = value || ''
    const cursorPosition = textarea.selectionStart
    const newValue = currentValue.substring(0, cursorPosition) + 
                    markdownImage + 
                    currentValue.substring(cursorPosition)
    
    onChange(newValue)
    
    // Reset cursor position after the inserted markdown
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(
        cursorPosition + markdownImage.length, 
        cursorPosition + markdownImage.length
      )
    }, 0)
  }, [value, onChange])

  const copyImageMarkdown = useCallback((image: BlogImage) => {
    const markdownText = `![${image.fileName}](${image.publicUrl})`
    navigator.clipboard.writeText(markdownText)
  }, [])

  const handleFeaturedImageUpload = useCallback(async (file: File) => {
    setFeaturedImageUploading(true)
    await uploadFeaturedImage(file)
  }, [uploadFeaturedImage])

  const removeFeaturedImage = useCallback(() => {
    onFeaturedImageChange?.(null)
  }, [onFeaturedImageChange])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const imageFiles = acceptedFiles.filter(file => file.type.startsWith('image/'))
    if (imageFiles.length > 0) {
      uploadMultipleImages(imageFiles)
      setShowImagePanel(true)
    }
  }, [uploadMultipleImages])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    noClick: true,
    noKeyboard: true,
  })

  const markdownButtons = [
    { icon: Heading1, label: 'H1', action: () => insertMarkdown('# ') },
    { icon: Heading2, label: 'H2', action: () => insertMarkdown('## ') },
    { icon: Heading3, label: 'H3', action: () => insertMarkdown('### ') },
    { icon: Bold, label: 'Bold', action: () => insertMarkdown('**', '**') },
    { icon: Italic, label: 'Italic', action: () => insertMarkdown('*', '*') },
    { icon: Link, label: 'Link', action: () => insertMarkdown('[Link Text](', ')') },
    { icon: ImageIcon, label: 'Image', action: () => insertMarkdown('![Alt Text](', ')') },
    { icon: Code, label: 'Code', action: () => insertMarkdown('`', '`') },
    { icon: Quote, label: 'Quote', action: () => insertMarkdown('> ') },
    { icon: List, label: 'List', action: () => insertMarkdown('- ') },
    { icon: ListOrdered, label: 'Ordered List', action: () => insertMarkdown('1. ') },
    { icon: Table, label: 'Table', action: () => insertMarkdown('\n| Column 1 | Column 2 |\n|----------|----------|\n| Cell 1   | Cell 2   |\n') }
  ]

  const addCodeBlock = () => {
    insertMarkdown('\n```javascript\n', '\n```\n')
  }

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (files.length > 0) {
      uploadMultipleImages(files)
      setShowImagePanel(true)
    }
    // Reset input
    event.target.value = ''
  }

  const completedImages = getCompletedImages()
  const failedImages = getFailedImages()
  const hasImages = images.length > 0

  return (
    <div className={`w-full ${className}`}>
      {/* Featured Image Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            Featured Image
          </CardTitle>
        </CardHeader>
        <CardContent>
          {featuredImageUrl ? (
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={featuredImageUrl}
                  alt="Featured image"
                  className="w-full max-w-md h-48 object-cover rounded-lg border"
                />
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={removeFeaturedImage}
                  className="absolute top-2 right-2"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                This image will be used as the blog post banner
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                <input
                  type="file"
                  id="featured-image"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      handleFeaturedImageUpload(file)
                    }
                  }}
                  className="hidden"
                />
                <label htmlFor="featured-image" className="cursor-pointer">
                  <div className="flex flex-col items-center gap-3">
                    <div className="p-3 rounded-full bg-muted">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-medium">Upload Featured Image</p>
                      <p className="text-sm text-muted-foreground">
                        Choose an image for your blog post banner
                      </p>
                    </div>
                  </div>
                </label>
              </div>
              {featuredImageUploading && (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  <span className="text-sm text-muted-foreground">Uploading featured image...</span>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

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
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowImagePanel(!showImagePanel)}
              className="flex items-center gap-2"
            >
              <ImagePlus className="w-4 h-4" />
              Images
              {hasImages && (
                <Badge variant="secondary" className="ml-1">
                  {completedImages.length}
                </Badge>
              )}
            </Button>
            <Badge variant="outline" className="text-xs">
              <Type className="w-3 h-3 mr-1" />
              Markdown + Images
            </Badge>
          </div>
        </div>

        <TabsContent value="edit" className="space-y-4">
          {/* Image Management Panel */}
          {showImagePanel && (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" />
                    Image Manager
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowImagePanel(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Upload Area */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileInputChange}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="w-8 h-8 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          Click to upload images
                        </p>
                        <p className="text-xs text-gray-500">
                          Or drag and drop images anywhere in the editor
                        </p>
                      </div>
                    </div>
                  </label>
                </div>

                {/* Error Messages */}
                {failedImages.length > 0 && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {failedImages.length} image(s) failed to upload. Check file size and format.
                    </AlertDescription>
                  </Alert>
                )}

                {/* Image List */}
                {images.length > 0 && (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {images.map((image) => (
                      <div
                        key={image.id}
                        className="flex items-center gap-3 p-2 border rounded-lg"
                      >
                        {/* Image Preview */}
                        <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                          {image.status === 'completed' ? (
                            <img
                              src={image.publicUrl}
                              alt={image.fileName}
                              className="w-full h-full object-cover rounded"
                            />
                          ) : (
                            <ImageIcon className="w-6 h-6 text-gray-400" />
                          )}
                        </div>

                        {/* Image Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {image.fileName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {Math.round(image.fileSize / 1024)} KB
                          </p>
                          
                          {/* Progress Bar */}
                          {image.status === 'uploading' && (
                            <Progress value={image.progress} className="w-full h-2 mt-1" />
                          )}
                          
                          {/* Error Message */}
                          {image.status === 'error' && (
                            <p className="text-xs text-red-600 mt-1">{image.error}</p>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-1 flex-shrink-0">
                          {image.status === 'completed' && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => insertImageMarkdown(image)}
                                title="Insert in editor"
                              >
                                <Edit className="w-3 h-3" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => copyImageMarkdown(image)}
                                title="Copy markdown"
                              >
                                <Copy className="w-3 h-3" />
                              </Button>
                            </>
                          )}
                          
                          {image.status === 'uploading' && (
                            <div className="flex items-center gap-1 text-blue-600">
                              <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                              <span className="text-xs">{image.progress}%</span>
                            </div>
                          )}
                          
                          {image.status === 'error' && (
                            <AlertCircle className="w-4 h-4 text-red-500" />
                          )}
                          
                          {image.status === 'completed' && (
                            <Check className="w-4 h-4 text-green-500" />
                          )}
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeImage(image.id)}
                            title="Remove image"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

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
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowImagePanel(!showImagePanel)}
                  className="h-8 px-2 text-xs"
                  title="Manage Images"
                >
                  <ImagePlus className="w-3 h-3 mr-1" />
                  Images
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Editor with Drag & Drop */}
          <div className="relative" {...getRootProps()}>
            <input {...getInputProps()} />
            <Textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className={`markdown-textarea font-mono text-sm resize-none ${className} ${
                isDragActive ? 'border-blue-500 bg-blue-50' : ''
              }`}
              style={{ minHeight }}
            />
            
            {/* Drag Overlay */}
            {isDragActive && (
              <div className="absolute inset-0 bg-blue-500 bg-opacity-10 border-2 border-blue-500 border-dashed rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Upload className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                  <p className="text-blue-700 font-medium">Drop images here to upload</p>
                </div>
              </div>
            )}
            
            <div className="absolute bottom-2 right-2 text-xs text-gray-400 bg-white px-2 py-1 rounded">
              {(value || '').length} characters
            </div>
          </div>

          {/* Upload Status */}
          {isUploading && (
            <Alert>
              <Upload className="h-4 w-4" />
              <AlertDescription>
                Uploading images... Please wait.
              </AlertDescription>
            </Alert>
          )}

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
                    ![alt](url)<br />
                    <span className="text-blue-600">+ Drag & drop supported</span>
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