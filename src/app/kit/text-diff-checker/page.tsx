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
  const [language, setLanguage] = useState('cpp')
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-6xl mx-auto space-y-4">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm border border-slate-200">
            <GitCompare className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-slate-700">Text Diff Checker</span>
          </div>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            Compare and visualize differences between two text versions with precision
          </p>
        </div>

        {/* Input Section */}
        <Card className="bg-white/80 backdrop-blur-sm border border-slate-200 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GitCompare className="h-4 w-4 text-blue-600" />
                <h2 className="text-sm font-semibold text-slate-800">Input Texts</h2>
              </div>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="h-8 w-32 text-xs">
                  <SelectValue placeholder="Language" />
                </SelectTrigger>
                <SelectContent>
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
                <label className="text-xs font-medium text-slate-600">Original Text</label>
                <Textarea
                  value={oldText}
                  onChange={(e) => setOldText(e.target.value)}
                  placeholder="Enter original text..."
                  className="h-40 resize-none text-sm border-slate-200 focus:border-blue-400 focus:ring-blue-400/20"
                  spellCheck={false}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-600">Modified Text</label>
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
        <Card className="bg-white/80 backdrop-blur-sm border border-slate-200 shadow-sm" id="diff-viewer">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GitCompare className="h-4 w-4 text-blue-600" />
                <h2 className="text-sm font-semibold text-slate-800">Diff Preview</h2>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleFullscreenToggle}
                className="h-8 w-8 p-0"
              >
                <Fullscreen className="h-4 w-4 text-slate-600" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="rounded-lg overflow-hidden border border-slate-200">
              {editorError ? (
                <div className="h-50vh flex items-center justify-center bg-slate-50 text-slate-600">
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
                  theme="light"
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
          <Card className="bg-blue-50/50 border border-blue-200/50 shadow-none max-w-md">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <ClipboardCheck className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-slate-800">Features</h3>
                  <ul className="text-xs text-slate-600 space-y-0.5">
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
