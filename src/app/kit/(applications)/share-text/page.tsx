'use client'
import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { ClipboardCheck, FileText, Loader2, Share2, Code, Clock, Copy, Lock, Globe, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import Editor, { loader } from '@monaco-editor/react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { saveText } from '@/service/publicText/action'
import { QRCodeCanvas } from 'qrcode.react'
import { languages } from '@/app/t/[objectId]/ShowText'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/hooks/useAuth'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { useUserText } from './useUserText'; 
import Link from 'next/link'

loader.config({
  paths: {
    vs: '/monaco/vs',
  },
})

// Types
interface ShareTextState {
  text: string
  language: string
  id: number | null
  isLoading: boolean
  isPrivet: boolean
}


// Components
const LanguageSelector = ({ language, onLanguageChange }: { language: string; onLanguageChange: (lang: string) => void }) => (
  <Select value={language} onValueChange={onLanguageChange}>
    <SelectTrigger className="h-9 w-32 px-3 text-sm bg-slate-800/40 border border-slate-700/30 text-gray-300 rounded-lg">
      <SelectValue placeholder="Language" />
    </SelectTrigger>
    <SelectContent className="bg-slate-800 border-slate-700 text-gray-300 max-h-48">
      {languages.map((lang) => (
        <SelectItem
          key={lang.value}
          value={lang.value}
          className="text-sm px-3 py-2 hover:bg-slate-700"
        >
          {lang.label}
        </SelectItem>
      ))}
    </SelectContent>
  </Select>
)

const TextEditor = ({ text, language, onTextChange }: { text: string; language: string; onTextChange: (text: string) => void }) => (
  <div className="rounded-xl overflow-hidden border border-slate-700/30 bg-slate-800/20 backdrop-blur-sm">
    <Editor
      height="50vh"
      value={text}
      language={language}
      onChange={v => onTextChange(v || '')}
      theme="vs-dark"
      loading="Loading Monaco Editor..."
      options={{
        fontSize: 13,
        minimap: { enabled: true },
        lineNumbersMinChars: 2,
        padding: { top: 8, bottom: 8 },
        scrollbar: { alwaysConsumeMouseWheel: false, vertical: 'hidden', horizontal: 'hidden' },
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
)

const SaveButton = ({ onSave, isLoading }: { onSave: () => void; isLoading: boolean }) => (
  <Button
    onClick={onSave}
    className="w-full h-11 text-sm bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg transition-all duration-150"
    disabled={isLoading}
  >
    {isLoading ? (
      <>
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
        Saving...
      </>
    ) : (
      <>
        <Share2 className="h-4 w-4 mr-2" />
        Save & Create Link
      </>
    )}
  </Button>
)

const SuccessState = ({ id, onNewText }: { id: number; onNewText: () => void }) => {
  const getShareUrl = (id: number) => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/t/${id}`
    }
    return `/t/${id}`
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="w-full max-w-lg bg-slate-800/30 rounded-xl border border-slate-700/30 p-6 backdrop-blur-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-green-500/20 rounded-lg">
            <ClipboardCheck className="h-5 w-5 text-green-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-200">Text Saved Successfully</h3>
            <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
              <Clock className="h-3 w-3" />
              <span>Expires in 10 days</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-slate-900/50 rounded-lg border border-slate-700/30 p-3">
            <a
              href={`/t/${id}`}
              className="text-blue-400 hover:text-blue-300 text-sm font-mono break-all block"
              target="_blank"
              rel="noopener noreferrer"
            >
              {getShareUrl(id)}
            </a>
          </div>

          <div className="flex gap-3">
            <Button
              size="sm"
              className="h-9 px-4 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              onClick={() => {
                navigator.clipboard.writeText(getShareUrl(id))
                toast.success('Link copied!')
              }}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy Link
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-9 px-4 text-sm border-slate-600 text-gray-300 hover:bg-slate-700/50 rounded-lg"
              onClick={onNewText}
            >
              <FileText className="h-4 w-4 mr-2" />
              New Text
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 p-3 rounded-xl shadow-lg border border-slate-700">
        <QRCodeCanvas
          level="M"
          marginSize={1}
          bgColor="#0f172a" // slate-900
          fgColor="#f1f5f9" // slate-100
          size={220}
          value={getShareUrl(id)}
          className="rounded-lg"
        />
      </div>
    </div>
  )
}

const FeaturesSection = () => (
  <div className="flex justify-center mt-8">
    <div className="grid grid-cols-3 gap-6 max-w-lg">
      <div className="text-center">
        <div className="p-3 bg-slate-800/30 rounded-xl border border-slate-700/30 inline-block mb-3">
          <Share2 className="h-5 w-5 text-blue-400" />
        </div>
        <h4 className="text-sm font-medium text-gray-300 mb-1">Instant Share</h4>
        <p className="text-xs text-gray-500">Share with one click</p>
      </div>
      <div className="text-center">
        <div className="p-3 bg-slate-800/30 rounded-xl border border-slate-700/30 inline-block mb-3">
          <Code className="h-5 w-5 text-green-400" />
        </div>
        <h4 className="text-sm font-medium text-gray-300 mb-1">Code Support</h4>
        <p className="text-xs text-gray-500">Syntax highlighting</p>
      </div>
      <div className="text-center">
        <div className="p-3 bg-slate-800/30 rounded-xl border border-slate-700/30 inline-block mb-3">
          <Clock className="h-5 w-5 text-orange-400" />
        </div>
        <h4 className="text-sm font-medium text-gray-300 mb-1">Auto Delete</h4>
        <p className="text-xs text-gray-500">10-day expiration</p>
      </div>
    </div>
  </div>
)

const MyTextsPlaceholder = () => {
  const [importId, setImportId] = useState('');
  const {
    data,
    total,
    page,
    limit,
    loading,
    error,
    setPage,
    importText,
    togglePrivet,
    deleteText,
  } = useUserText();

  const handleImport = async () => {
    const id = parseInt(importId, 10);
    if (!id) return;
    await importText(id);
    setImportId('');
  };

  const handleDelete = async (id: number) => {
    if(confirm("Are you sure to delete?")){
      const ok = await deleteText(id);
      if (ok) {
        toast.success('Text deleted');
      } else {
        toast.error('Failed to delete text');
      }
    }
  };

  return (
    <Card className="py-6 sm:py-8 bg-slate-900 border border-slate-800 rounded-xl w-full">
      <CardHeader className="w-full">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mb-4 w-full">
          <div className="flex items-center bg-slate-800 border border-slate-700 rounded-md overflow-hidden h-8 w-full sm:w-60">
            <input
              type="text"
              value={importId}
              onChange={e => {
                const val = e.target.value.trim();
                let id = val;
                const match = val.match(/(\d+)(?!.*\d)/);
                if (match) id = match[1];
                setImportId(id);
              }}
              placeholder="Paste import link or code"
              className="flex-1 h-full px-2 text-xs bg-transparent text-gray-200 focus:outline-none focus:ring-0 border-0"
            />
            <Button
              variant="secondary"
              size="sm"
              className="h-8 px-3 text-xs font-medium bg-slate-700 text-gray-200 border-0 rounded-none rounded-r-md hover:bg-slate-600 transition-all"
              onClick={handleImport}
              disabled={loading || !importId}
            >
              Import
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="w-full">
        {error && <div className="text-xs text-red-400 mb-2">{error}</div>}
        {loading ? (
          <div className="flex justify-center items-center py-8"><Loader2 className="animate-spin w-5 h-5 text-gray-400" /></div>
        ) : data.length === 0 ? (
          <div className="text-center text-xs text-gray-400 py-8">No texts found.</div>
        ) : (
          <div className="space-y-2">
            {data.map(text => (
              <div
                key={text.id}
                className="flex items-center justify-between bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-gray-200 cursor-pointer hover:bg-slate-700 transition"
              >
                <Link href={"/t/" + text.id}
                  target='_blank' className="flex-1 truncate">{text.text.slice(0, 60) || <span className="italic text-gray-500">(empty)</span>}</Link>
                <div className="flex items-center gap-2 ml-2" onClick={e => e.stopPropagation()}>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 p-0 cursor-pointer"
                    title="Toggle Privacy"
                    onClick={() => togglePrivet(text.id)}
                  >
                    {text.isPublic ? (
                      <Globe />
                    ) : (
                      <Lock />
                    )}
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 p-0 cursor-pointer text-red-400 hover:bg-red-900/30"
                    title="Delete Text"
                    onClick={() => handleDelete(text.id)}
                  >
                    <Trash2 />
                  </Button>
                </div>
              </div>
            ))}
            <div className="flex justify-between items-center pt-2">
              <Button size="sm" className="h-7 px-2 text-xs" disabled={page <= 1} onClick={() => setPage(page - 1)}>Prev</Button>
              <span className="text-xs text-gray-400">Page {page} / {Math.ceil(total / limit) || 1}</span>
              <Button size="sm" className="h-7 px-2 text-xs" disabled={page >= Math.ceil(total / limit)} onClick={() => setPage(page + 1)}>Next</Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Main Component
const Page = () => {
  const [state, setState] = useState<ShareTextState>({
    text: '',
    language: 'plaintext',
    id: null,
    isLoading: false,
    isPrivet: false
  })

  const auth = useAuth()

  const handleSave = async () => {
    if (state.text.length > 0) {
      setState(prev => ({ ...prev, isLoading: true }))
      const id = await saveText({
        language: state.language,
        text: state.text,
        isPublic: !state.isPrivet,
        userId: auth.currentUser?._id
      })
      if(id>0){
        setState(prev => ({ ...prev, id, isLoading: false }))
        toast.success('Text saved!')
      }else{
        toast.error("Failed to save Text")
      }
    } else {
      toast.error('Please enter some text')
    }
  }

  const handleNewText = () => {
    setState(prev => ({ ...prev, text: '', id: null }))
  }

  const handleLanguageChange = (language: string) => {
    setState(prev => ({ ...prev, language }))
  }

  const handleTextChange = (text: string) => {
    setState(prev => ({ ...prev, text }))
  }
  useEffect(() => {
    if (auth.isAuthenticated) {
      setState((p) => ({ ...p, isPrivet: true }))
    }
  }, [auth.isAuthenticated])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex items-start justify-center py-4">
      <div className="w-full max-w-5xl mx-auto px-4">
        {/* Tabs Navigation */}
        <div className="flex justify-center mb-4">
          <Tabs defaultValue="shareText" className="w-full max-w-4xl">
            <TabsList className="h-10 bg-slate-800/40 border border-slate-700/30 rounded-lg p-1">
              <TabsTrigger value="shareText" className="h-8 px-6 text-sm data-[state=active]:bg-slate-700/60 data-[state=active]:text-white">
                <Share2 className="h-4 w-4 mr-2" />
                Share Text
              </TabsTrigger>
              {auth.isAuthenticated && (
                <TabsTrigger value="myText" className="h-8 px-6 text-sm data-[state=active]:bg-slate-700/60 data-[state=active]:text-white">
                  <FileText className="h-4 w-4 mr-2" />
                  My Texts
                </TabsTrigger>
              )}
            </TabsList>

            {/* Main Content */}
            <div className="mt-6">
              <TabsContent value="shareText" className="mt-0">
                {state.id ? (
                  <SuccessState id={state.id} onNewText={handleNewText} />
                ) : (
                  <div className="space-y-4">
                    <div className='flex items-center justify-end'>

                      {auth.isAuthenticated && <Button
                        variant="ghost"
                        size="icon"
                        className={cn("mr-2 w-24 min-w-[5.5rem] max-w-[6.5rem] text-gray-400 h-8 px-2 py-1 rounded-md border border-slate-700/30 flex items-center justify-center transition-all duration-150", {
                          "border-amber-500 text-white": state.isPrivet
                        })}
                        onClick={() => {
                          setState(prev => ({ ...prev, isPrivet: !prev.isPrivet }))
                        }}
                        type="button"
                        aria-pressed={state.isPrivet}
                        title={state.isPrivet ? "Private" : "Public"}
                      >
                        <span className="flex items-center gap-1 text-xs">
                          <Lock className="w-3.5 h-3.5 mr-1" />
                          Private
                        </span>

                      </Button>}
                      <LanguageSelector language={state.language} onLanguageChange={handleLanguageChange} />
                    </div>
                    <TextEditor text={state.text} language={state.language} onTextChange={handleTextChange} />
                    <SaveButton onSave={handleSave} isLoading={state.isLoading} />
                  </div>
                )}
              </TabsContent>

              <TabsContent value="myText" className="mt-0">
                {auth.currentUser && <MyTextsPlaceholder />}
              </TabsContent>
            </div>
          </Tabs>
        </div>

        <FeaturesSection />
      </div>
    </div>
  )
}

export default Page