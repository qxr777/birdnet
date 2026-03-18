/**
 * 文件上传测试工具
 * 允许用户上传音频文件而不是录音
 */

import React, { useState, useRef } from 'react';
import { analyzeAudio } from '../services/api';
import { mapApiResponseToResult } from '../utils/dataMapper';
import { RecognitionResult } from '../types';

interface FileUploadTestProps {
    onResult: (result: RecognitionResult) => void;
    onError: (error: string) => void;
}

const FileUploadTest: React.FC<FileUploadTestProps> = ({ onResult, onError }) => {
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // 检查文件类型
        if (!file.type.startsWith('audio/')) {
            onError('请选择音频文件');
            return;
        }

        try {
            setIsAnalyzing(true);

            // 将文件转换为 Blob
            const audioBlob = new Blob([await file.arrayBuffer()], { type: file.type });

            // 调用 API 分析
            const apiResponse = await analyzeAudio(audioBlob);

            // 转换数据格式
            const result = mapApiResponseToResult(apiResponse, '上传的文件');

            onResult(result);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : '分析失败';
            onError(errorMessage);
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="p-6">
            <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
            />

            <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isAnalyzing}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-black rounded-full font-bold hover:opacity-90 disabled:opacity-50"
            >
                <span className="material-symbols-outlined">upload_file</span>
                {isAnalyzing ? '分析中...' : '上传音频文件测试'}
            </button>

            <p className="text-white/60 text-sm mt-4">
                支持 MP3, WAV, FLAC 等格式
            </p>
        </div>
    );
};

export default FileUploadTest;
