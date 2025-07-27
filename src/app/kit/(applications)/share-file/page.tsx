'use client'
import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ClipboardCheck, FileText, Loader2, Save } from 'lucide-react'
import { toast } from 'sonner'
import { loader } from '@monaco-editor/react'
import { QRCodeCanvas } from 'qrcode.react'
import { saveFile } from '@/service/publicText/action'

loader.config({
  paths: {
    vs: '/monaco/vs',
  },
})

const Page = () => { 
  const [id, setId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [zipBase64, setZipBase64] = useState('')
  const [zipFile, setZipFile] = useState<File | null>(null)

  const handleSave = async () => {
    if (zipBase64.length > 0) {
      setIsLoading(true) 
     saveFile(zipBase64,zipFile?.name || '').then(id => {
      setId(id)
      toast.success('File saved!')
     }).catch(() => {
      toast.error('Error saving file')
     }).finally(() => {
      setIsLoading(false)
     })
    } else {
      toast.error('Please upload a file')
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
            <span className="text-xs font-medium text-gray-200">File Utility</span>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-blue-200 to-indigo-200 bg-clip-text text-transparent mb-1 tracking-tight">
            Share File
          </h1>
          <p className="text-xs text-gray-400">
            Upload and share your file easily
          </p>
        </div>
        {/* Main Card */}
        <Card className="bg-slate-900/90 border border-slate-800 shadow-lg rounded-lg">
          <CardHeader className="pb-2 flex flex-row items-center justify-between px-3 pt-3">
            <CardTitle className="flex items-center gap-2 text-base font-semibold text-gray-100">
              <span className="p-1 bg-gradient-to-r from-blue-700 to-indigo-800 rounded-md">
                <ClipboardCheck className="h-3.5 w-3.5 text-white" />
              </span>
              <span className="text-sm">Upload File</span>
            </CardTitle>
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
                <span className="text-[11px] text-gray-500 mt-0.5">Will expire in 8 hours</span>
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
                  {zipFile ? (
                    <div className="flex flex-col items-center justify-center w-full py-6 px-4 bg-gradient-to-br from-slate-900/80 to-indigo-900/80 border-2 border-dashed border-slate-700 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="w-5 h-5 text-blue-300" />
                        <span className="text-sm font-medium text-blue-200">{zipFile.name}</span>
                        <span className="text-xs text-gray-400 ml-2">
                          ({zipFile.size > 1024 * 1024
                            ? (zipFile.size / (1024 * 1024)).toFixed(2) + ' MB'
                            : (zipFile.size / 1024).toFixed(2) + ' KB'})
                        </span>
                        <button
                          className="ml-2 text-gray-500 hover:text-red-400 transition"
                          onClick={() => {
                            setZipFile(null); 
                            setZipBase64('');
                          }}
                          aria-label="Remove file"
                          type="button"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <Button
                        className="cursor-pointer h-8 text-xs bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-800 hover:to-indigo-900 text-white font-semibold transition-all duration-150"
                        onClick={handleSave}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Save className="h-3.5 w-3.5 mr-1" />
                            Upload & Create Link
                          </>
                        )}
                      </Button>
                    </div>
                  ) : (
                    <label
                      htmlFor="file-upload"
                      className="flex flex-col items-center justify-center w-full h-36 cursor-pointer bg-gradient-to-br from-slate-900/80 to-indigo-900/80 border-2 border-dashed border-slate-700 rounded-lg hover:bg-slate-800 transition group"
                    >
                      <svg
                        className="w-10 h-10 mb-2 text-blue-400 group-hover:text-blue-500 transition"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 16V4m0 0l-4 4m4-4l4 4M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M16 12l-4 4-4-4"
                        />
                      </svg>
                      <span className="text-sm text-blue-200 font-medium mb-1">
                        Click to upload ZIP file
                      </span>
                      <span className="text-xs text-gray-400">
                        Only <span className="font-semibold">.zip</span> files are allowed
                      </span>
                      <input
                        id="file-upload"
                        type="file"
                        accept=".zip,application/zip"
                        className="hidden"
                        onChange={e => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const maxSize = 7 * 1024 * 1024; // 7MB in bytes
                            if (file.size > maxSize) {
                              toast.error('File size exceeds 10MB limit');
                              return;
                            }
                            if (file.type === "application/zip" || file.name.endsWith('.zip')) { 
                              setZipFile(file);
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                setZipBase64(event.target?.result as string || '');
                              };
                              reader.readAsDataURL(file);
                            } else {
                              toast.error('Only ZIP files are allowed');
                            }
                          }
                        }}
                      />
                    </label>
                  )}
                </div>
                
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
                    <li>• Share or copy file instantly</li>
                    <li>• Download file instantly</li>
                    <li>• File will be automatically deleted after 8 hours</li>
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