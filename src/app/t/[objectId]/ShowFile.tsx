'use client'
import React, { useMemo, useState } from 'react'

const ShowFile = ({ base64, name }: { base64: string, name: string }) => {
    const [isDownloading, setIsDownloading] = useState(false)
    const [isHovered, setIsHovered] = useState(false)

    const { file, fileSize, fileType, fileIcon } = useMemo(() => {
        try {
            // Remove data URL prefix if present
            const base64Data = base64.startsWith('data:')
                ? base64.split(',')[1]
                : base64;

            // Decode base64 to binary
            const binaryString = atob(base64Data);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }

            // Determine MIME type and icon based on file extension
            const getFileInfo = (filename: string) => {
                const ext = filename.split('.').pop()?.toLowerCase();
                const mimeTypes: { [key: string]: string } = {
                    'pdf': 'application/pdf',
                    'doc': 'application/msword',
                    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    'xls': 'application/vnd.ms-excel',
                    'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    'ppt': 'application/vnd.ms-powerpoint',
                    'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
                    'txt': 'text/plain',
                    'json': 'application/json',
                    'xml': 'application/xml',
                    'csv': 'text/csv',
                    'zip': 'application/zip',
                    'rar': 'application/vnd.rar',
                    '7z': 'application/x-7z-compressed',
                    'tar': 'application/x-tar',
                    'gz': 'application/gzip',
                    'jpg': 'image/jpeg',
                    'jpeg': 'image/jpeg',
                    'png': 'image/png',
                    'gif': 'image/gif',
                    'svg': 'image/svg+xml',
                    'webp': 'image/webp',
                    'mp3': 'audio/mpeg',
                    'wav': 'audio/wav',
                    'mp4': 'video/mp4',
                    'avi': 'video/x-msvideo',
                    'mov': 'video/quicktime',
                    'wmv': 'video/x-ms-wmv',
                    'flv': 'video/x-flv',
                    'webm': 'video/webm'
                };

                const icons: { [key: string]: string } = {
                    'pdf': '📄',
                    'doc': '📝',
                    'docx': '📝',
                    'xls': '📊',
                    'xlsx': '📊',
                    'ppt': '📈',
                    'pptx': '📈',
                    'txt': '📄',
                    'json': '⚙️',
                    'xml': '⚙️',
                    'csv': '📊',
                    'zip': '📦',
                    'rar': '📦',
                    '7z': '📦',
                    'tar': '📦',
                    'gz': '📦',
                    'jpg': '🖼️',
                    'jpeg': '🖼️',
                    'png': '🖼️',
                    'gif': '🖼️',
                    'svg': '🖼️',
                    'webp': '🖼️',
                    'mp3': '🎵',
                    'wav': '🎵',
                    'mp4': '🎬',
                    'avi': '🎬',
                    'mov': '🎬',
                    'wmv': '🎬',
                    'flv': '🎬',
                    'webm': '🎬'
                };

                return {
                    mimeType: mimeTypes[ext || ''] || 'application/octet-stream',
                    icon: icons[ext || ''] || '📄',
                    type: ext?.toUpperCase() || 'FILE'
                };
            };

            const fileInfo = getFileInfo(name);
            const mimeType = fileInfo.mimeType;
            const file = new Blob([bytes], { type: mimeType });

            return {
                file,
                fileSize: file.size,
                fileType: fileInfo.type,
                fileIcon: fileInfo.icon
            };
        } catch (error) {
            console.error('Error processing file:', error);
            return {
                file: new Blob(),
                fileSize: 0,
                fileType: 'UNKNOWN',
                fileIcon: '📄'
            };
        }
    }, [base64, name]);

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const handleDownload = async () => {
        setIsDownloading(true);
        try {
            const url = URL.createObjectURL(file);
            const link = document.createElement('a');
            link.href = url;
            link.download = name;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            // Simulate download time for better UX
            await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
            console.error('Download failed:', error);
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Main Card */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
                    {/* Header with gradient */}
                    <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-6 text-white">
                        <div className="flex items-center justify-center mb-4">
                            <div className="text-4xl mb-2">{fileIcon}</div>
                        </div>
                        <h1 className="text-xl font-bold text-center mb-1 truncate">{name}</h1>
                        <p className="text-blue-100 text-sm text-center">{fileType} File</p>
                    </div>

                    {/* File Details */}
                    <div className="p-6 space-y-6">
                        {/* File Info */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <span className="text-sm font-medium text-gray-600">File Size</span>
                                <span className="text-sm font-semibold text-gray-900">{formatFileSize(fileSize)}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <span className="text-sm font-medium text-gray-600">File Type</span>
                                <span className="text-sm font-semibold text-gray-900">{fileType}</span>
                            </div>
                        </div>

                        {/* Download Button */}
                        <button
                            onClick={handleDownload}
                            disabled={isDownloading}
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                            className={`
                                w-full relative overflow-hidden rounded-xl px-6 py-4 font-semibold text-white
                                transition-all duration-300 transform
                                ${isDownloading
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:shadow-lg hover:-translate-y-0.5'
                                }
                                ${isHovered && !isDownloading ? 'scale-105' : 'scale-100'}
                            `}
                        >
                            {/* Animated background */}
                            <div className={`
                                absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 
                                transition-transform duration-300 ease-out
                                ${isHovered && !isDownloading ? 'translate-x-0' : '-translate-x-full'}
                            `} />

                            {/* Button content */}
                            <div className="relative flex items-center justify-center space-x-2">
                                {isDownloading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        <span>Downloading...</span>
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <span>Download File</span>
                                    </>
                                )}
                            </div>
                        </button>

                    </div>
                </div>

                {/* Footer Info */}
                <div className="mt-6 text-center">
                    <p className="text-xs text-gray-500">
                        File will be automatically deleted after 8 hours
                    </p>
                </div>
            </div>
        </div>
    )
}

export default ShowFile