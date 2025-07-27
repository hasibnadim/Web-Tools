'use client'
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ClipboardCheck, FileText, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import Editor, { loader } from '@monaco-editor/react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { saveText } from '@/service/publicText/action' 
import { QRCodeCanvas } from 'qrcode.react'
import { languages } from '@/app/t/[objectId]/ShowText'

loader.config({
  paths: {
    vs: '/monaco/vs',
  },
})

const Page = () => {
  const [text, setText] = useState('')
  const [language, setLanguage] = useState('plaintext')
  const [id, setId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSave = async () => {
    if (text.length > 0) {
      setIsLoading(true)
      const id = await saveText(text, language)
      setId(id)
      toast.success('Text saved!')
      setIsLoading(false)
    } else {
      toast.error('Please enter some text')
    }
  }

  // For SSR/CSR compatibility
  const getShareUrl = (id: number) => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/t/${id}`
    }
    return `/t/${id}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900/90 flex items-center justify-center py-2">
      <div className="w-full max-w-6xl mx-auto px-2">
        {/* Header */}
        <div className="flex flex-col items-center mb-4">
          <div className="flex items-center gap-2 bg-slate-800/80 rounded-full px-3 py-1 mb-2 shadow-sm border border-slate-700">
            <FileText className="h-4 w-4 text-blue-300" />
            <span className="text-xs font-medium text-gray-200">Text Utility</span>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-blue-200 to-indigo-200 bg-clip-text text-transparent mb-1 tracking-tight">
            Share Text
          </h1>
          <p className="text-xs text-gray-400">
            Paste, edit, and save your text for easy sharing or copying
          </p>
        </div>
        {/* Main Card */}
        <Card className="bg-slate-900/90 border border-slate-800 shadow-lg rounded-lg">
          <CardHeader className="pb-2 flex flex-row items-center justify-between px-3 pt-3">
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-gray-100">
              <span className="p-1 bg-gradient-to-r from-blue-700 to-indigo-800 rounded-md">
                <ClipboardCheck className="h-3.5 w-3.5 text-white" />
              </span>
              <span className="text-sm">Share Text</span>
            </CardTitle>
            <div>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="h-7 min-w-[110px] px-2 text-xs bg-slate-900 border border-slate-700 text-gray-200">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700 text-gray-200 max-h-48 overflow-y-auto">
                  {languages.map((language) => (
                    <SelectItem
                      key={language.value}
                      value={language.value}
                      className="text-xs px-2 py-1 hover:bg-slate-800"
                    >
                      {language.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="p-3 pt-1">
            {id ? (
              <div className="flex flex-col items-center gap-1 text-xs text-gray-200 bg-slate-900 rounded-md border border-slate-800 px-4 py-3 shadow-sm">
                <span className="mb-0.5 text-gray-400">Your text is saved at:</span>
                <a
                  href={`/t/${id}`}
                  className="text-blue-400 hover:underline break-all font-mono text-[13px] px-2 py-1 rounded bg-slate-800 border border-slate-700 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ wordBreak: 'break-all' }}
                >
                  {getShareUrl(id)}
                </a>
                <span className="text-[11px] text-gray-500 mt-0.5">Will expire in 10 days</span>
                <div className="flex gap-1 mt-2">
                  <Button
                    size="sm"
                    className="h-6 px-2 text-xs bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-800 hover:to-indigo-900 text-white rounded-sm shadow-none"
                    onClick={() => {
                      navigator.clipboard.writeText(getShareUrl(id))
                      toast.success('Link copied to clipboard')
                    }}
                  >
                    <ClipboardCheck className="h-3 w-3 mr-1" />
                    Copy Link
                  </Button>
                  <Button
                    size="sm"
                    className="h-6 px-2 text-xs bg-slate-900 border border-slate-700 text-gray-200 rounded-sm shadow-none"
                    onClick={() => {
                      setText('')
                      setId(null)
                    }}
                  >
                    <FileText className="h-3 w-3 mr-1" />
                    New Text
                  </Button>
                </div>
                <QRCodeCanvas
                  level={'M'}
                  marginSize={1}
                  bgColor={'#18181b'}
                  fgColor={'#e0e7ef'}
                  size={300}
                  id="qrcode"
                  value={getShareUrl(id)}
                  title={getShareUrl(id)}
                  className="rounded-lg shadow-lg"
                />
              </div>
            ) : (
              <>
                <div className="rounded-md overflow-hidden border border-slate-800 mb-2">
                  <Editor
                    height="50vh"
                    value={text}
                    language={language}
                    onChange={v => setText(v || '')}
                    theme="vs-dark"
                    loading="Loading Monaco Editor..."
                    options={{
                      fontSize: 13,
                      minimap: { enabled: true },
                      lineNumbersMinChars: 2,
                      padding: { top: 8, bottom: 8 },
                      scrollbar: { vertical: 'hidden', horizontal: 'hidden' },
                      scrollBeyondLastLine: false,
                      overviewRulerLanes: 0,
                      renderLineHighlight: 'none',
                      lineDecorationsWidth: 2,
                      lineNumbers: 'on',
                      wordWrap: 'on',
                      folding: false,
                      tabSize: 2,
                      automaticLayout: true,
                    }}
                  />
                </div>
                <Button
                  onClick={handleSave}
                  className="w-full h-8 text-xs bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-800 hover:to-indigo-900 text-white font-semibold transition-all duration-150"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <ClipboardCheck className="h-3.5 w-3.5 mr-1" />
                      Save & Create Link
                    </>
                  )}
                </Button>
              </>
            )}
          </CardContent>
        </Card>
        {/* Info */}
        <div className="flex justify-center mt-3">
          <Card className="bg-slate-800/80 border border-slate-700 shadow-none rounded-md w-full max-w-xs">
            <CardContent className="p-2">
              <div className="flex items-start gap-2">
                <ClipboardCheck className="h-4 w-4 text-green-400 mt-0.5" />
                <div>
                  <h3 className="text-xs font-semibold text-gray-100 mb-0.5">Features</h3>
                  <ul className="text-xs text-gray-400 space-y-0.5">
                    <li>• Share or copy text instantly</li>
                    <li>• Paste, edit, and save code or notes</li>
                    <li>• Text will be automatically deleted after 10 days</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Page