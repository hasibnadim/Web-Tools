
import React from 'react'
import LoginButton from './LoginButton';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Sparkles } from 'lucide-react';

const Page = async () => {
  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Main Login Card */}
        <Card className="bg-white/80 backdrop-blur-sm border border-slate-200/50 shadow-xl">
          <CardContent className="p-6">
            {/* Header */}
                          <div className="text-center space-y-3 mb-4">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full shadow-lg">
                  <Shield className="h-7 w-7 text-white" />
                </div>
                <div className="space-y-1">
                  <h1 className="text-xl font-bold bg-gradient-to-r from-slate-900 via-blue-700 to-indigo-700 bg-clip-text text-transparent">
                    Welcome to BAW World
                  </h1>
                  <p className="text-xs text-slate-600 max-w-xs mx-auto">
                    Access your personalized toolkit and utilities with secure authentication
                  </p>
                </div>
              </div>

            {/* Login Section */}
            <div className="space-y-2">
              <div className="flex justify-center">
                <LoginButton />
              </div>
              
                            {/* Features Preview */}
              <div className="pt-4 border-t border-slate-200">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-3 w-3 text-blue-600" />
                  <span className="text-xs font-medium text-slate-700">What you&apos;ll get</span>
                </div>
                <div className="space-y-1 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                    <span>Text diff checker & utilities</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                    <span>QR code scanner & generator</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                    <span>Mobile banking calculators</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                    <span>And much more&hellip;</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-4">
          <p className="text-xs text-slate-500">
            Secure authentication powered by Google
          </p>
        </div>
      </div>
    </div>
  )
}

export default Page 