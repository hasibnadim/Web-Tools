"use client";

import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button"; 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Code, Copy, Check, Minus, ArrowRight, Calculator } from "lucide-react";
import { toast } from "sonner";
import JsonToTS from "json-to-ts";

function getByteSize(str: string) {
  return new Blob([str]).size;
}

function isValidJson(str: string) {
  try {
    const parsed = JSON.parse(str);
    // Only allow objects/arrays as valid JSON
    return typeof parsed === "object" && parsed !== null;
  } catch {
    return false;
  }
}

function isValidJsObject(str: string) {
  try {
    // eslint-disable-next-line no-eval
    const obj = eval('(' + str + ')');
    return typeof obj === "object" && obj !== null;
  } catch {
    return false;
  }
}

function toTypeScriptInterface(obj: unknown): string {
  let result = "";
  JsonToTS(obj).forEach( typeInterface => {
    result += typeInterface + "\n";
  })
  return result;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} bytes`;
  const units = ["KB", "MB", "GB", "TB"];
  let i = -1;
  do {
    bytes = bytes / 1024;
    i++;
  } while (bytes >= 1024 && i < units.length - 1);
  return `${bytes.toFixed(2)} ${units[i]}`;
}

function roughSizeOfObject(object: unknown, visited = new Set()): number {
  if (object === null || object === undefined) return 0;
  if (visited.has(object)) return 0;
  visited.add(object);
  let bytes = 0;
  switch (typeof object) {
    case "number":
      bytes += 8;
      break;
    case "string":
      bytes += object.length * 2;
      break;
    case "boolean":
      bytes += 4;
      break;
    case "object":
      if (Array.isArray(object)) {
        for (const item of object) {
          bytes += roughSizeOfObject(item, visited);
        }
      } else {
        for (const key in object as Record<string, unknown>) {
          if (Object.prototype.hasOwnProperty.call(object, key)) {
            bytes += key.length * 2;
            bytes += roughSizeOfObject((object as Record<string, unknown>)[key], visited);
          }
        }
      }
      break;
    default:
      break;
  }
  return bytes;
}

const JsonSizeCalculator = () => {
  const [input, setInput] = useState("");
  const [tsInterface, setTsInterface] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const isJson = isValidJson(input);
  const isJsObj = !isJson && isValidJsObject(input);
  const charLength = input.length;
  const byteSize = getByteSize(input);
  let objectSize = 0;
  if (isJsObj) {
    try {
      // eslint-disable-next-line no-eval
      const obj = eval('(' + input + ')');
      objectSize = roughSizeOfObject(obj);
    } catch {}
  }

  const handleMinify = () => {
    try {
      const minified = JSON.stringify(JSON.parse(input));
      setInput(minified);
      toast.success('JSON minified successfully!');
    } catch {
      toast.error('Failed to minify JSON');
    }
  };

  const handleGenerateInterface = () => {
    setError("");
    try {
      let obj;
      if (isJson) {
        obj = JSON.parse(input);
      } else if (isJsObj) {
        // eslint-disable-next-line no-eval
        obj = eval('(' + input + ')');
      } else {
        setError("Input is not valid JSON or JS object.");
        setTsInterface("");
        return;
      }
      setTsInterface(toTypeScriptInterface(obj));
      toast.success('TypeScript interface generated!');
    } catch {
      setError("Failed to generate interface.");
      setTsInterface("");
      toast.error('Failed to generate interface');
    }
  };

  const handleConvertToJson = () => {
    setError("");
    try {
      // eslint-disable-next-line no-eval
      const obj = eval('(' + input + ')');
      setInput(JSON.stringify(obj, null, 2));
      toast.success('Converted to JSON!');
    } catch {
      setError("Failed to convert JS object to JSON.");
      toast.error('Failed to convert to JSON');
    }
  };

  const handleConvertToJsObject = () => {
    setError("");
    try {
      const obj = JSON.parse(input);
      // Convert to JS object string (not minified)
      setInput(JSON.stringify(obj, null, 2)
        .replace(/"([^("]+)":/g, '$1:') // remove quotes from keys
        .replace(/"/g, "'")); // use single quotes for values
      toast.success('Converted to JS object!');
    } catch {
      setError("Failed to convert JSON to JS object.");
      toast.error('Failed to convert to JS object');
    }
  };

  const copyInterface = async () => {
    if (tsInterface) {
      try {
        await navigator.clipboard.writeText(tsInterface);
        setCopied(true);
        toast.success('Interface copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
      } catch {
        toast.error('Failed to copy interface');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-6">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 mb-4 shadow-lg">
              <FileText className="h-4 w-4 text-blue-500" />
              <span className="text-xs font-medium text-gray-700">Developer Tools</span>
            </div>
            
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent mb-2">
              JSON Size Calculator
            </h1>
            
            <p className="text-base text-gray-600">
              Calculate size, generate TypeScript interfaces, and convert formats
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Input Section */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                  <div className="p-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg">
                    <Code className="h-4 w-4 text-white" />
                  </div>
                  Input Data
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  rows={12}
                  placeholder="Paste your string, JSON, or JS object here..."
                  className="font-mono text-sm border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                />
                
                {/* Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg text-center">
                    <div className="text-lg font-bold text-gray-900">{charLength}</div>
                    <div className="text-xs text-gray-600">Characters</div>
                  </div>
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-lg text-center">
                    <div className="text-lg font-bold text-gray-900">{formatBytes(byteSize)}</div>
                    <div className="text-xs text-gray-600">Size</div>
                  </div>
                </div>

                {isJsObj && (
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-lg text-center">
                    <div className="text-lg font-bold text-gray-900">{formatBytes(objectSize)}</div>
                    <div className="text-xs text-gray-600">Object Size (approx)</div>
                  </div>
                )}

                {/* Actions */}
                {(isJson || isJsObj) && (
                  <div className="flex flex-wrap gap-2">
                    {isJson && (
                      <Button variant="outline" size="sm" onClick={handleMinify} className="h-8">
                        <Minus className="h-3 w-3 mr-1" />
                        Minify
                      </Button>
                    )}
                    <Button variant="outline" size="sm" onClick={handleGenerateInterface} className="h-8">
                      <Code className="h-3 w-3 mr-1" />
                      Generate TS
                    </Button>
                    {isJsObj && (
                      <Button variant="outline" size="sm" onClick={handleConvertToJson} className="h-8">
                        <ArrowRight className="h-3 w-3 mr-1" />
                        To JSON
                      </Button>
                    )}
                    {isJson && (
                      <Button variant="outline" size="sm" onClick={handleConvertToJsObject} className="h-8">
                        <ArrowRight className="h-3 w-3 mr-1" />
                        To JS
                      </Button>
                    )}
                  </div>
                )}

                {error && (
                  <div className="text-red-500 text-sm bg-red-50 p-2 rounded-lg border border-red-200">
                    {error}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Output Section */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                  <div className="p-1.5 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg">
                    <Calculator className="h-4 w-4 text-white" />
                  </div>
                  TypeScript Interface
                </CardTitle>
              </CardHeader>
              <CardContent>
                {tsInterface ? (
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Generated Interface</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={copyInterface}
                        className="h-8 w-8 p-0 text-gray-400 hover:text-blue-600"
                      >
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                    <Textarea
                      value={tsInterface}
                      readOnly
                      rows={16}
                      className="font-mono text-sm bg-gray-50 border-0 resize-none"
                    />
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Code className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 text-sm">
                      Enter valid JSON or JS object to generate TypeScript interface
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JsonSizeCalculator; 