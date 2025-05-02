"use client"
import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Input } from './ui/input'
import Image from 'next/image'
import { Button } from './ui/button'
import JSZip from "jszip"
import CryptoJS from 'crypto-js'
function textToBinary(str: string) {
    return str.split('').map(char =>
        char.charCodeAt(0).toString(2).padStart(8, '0')
    ).join('');
}

function binaryToMorse(binary: string) {
    return binary.replace(/1/g, '–').replace(/0/g, '.');
}

function morseToBinary(morse: string) {
    return morse.replace(/–/g, '1').replace(/\./g, '0');
}

function binaryToText(binary: string) {
    const bytes = binary.match(/.{1,8}/g);
    return bytes?.map(b => String.fromCharCode(parseInt(b, 2))).join('');
}

function ImageToMorse() {
    const [img, setImg] = React.useState("")
    const [fileName, setFileName] = React.useState("")
    const [secretKey, setSecretKey] = React.useState("")
    async function download(mc: string, isZip: boolean) {
        if (isZip) {
            const zip = new JSZip();
            zip.file("morse.txt", mc);
            // Generate zip blob
            zip.generateAsync({ type: "blob", compression: "DEFLATE" }).then((blob) => {
                const link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                link.download = fileName.replace(/\.[^.]+$/, '') + '.mrs';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            })
        } else {
            const blob = new Blob([mc], { type: "text/plain" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = fileName.replace(/\.[^.]+$/, '') + '.mrs';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }


    }
    function convertToMorse() {
        const imgData = secretKey ? CryptoJS.AES.decrypt(img, secretKey).toString() : img
        const binary = textToBinary(imgData)
        const morse = binaryToMorse(binary)
        download(morse, !!secretKey)
    }
    return (
        <div className='max-w-2xl flex flex-col gap-2'>
            <Input type="file" accept="image/*" onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                    const reader = new FileReader()
                    reader.onload = (e) => {
                        const result = e.target?.result
                        if (typeof result === "string") {
                            setImg(result)
                        }
                    }
                    reader.readAsDataURL(file)
                    setFileName(file.name)
                }
            }} />
            <Input type="text" placeholder='Secret key' onChange={(e) => setSecretKey(e.target.value)} value={secretKey} />
            {img && <>
                <Image src={img} alt="Image" width={300} height={300} />
                <Button onClick={convertToMorse}>Convert to Morse</Button>
            </>}


        </div>
    )
}

function MorseToImage() {
    const [img, setImg] = React.useState("")
    const [fileName, setFileName] = React.useState("")
    const [secretKey, setSecretKey] = React.useState("")
    const [file, setFile] = React.useState<File | null>(null)

    return (
        <div className='max-w-2xl flex flex-col gap-2'>
            {/* mrs file */}
            <Input type="file" accept="application/mrs" onChange={async (e) => {
                const file = e.target.files?.[0]
                if (file) {
                    setFile(file)
                }

            }} />
            <Input type="text" placeholder='Secret key' onChange={(e) => setSecretKey(e.target.value)} value={secretKey} />
            {file && <>
                <Button onClick={async () => {
                    if (secretKey) {
                        try {
                            const arrayBuffer = await file.arrayBuffer();
                            const zip = await JSZip.loadAsync(arrayBuffer);
                            const content = await zip.files[Object.keys(zip.files)[0]].async("text");
                            const base64 = binaryToText(morseToBinary(content))!
                            setImg(CryptoJS.AES.decrypt(base64, secretKey).toString(CryptoJS.enc.Utf8))
                            setFileName(file.name)
                        } catch (error) {
                            console.log(error);
                            
                            alert("Failed to decrypt")
                        }
                    } else {
                        // no zip
                        const reader = new FileReader()
                        reader.onload = (e) => {
                            const result = e.target?.result
                            if (typeof result === "string") {
                                const base64 = binaryToText(morseToBinary(result))!
                                setImg(base64)
                            }
                        }
                        reader.readAsDataURL(file)
                        setFileName(file.name)
                    }

                }}>Convert to Image</Button>
            </>}

            {img && <>
                <Image src={img} alt="Image" width={300} height={300} />
                <Button onClick={() => {
                    const link = document.createElement("a");
                    link.href = img;
                    link.download = fileName.replace(/\.[^.]+$/, '') + '.png';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }}>Download</Button>
            </>}
        </div>
    )
}

const ImageMorse = () => {
    return (
        <div className='py-2 container mx-auto'>
            <ol>
                <li>If no secret key, Convert image to raw morse code file</li>
                <li>If secret key, Convert Image to zipped morse code file</li>
            </ol>
            <hr  className='py-2'/>
            <Tabs defaultValue="img_to_morse" className="w-full">
                <TabsList>
                    <TabsTrigger value="img_to_morse">Image to Morse</TabsTrigger>
                    <TabsTrigger value="morse_to_img">Morse to Image</TabsTrigger>
                </TabsList>
                <TabsContent value="img_to_morse">
                    <ImageToMorse />
                </TabsContent>
                <TabsContent value="morse_to_img">
                    <MorseToImage />
                </TabsContent>
            </Tabs>
        </div>

    )
}

export default ImageMorse