"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Key, Copy, Check, RefreshCw, Shield } from "lucide-react";
import { toast } from "sonner";

const LOWER = 'abcdefghijklmnopqrstuvwxyz';
const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const DIGITS = '0123456789';
const SPECIAL = '!@#$%^&*()_+-=[]{}|;:,.<>?';

function generateRandomKey(length: number, opts: { special: boolean; lower: boolean; upper: boolean; noDigits: boolean }) {
  let charset = '';
  if (!opts.noDigits) charset += DIGITS;
  if (opts.lower && !opts.upper) charset += LOWER;
  else if (opts.upper && !opts.lower) charset += UPPER;
  else if (opts.lower && opts.upper) charset += LOWER + UPPER;
  if (opts.special) charset += SPECIAL;
  if (!opts.lower && !opts.upper) charset += LOWER + UPPER; // fallback to all letters if none checked
  if (charset.length === 0) charset = LOWER + UPPER + DIGITS + SPECIAL;
  const array = new Uint32Array(length);
  window.crypto.getRandomValues(array);
  return Array.from(array, (x) => charset[x % charset.length]).join('');
}

const RandomKeyGenerator = () => {
  const [length, setLength] = useState(32);
  const [key, setKey] = useState('');
  const [copied, setCopied] = useState(false);
  const [special, setSpecial] = useState(true);
  const [lower, setLower] = useState(false);
  const [upper, setUpper] = useState(false);
  const [noDigits, setNoDigits] = useState(false);
  const [warning, setWarning] = useState("");

  const handleGenerate = () => {
    if (length < 6 || length > 512) {
      setWarning("Key length must be between 6 and 512.");
      return;
    }
    setWarning("");
    setKey(generateRandomKey(length, { special, lower, upper, noDigits }));
    setCopied(false);
  };

  const handleCopy = async () => {
    if (key) {
      try {
        await navigator.clipboard.writeText(key);
        setCopied(true);
        toast.success('Key copied to clipboard!');
        setTimeout(() => setCopied(false), 2000);
      } catch {
        toast.error('Failed to copy key');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-6">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 mb-4 shadow-lg">
              <Key className="h-4 w-4 text-blue-500" />
              <span className="text-xs font-medium text-gray-700">Security Tools</span>
            </div>
            
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent mb-2">
              Random Key Generator
            </h1>
            
            <p className="text-base text-gray-600">
              Generate secure random keys for your applications
            </p>
          </div>

          {/* Generator Card */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                <div className="p-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg">
                  <Shield className="h-4 w-4 text-white" />
                </div>
                Generate Secure Key
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Length Input */}
              <div className="flex items-center gap-3">
                <label htmlFor="length" className="text-sm font-medium text-gray-700 whitespace-nowrap">Key Length:</label>
                <Input
                  id="length"
                  type="number"
                  min={6}
                  max={512}
                  value={length}
                  onChange={e => setLength(Number(e.target.value))}
                  className="w-24 h-10 text-sm border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                />
                <span className="text-xs text-gray-500">(6-512)</span>
              </div>

              {warning && (
                <div className="text-red-500 text-sm bg-red-50 p-2 rounded-lg border border-red-200">{warning}</div>
              )}

              {/* Options */}
              <div className="grid grid-cols-2 gap-3">
                <label className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={special} 
                    onChange={e => setSpecial(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Special characters</span>
                </label>
                <label className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={lower} 
                    onChange={e => setLower(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Lowercase only</span>
                </label>
                <label className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={upper} 
                    onChange={e => setUpper(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Uppercase only</span>
                </label>
                <label className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={noDigits} 
                    onChange={e => setNoDigits(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">No digits</span>
                </label>
              </div>

              {/* Generate Button */}
              <Button 
                onClick={handleGenerate} 
                className="w-full h-10 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold transition-all duration-200 transform hover:scale-105"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Generate Key
              </Button>

              {/* Generated Key */}
              {key && (
                <div className="space-y-3">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-100">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-gray-600">Generated Key</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCopy}
                        className="h-8 w-8 p-0 text-gray-400 hover:text-blue-600"
                      >
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                    <Textarea
                      value={key}
                      readOnly
                      rows={3}
                      className="font-mono text-sm bg-white/50 border-0 resize-none"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Security Info */}
          <div className="mt-6">
            <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Shield className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">Security Features</h3>
                    <ul className="text-xs text-gray-600 space-y-1">
                      <li>• Uses cryptographically secure random number generation</li>
                      <li>• Configurable character sets for different use cases</li>
                      <li>• Supports lengths from 6 to 512 characters</li>
                      <li>• Perfect for API keys, passwords, and tokens</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RandomKeyGenerator; 