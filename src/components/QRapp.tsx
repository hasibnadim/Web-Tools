"use client"

import React, { useEffect, useState } from 'react'
import { QRCodeCanvas } from 'qrcode.react'
import { Card, CardContent, CardFooter, CardHeader } from './ui/card'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Download, Settings } from 'lucide-react'
import { Slider } from './ui/slider'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'

export default function QRapp() {
    const [value, setValue] = useState("https://www.google.com")
    const [QRSize, setQRSize] = useState(340)
    const [QRLevel, setQRLevel] = useState<"Q" | "M" | "L" | "H">("Q")
    const [QRbgColor, setQRbgColor] = useState("#FFFFFF")
    const [QRfgColor, setQRfgColor] = useState("#000000")
    const [QRmarginSize, setQRmarginSize] = useState(2)
    useEffect(() => {
        const bytes = new TextEncoder().encode(value).length
        if (bytes > 1500) {
            setValue(value.slice(0, 100))
            alert("Value too long")
        }

    }, [value, QRLevel])

    function saveToFile() {
        const canvas = document.getElementById('qrcode') as HTMLCanvasElement
        const pngUrl = canvas.toDataURL('image/png')
        const downloadLink = document.createElement('a')
        downloadLink.href = pngUrl
        downloadLink.download = `qrcode-${Date.now()}.png`
        document.body.appendChild(downloadLink)
        downloadLink.click()
        document.body.removeChild(downloadLink)

    }
    return (
        <Card className="w-full max-w-[550px]">
            <CardHeader className='flex justify-between'>
                <h1 className='font-bold text-2xl'>QR Code Generator</h1>
                <Popover>
                    <PopoverTrigger className='cursor-pointer border border-transparent hover:border-primary rounded-sm p-1'><Settings /></PopoverTrigger>
                    <PopoverContent className='flex flex-col gap-4'>

                        <div>
                            <label htmlFor="margin">Margin ({QRmarginSize})</label>
                            <Slider
                                id='margin'
                                defaultValue={[QRmarginSize]}
                                max={10}
                                min={0}
                                step={0.5}
                                className="w-full"
                                onValueChange={(e) => setQRmarginSize(e[0])}
                            />
                        </div>
                        <div>
                            <label htmlFor="Level">Level</label>
                            <Select value={QRLevel} onValueChange={(e: "L" | "M" | "Q" | "H") => setQRLevel(e)}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Level" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="L">L</SelectItem>
                                    <SelectItem value="M">M</SelectItem>
                                    <SelectItem value="Q">Q</SelectItem>
                                    <SelectItem value="H">H</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <label htmlFor="bgColor">Background Color</label>
                            <Input type='color' id='bgColor' className='w-full' value={QRbgColor} onChange={(e) => setQRbgColor(e.target.value)} />
                        </div>
                        <div>
                            <label htmlFor="fgColor">Foreground Color</label>
                            <Input type='color' id='fgColor' className='w-full' value={QRfgColor} onChange={(e) => setQRfgColor(e.target.value)} />
                        </div>




                    </PopoverContent>
                </Popover>

            </CardHeader>
            <CardContent className='m-2'>
                <Input type="text" className='w-full my-2' value={value} onChange={(e) => setValue(e.target.value)} />
                <QRCodeCanvas level={QRLevel} marginSize={QRmarginSize} bgColor={QRbgColor}
                    fgColor={QRfgColor} size={QRSize} id='qrcode' value={value} title='QR Code' />
            </CardContent>
            <CardFooter className='flex flex-col'>
                <label htmlFor="size">QR Size ({QRSize})</label>
                <Slider
                    defaultValue={[QRSize]}
                    max={450}
                    min={100}
                    step={1}
                    className="w-full"
                    onValueChange={(e) => setQRSize(e[0])}
                />
                <br />
                <Button className='w-full hover:bg-primary cursor-pointer'
                    onClick={saveToFile}><Download className='mr-2' />Download</Button>
            </CardFooter>
        </Card>
    )
}