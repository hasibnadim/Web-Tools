"use client"
import React, { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ClipboardCheck, Fullscreen, GitCompare } from "lucide-react";
import { DiffEditor, loader } from '@monaco-editor/react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { languages } from "@/app/t/[textId]/ShowText";

loader.config({
  paths: {
    vs: '/monaco/vs',
  },
});


export default function TextDiffChecker() {
  const [oldText, setOldText] = useState("");
  const [newText, setNewText] = useState("");
  const [language, setLanguage] = useState('cpp')
  const [isFullscreen, setIsFullscreen] = useState(false)
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 flex items-center py-2 w-full">
      <div className="max-w-7xl w-full mx-auto px-0">
        {/* Header */}
        <div className="flex flex-col items-center mb-2">
        <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 mb-4 shadow-lg">
            <GitCompare className="h-3 w-3 text-blue-500" />
            <span className="text-[11px] font-medium text-gray-700">Text Diff Utility</span>
          </div>
          <h1 className="text-lg font-bold bg-gradient-to-r from-gray-900 via-blue-700 to-indigo-700 bg-clip-text text-transparent mb-0.5 tracking-tight">
            Text Diff Checker
          </h1>
          <p className="text-[11px] text-gray-500 text-center max-w-xs">
            Compare and visualize differences between two text versions with precision.
          </p>
        </div>
        <Card className="bg-white/95 border border-blue-100 shadow-md mb-2 rounded-lg w-full">
          <CardHeader className="py-1 px-2 flex items-center gap-1">
            <GitCompare className="h-3 w-3 text-blue-500" />
            <span className="text-xs font-semibold text-gray-800">Input Texts</span>
          </CardHeader>
          <CardContent className="pt-0 px-2 pb-2">
            <div className="grid grid-cols-2 gap-2 w-full">
              <div className="flex flex-col">
                <label className="text-[11px] text-gray-500 mb-1 ml-0.5">Original</label>
                <Textarea
                  value={oldText}
                  onChange={(e) => setOldText(e.target.value)}
                  placeholder="Original text..."
                  className="h-[32vh] w-full bg-white border border-blue-100 text-gray-800 text-xs rounded-md px-2 py-1 focus:ring-0 focus:border-blue-400 resize-none"
                  spellCheck={false}
                />
              </div>
              <div className="flex flex-col">
                <label className="text-[11px] text-gray-500 mb-1 ml-0.5">Modified</label>
                <Textarea
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  placeholder="Modified text..."
                  className="h-[32vh] w-full bg-white border border-blue-100 text-gray-800 text-xs rounded-md px-2 py-1 focus:ring-0 focus:border-blue-400 resize-none"
                  spellCheck={false}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Diff Viewer */}
        <Card className="bg-white/95 border border-blue-100 shadow-md mt-1 rounded-lg w-full" id="diff-viewer">
          <CardHeader className="px-2 flex items-center gap-1 justify-between">
            <p className="flex items-center gap-1"><GitCompare className="h-3 w-3 text-blue-500" />
              <span className="text-xs font-semibold text-gray-800">Diff Preview</span></p>
            <div className="flex items-center gap-1">
              {!isFullscreen && <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="h-7 min-w-[110px] px-2 text-xs bg-white border border-blue-200 text-gray-700">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent className="bg-white border-blue-200 text-gray-700 max-h-48 overflow-y-auto">
                  {languages.map((language) => (
                    <SelectItem
                      key={language.value}
                      value={language.value}
                      className="text-xs px-2 py-1 hover:bg-blue-50"
                    >
                      {language.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>}
              <Button variant={"ghost"} size={"icon"} onClick={() => {
                const diffViewer = document.getElementById('diff-viewer');
                if (diffViewer) {
                  if (isFullscreen) {
                    document.exitFullscreen();
                    setIsFullscreen(false)
                  } else {
                    diffViewer.requestFullscreen();
                    setIsFullscreen(true)
                  }
                }
              }}>
                <Fullscreen className="h-3 w-3 text-gray-500" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0 px-2">
            <div className="grid grid-cols-2 text-[11px] text-blue-600 ">
              <span>Old</span>
              <span>New</span>
            </div>
            <div className="rounded-md overflow-hidden border border-blue-100">
              <DiffEditor
                height={isFullscreen ? "calc(100vh - 100px)" : "50vh"}
                width="100%"
                original={oldText}
                modified={newText}
                language={language}
                theme="light"
                loading="Loading Diff Editor..."
                options={{
                  fontSize: 12,
                  minimap: { enabled: true },
                  readOnly: false,
                  lineNumbers: 'on',
                  overviewRulerLanes: 0,
                  renderLineHighlight: 'all',
                  lineDecorationsWidth: 1,
                  wordWrap: 'on',
                  folding: true,
                  automaticLayout: true,
                  cursorBlinking: 'smooth',
                  cursorStyle: 'line',
                  cursorWidth: 2,
                  cursorSurroundingLines: 0,
                  scrollbar: { verticalScrollbarSize: 6, horizontalScrollbarSize: 6 },
                  padding: { top: 4, bottom: 4 },
                }}
              />
            </div>
          </CardContent>
        </Card>
        {/* Info */}
        <div className="flex justify-center mt-3">
          <Card className="bg-blue-50 border border-blue-100 shadow-none rounded-md w-full max-w-xs">
            <CardContent className="p-2">
              <div className="flex items-start gap-2">
                <ClipboardCheck className="h-4 w-4 text-green-500 mt-0.5" />
                <div>
                  <h3 className="text-xs font-semibold text-gray-900 mb-0.5">Features</h3>
                  <ul className="text-xs text-gray-600 space-y-0.5">
                    <li>• Compare text versions</li>
                    <li>• Visualize differences</li>
                    <li>• Customizable language</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
