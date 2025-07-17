"use client"

import React, { useEffect, useState } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import { Card, CardContent, CardFooter, CardHeader } from './ui/card'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Download, Settings, QrCode, Sliders } from 'lucide-react'
import { Slider } from './ui/slider'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { toast } from 'sonner'

export default function QRapp() {
    const [value, setValue] = useState("https://www.google.com")
    const [QRSize, setQRSize] = useState(280)
    const [QRLevel, setQRLevel] = useState<"Q" | "M" | "L" | "H">("Q")
    const [QRbgColor, setQRbgColor] = useState("#FFFFFF")
    const [QRfgColor, setQRfgColor] = useState("#000000")
    const [QRmarginSize, setQRmarginSize] = useState(2)

    useEffect(() => {
        const bytes = new TextEncoder().encode(value).length
        if (bytes > 1500) {
            setValue(value.slice(0, 100))
            toast.error("Value too long - truncated to 100 characters")
        }
    }, [value, QRLevel])

    function saveToFile() {
        try {
            const canvas = document.getElementById('qrcode') as HTMLCanvasElement
            const pngUrl = canvas.toDataURL('image/png')
            const downloadLink = document.createElement('a')
            downloadLink.href = pngUrl
            downloadLink.download = `qrcode-${Date.now()}.png`
            document.body.appendChild(downloadLink)
            downloadLink.click()
            document.body.removeChild(downloadLink)
            toast.success("QR code downloaded successfully!")
        } catch  {
            toast.error("Failed to download QR code")
        }
    }

    return (
        <div className="w-full max-w-2xl">
            <Card className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl">
                <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                                <QrCode className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">QR Generator</h2>
                                <p className="text-slate-300 text-sm">Create custom QR codes</p>
                            </div>
                        </div>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-white/10">
                                    <Settings className="w-4 h-4" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80 backdrop-blur-xl bg-slate-900/95 border border-white/20">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-white">
                                        <Sliders className="w-4 h-4" />
                                        <span className="font-medium">Settings</span>
                                    </div>
                                    
                                    <div className="space-y-3">
                                        <div>
                                            <label className="text-slate-300 text-sm mb-2 block">Margin ({QRmarginSize})</label>
                                            <Slider
                                                defaultValue={[QRmarginSize]}
                                                max={10}
                                                min={0}
                                                step={0.5}
                                                className="w-full"
                                                onValueChange={(e) => setQRmarginSize(e[0])}
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="text-slate-300 text-sm mb-2 block">Error Correction Level</label>
                                            <Select value={QRLevel} onValueChange={(e: "L" | "M" | "Q" | "H") => setQRLevel(e)}>
                                                <SelectTrigger className="w-full bg-slate-800 border-slate-700 text-white">
                                                    <SelectValue placeholder="Level" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-slate-800 border-slate-700">
                                                    <SelectItem value="L" className="text-white hover:bg-slate-700">L - Low (7%)</SelectItem>
                                                    <SelectItem value="M" className="text-white hover:bg-slate-700">M - Medium (15%)</SelectItem>
                                                    <SelectItem value="Q" className="text-white hover:bg-slate-700">Q - Quartile (25%)</SelectItem>
                                                    <SelectItem value="H" className="text-white hover:bg-slate-700">H - High (30%)</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="text-slate-300 text-sm mb-2 block">Background</label>
                                                <div className="flex items-center gap-2">
                                                    <Input 
                                                        type="color" 
                                                        className="w-12 h-8 p-1 bg-transparent border-slate-700" 
                                                        value={QRbgColor} 
                                                        onChange={(e) => setQRbgColor(e.target.value)} 
                                                    />
                                                    <span className="text-white text-xs">{QRbgColor}</span>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-slate-300 text-sm mb-2 block">Foreground</label>
                                                <div className="flex items-center gap-2">
                                                    <Input 
                                                        type="color" 
                                                        className="w-12 h-8 p-1 bg-transparent border-slate-700" 
                                                        value={QRfgColor} 
                                                        onChange={(e) => setQRfgColor(e.target.value)} 
                                                    />
                                                    <span className="text-white text-xs">{QRfgColor}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                    <div>
                        <label className="text-slate-300 text-sm mb-2 block">Content</label>
                        <Input 
                            type="text" 
                            className="w-full bg-slate-800/50 border-slate-700 text-white placeholder-slate-400 focus:border-purple-500" 
                            value={value} 
                            onChange={(e) => setValue(e.target.value)}
                            placeholder="Enter URL, text, or data..."
                        />
                    </div>
                    
                    <div className="flex justify-center p-4 bg-white/5 rounded-xl border border-white/10">
                        <QRCodeCanvas 
                            level={QRLevel} 
                            marginSize={QRmarginSize} 
                            bgColor={QRbgColor}
                            fgColor={QRfgColor} 
                            size={QRSize} 
                            id="qrcode" 
                            value={value} 
                            title="QR Code"
                            className="rounded-lg shadow-lg"
                        />
                    </div>
                </CardContent>
                
                <CardFooter className="flex flex-col gap-4 pt-4">
                    <div className="w-full">
                        <div className="flex items-center justify-between text-slate-300 text-sm mb-2">
                            <span>Size ({QRSize}px)</span>
                            <span className="text-xs bg-slate-800 px-2 py-1 rounded">
                                {Math.round((QRSize * QRSize * 4) / 1024)}KB
                            </span>
                        </div>
                        <Slider
                            defaultValue={[QRSize]}
                            max={400}
                            min={120}
                            step={10}
                            className="w-full"
                            onValueChange={(e) => setQRSize(e[0])}
                        />
                    </div>
                    
                    <Button 
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium"
                        onClick={saveToFile}
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Download PNG
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}