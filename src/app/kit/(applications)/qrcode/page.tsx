import QRapp from "@/components/QRapp";
import { Metadata } from "next";
import { QrCode } from "lucide-react";

export const metadata: Metadata = {
    title: "QR Code Generator/Scanner",
    description: "Generate/Scan QR Code",
};

export default function QRCodePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-4 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
      
      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-700 to-blue-700 rounded-2xl mb-4 shadow-lg">
            <QrCode className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-blue-200 to-purple-300 bg-clip-text text-transparent mb-2">
            QR Code Generator
          </h1>
          <p className="text-slate-300 text-sm">
            Create custom QR codes with advanced styling options
          </p>
        </div>

        {/* Main Content */}
        <div className="flex justify-center">
          <QRapp />
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <div className="backdrop-blur-xl bg-slate-900/80 border border-slate-800 rounded-xl p-4 text-center shadow">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg mx-auto mb-2 flex items-center justify-center">
              <span className="text-white text-xs font-bold">⚡</span>
            </div>
            <h3 className="text-blue-200 font-semibold text-sm mb-1">Fast Generation</h3>
            <p className="text-slate-400 text-xs">Instant QR code creation with real-time preview</p>
          </div>
          
          <div className="backdrop-blur-xl bg-slate-900/80 border border-slate-800 rounded-xl p-4 text-center shadow">
            <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-emerald-600 rounded-lg mx-auto mb-2 flex items-center justify-center">
              <span className="text-white text-xs font-bold">🎨</span>
            </div>
            <h3 className="text-green-200 font-semibold text-sm mb-1">Custom Styling</h3>
            <p className="text-slate-400 text-xs">Customize colors, size, and error correction level</p>
          </div>
          
          <div className="backdrop-blur-xl bg-slate-900/80 border border-slate-800 rounded-xl p-4 text-center shadow">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-600 to-red-600 rounded-lg mx-auto mb-2 flex items-center justify-center">
              <span className="text-white text-xs font-bold">💾</span>
            </div>
            <h3 className="text-orange-200 font-semibold text-sm mb-1">Easy Download</h3>
            <p className="text-slate-400 text-xs">Download high-quality PNG files instantly</p>
          </div>
        </div>
      </div>
    </div>
  );
}
