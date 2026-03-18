/**
 * 音频录制服务
 * 使用浏览器 MediaRecorder API 录制音频
 */

export interface RecordingOptions {
    maxDuration?: number; // 最大录制时长（毫秒）
    mimeType?: string; // 音频格式
}

export class AudioRecorder {
    private mediaRecorder: MediaRecorder | null = null;
    private audioChunks: Blob[] = [];
    private stream: MediaStream | null = null;

    /**
     * 请求麦克风权限并开始录音
     */
    async startRecording(options: RecordingOptions = {}): Promise<void> {
        const { maxDuration = 15000, mimeType } = options;

        try {
            // 请求麦克风权限
            this.stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    sampleRate: 44100
                }
            });

            // 确定支持的音频格式
            const supportedMimeType = this.getSupportedMimeType(mimeType);

            // 创建 MediaRecorder
            this.mediaRecorder = new MediaRecorder(this.stream, {
                mimeType: supportedMimeType
            });

            this.audioChunks = [];

            // 监听数据可用事件
            this.mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    this.audioChunks.push(event.data);
                }
            };

            // 开始录音
            this.mediaRecorder.start();

            // 设置最大录制时长
            if (maxDuration > 0) {
                setTimeout(() => {
                    this.stopRecording();
                }, maxDuration);
            }
        } catch (error) {
            if (error instanceof Error) {
                if (error.name === 'NotAllowedError') {
                    throw new Error('麦克风权限被拒绝，请在浏览器设置中允许麦克风访问');
                } else if (error.name === 'NotFoundError') {
                    throw new Error('未找到麦克风设备');
                }
            }
            throw new Error('无法启动录音：' + (error instanceof Error ? error.message : '未知错误'));
        }
    }

    /**
     * 停止录音并返回音频 Blob
     */
    async stopRecording(): Promise<Blob> {
        return new Promise((resolve, reject) => {
            if (!this.mediaRecorder) {
                reject(new Error('录音未开始'));
                return;
            }

            this.mediaRecorder.onstop = () => {
                const mimeType = this.mediaRecorder?.mimeType || 'audio/webm';
                const audioBlob = new Blob(this.audioChunks, { type: mimeType });

                // 清理资源
                this.cleanup();

                resolve(audioBlob);
            };

            this.mediaRecorder.stop();
        });
    }

    /**
     * 取消录音
     */
    cancelRecording(): void {
        if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
            this.mediaRecorder.stop();
        }
        this.cleanup();
    }

    /**
     * 检查浏览器是否支持录音
     */
    static isSupported(): boolean {
        return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
    }

    /**
     * 获取支持的 MIME 类型
     */
    private getSupportedMimeType(preferred?: string): string {
        const types = [
            preferred,
            'audio/webm',
            'audio/webm;codecs=opus',
            'audio/ogg;codecs=opus',
            'audio/mp4',
        ].filter(Boolean) as string[];

        for (const type of types) {
            if (MediaRecorder.isTypeSupported(type)) {
                return type;
            }
        }

        // 默认返回
        return 'audio/webm';
    }

    /**
     * 清理资源
     */
    private cleanup(): void {
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
            this.stream = null;
        }
        this.mediaRecorder = null;
        this.audioChunks = [];
    }
}

/**
 * 便捷函数：录制音频
 */
export const recordAudio = async (duration: number = 15000): Promise<Blob> => {
    const recorder = new AudioRecorder();
    await recorder.startRecording({ maxDuration: duration });

    // 等待录音完成
    return new Promise((resolve) => {
        setTimeout(async () => {
            const blob = await recorder.stopRecording();
            resolve(blob);
        }, duration);
    });
};

/**
 * 获取用户地理位置
 */
export const getGeolocation = (): Promise<GeolocationCoordinates | null> => {
    return new Promise((resolve) => {
        if (!navigator.geolocation) {
            resolve(null);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => resolve(position.coords),
            () => resolve(null), // 忽略错误，位置是可选的
            { timeout: 5000, maximumAge: 300000 }
        );
    });
};
