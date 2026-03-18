/**
 * BirdNET API 客户端服务
 * 负责与后端 API 通信
 */

// API 响应类型定义
export interface ApiDetection {
  start_time: number;
  end_time: number;
  scientific_name: string;
  common_name: string;
  confidence: number;
}

export interface ApiAnalysisResponse {
  success: boolean;
  detections: ApiDetection[];
  metadata: {
    latitude: number | null;
    longitude: number | null;
    total_detections: number;
    audio_duration: number | null;
  };
  error: string | null;
}

/**
 * 获取 API 基础 URL
 */
const getApiBaseUrl = (): string => {
  return import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
};

/**
 * 分析音频文件
 * @param audioBlob 音频 Blob 对象
 * @param location 可选的地理位置信息
 * @param filename 可选的文件名（保留原始格式）
 * @returns API 响应
 */
export const analyzeAudio = async (
  audioBlob: Blob,
  location?: GeolocationCoordinates,
  filename?: string
): Promise<ApiAnalysisResponse> => {
  const formData = new FormData();

  // 添加音频文件，使用提供的文件名或默认名称
  const audioFilename = filename || 'recording.webm';
  formData.append('audio_file', audioBlob, audioFilename);

  // 添加地理位置（如果提供）
  if (location) {
    formData.append('latitude', location.latitude.toString());
    formData.append('longitude', location.longitude.toString());
  }

  try {
    const response = await fetch(`${getApiBaseUrl()}/analyze`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.detail || `API 请求失败: ${response.status} ${response.statusText}`
      );
    }

    const data: ApiAnalysisResponse = await response.json();

    if (!data.success) {
      throw new Error(data.error || '音频分析失败');
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('网络请求失败，请检查后端服务是否正常运行');
  }
};

/**
 * 健康检查
 */
export const healthCheck = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${getApiBaseUrl()}/health`);
    return response.ok;
  } catch {
    return false;
  }
};
