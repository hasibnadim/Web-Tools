"use client"
import React, { useState, useCallback, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ClipboardCheck, Fullscreen, GitCompare } from "lucide-react";
import { DiffEditor, loader } from '@monaco-editor/react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; 
import { languages } from "@/app/t/[objectId]/ShowText";

loader.config({
  paths: {
    vs: '/monaco/vs',
  },
});

export default function TextDiffChecker() {
  const [oldText, setOldText] = useState("");
  const [newText, setNewText] = useState("");
  const [language, setLanguage] = useState('plaintext')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [editorError, setEditorError] = useState(false)

  // Handle fullscreen toggle with useCallback to prevent re-renders
  const handleFullscreenToggle = useCallback(() => {
    const diffViewer = document.getElementById('diff-viewer');
    if (diffViewer) {
      if (isFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      } else {
        diffViewer.requestFullscreen();
        setIsFullscreen(true);
      }
    }
  }, [isFullscreen]);



  // Reset error state when text changes
  useEffect(() => {
    setEditorError(false);
  }, [oldText, newText]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Cleanup function to handle component unmount
      setEditorError(false);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto space-y-4">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 bg-slate-900/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm border border-slate-800">
            <GitCompare className="h-4 w-4 text-blue-400" />
            <span className="text-sm font-medium text-gray-200">Text Diff Checker</span>
          </div>
          <p className="text-sm text-gray-400 max-w-md mx-auto">
            Compare and visualize differences between two text versions with precision
          </p>
        </div>

        {/* Input Section */}
        <Card className="bg-slate-900/90 backdrop-blur-sm border border-slate-800 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GitCompare className="h-4 w-4 text-blue-400" />
                <h2 className="text-sm font-semibold text-gray-100">Input Texts</h2>
              </div>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="h-8 w-32 text-xs bg-slate-800 border border-slate-700 text-gray-100">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-700 text-gray-100">
                  {languages.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value} className="text-xs">
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-400">Original Text</label>
                <Textarea
                  value={oldText}
                  onChange={(e) => setOldText(e.target.value)}
                  placeholder="Enter original text..."
                  className="h-40 resize-none text-sm border-slate-700 focus:border-blue-500 focus:ring-blue-900 bg-slate-800 text-gray-100 placeholder:text-gray-400"
                  spellCheck={false}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-400">Modified Text</label>
                <Textarea
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  placeholder="Enter modified text..."
                  className="h-40 resize-none text-sm border-slate-200 focus:border-blue-400 focus:ring-blue-400/20"
                  spellCheck={false}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Diff Viewer */}
        <Card className="bg-slate-900/90 backdrop-blur-sm border border-slate-800 shadow-sm" id="diff-viewer">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GitCompare className="h-4 w-4 text-blue-400" />
                <h2 className="text-sm font-semibold text-gray-100">Diff Preview</h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleFullscreenToggle}
                className="h-8 w-8 p-0"
              >
                <Fullscreen className="h-4 w-4 text-slate-300" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="rounded-lg overflow-hidden bg-slate-900/90 border border-slate-800">
              {editorError ? (
                <div className="h-50vh flex items-center justify-center bg-slate-900 text-slate-400">
                  <div className="text-center">
                    <p className="text-sm mb-2">Editor encountered an error</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setEditorError(false)}
                      className="text-xs"
                    >
                      Retry
                    </Button>
                  </div>
                </div>
              ) : (
                <DiffEditor
                  height={isFullscreen ? "calc(100vh - 120px)" : "50vh"}
                  width="100%"
                  original={oldText}
                  modified={newText}
                  language={language}
                  theme="vs-dark"
                  loading="Loading diff editor..."
                  onMount={() => {
                    // Handle editor mount
                    console.log('DiffEditor mounted successfully');
                  }}
                  options={{
                    fontSize: 13,
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
                    scrollbar: { verticalScrollbarSize: 8, horizontalScrollbarSize: 8 },
                    padding: { top: 8, bottom: 8 },
                  }}
                />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Features Info */}
        <div className="flex justify-center">
          <Card className="bg-slate-900/90 border border-slate-800 shadow-none max-w-md">
            <CardContent className="p-3">
              <div className="flex items-start gap-2">
                <ClipboardCheck className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="space-y-0.5">
                  <h3 className="text-sm font-semibold text-slate-100">Features</h3>
                  <ul className="text-xs text-slate-400 space-y-0.5">
                    <li>• Real-time text comparison</li>
                    <li>• Syntax highlighting support</li>
                    <li>• Fullscreen diff view</li>
                    <li>• Line-by-line difference highlighting</li>
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
