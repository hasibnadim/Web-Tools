'use client'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Editor, loader } from '@monaco-editor/react'
import React, { useState } from 'react'
loader.config({
    paths: {
        vs: '/monaco/vs',
    },
})
import { Maximize2, Minimize2 } from 'lucide-react'

export const languages = [
    { label: 'Plain Text', value: 'plaintext' },
    { label: 'TypeScript', value: 'typescript' },
    { label: 'JavaScript', value: 'javascript' },
    { label: 'CSS', value: 'css' },
    { label: 'LESS', value: 'less' },
    { label: 'SCSS', value: 'scss' },
    { label: 'JSON', value: 'json' },
    { label: 'HTML', value: 'html' },
    { label: 'XML', value: 'xml' },
    { label: 'PHP', value: 'php' },
    { label: 'C#', value: 'csharp' },
    { label: 'C++', value: 'cpp' },
    { label: 'Razor', value: 'razor' },
    { label: 'Markdown', value: 'markdown' },
    { label: 'Diff', value: 'diff' },
    { label: 'Java', value: 'java' },
    { label: 'VB', value: 'vb' },
    { label: 'CoffeeScript', value: 'coffeescript' },
    { label: 'Handlebars', value: 'handlebars' },
    { label: 'Batch', value: 'bat' },
    { label: 'Pug', value: 'pug' },
    { label: 'F#', value: 'fsharp' },
    { label: 'Lua', value: 'lua' },
    { label: 'Powershell', value: 'powershell' },
    { label: 'Python', value: 'python' },
    { label: 'Ruby', value: 'ruby' },
    { label: 'SASS', value: 'sass' },
    { label: 'R', value: 'r' },
    { label: 'Objective-C', value: 'objective-c' },
]

interface ShowTextProps {
    text: string
    language: string
}
const ShowText = ({ text, language }: ShowTextProps) => {
    const [theLang, setLanguage] = useState(language)
    const [isFullscreen, setIsFullscreen] = useState(false)

    return (
        <div
            className={`w-screen min-h-screen bg-neutral-900 flex flex-col items-stretch justify-start p-0 m-0${isFullscreen ? ' fixed inset-0 z-50' : ''}`}
            style={isFullscreen ? { width: '100vw', height: '100vh' } : {}}
            id="show-text"
        >
            <div className="flex items-center justify-between w-full px-2 py-1 bg-neutral-900 border-b border-neutral-800" style={{ minHeight: 36 }}>
                <span className="text-xs text-neutral-300 font-semibold tracking-tight">View Text</span>
                <div className="flex items-center gap-2">
                    {!isFullscreen && <Select value={theLang} onValueChange={setLanguage}>
                        <SelectTrigger className="h-6 min-w-[90px] px-2 text-xs bg-neutral-800 border border-neutral-700 text-neutral-200 rounded-sm focus:ring-0 focus:border-blue-500">
                            <SelectValue placeholder="Language" />
                        </SelectTrigger>
                        <SelectContent className="bg-neutral-800 border-neutral-700 text-neutral-200 max-h-44 overflow-y-auto rounded-sm shadow-lg">
                            {languages.map((language) => (
                                <SelectItem
                                    key={language.value}
                                    value={language.value}
                                    className="text-xs px-2 py-1 hover:bg-neutral-700"
                                >
                                    {language.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>}
                    <button
                        aria-label={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                        onClick={() => {
                            if (isFullscreen) {
                                document.exitFullscreen()
                            } else {
                                document.querySelector('#show-text')?.requestFullscreen()
                            }
                            setIsFullscreen(!isFullscreen)
                        }}
                        className="ml-2 p-1 rounded hover:bg-neutral-800 transition-colors"
                        style={{ height: 24, width: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        type="button"
                    >
                        {isFullscreen ? (
                            <Minimize2 className="w-4 h-4 text-neutral-300" />
                        ) : (
                            <Maximize2 className="w-4 h-4 text-neutral-300" />
                        )}
                    </button>
                </div>
            </div>
            <div className="flex-1 w-full">
                <Editor
                    height={isFullscreen ? "calc(100vh - 36px)" : "calc(100vh - 36px)"}
                    width={isFullscreen ? "100vw" : "100vw"}
                    value={text}
                    language={theLang}
                    theme="vs-dark"
                    loading="Loading Monaco Editor..."

                    options={{
                        readOnly: true,
                        fontSize: 13,
                        minimap: { enabled: false },
                        lineNumbersMinChars: 2,
                        padding: { top: 6, bottom: 6 },
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
        </div>
    )
}

export default ShowText