/**
 * 数据映射工具
 * 将后端 API 响应转换为前端数据模型
 */

import { ApiAnalysisResponse, RecognitionResult, BirdMatch } from '../types';

/**
 * 获取鸟类图片 URL
 * 使用占位符图片服务或第三方 API
 */
const getBirdImageUrl = (scientificName: string): string => {
    // 使用 LoremFlickr，这是一个非常稳定的、支持搜索的占位图服务
    // 关键词设为 bird 和 鸟类的科学名称
    const keyword = scientificName.replace(/\s+/g, ',');
    return `https://loremflickr.com/400/300/bird,${keyword}`;
};

/**
 * 格式化时间戳
 */
const formatTimestamp = (): string => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `今天 ${hours}:${minutes}`;
};

/**
 * 格式化音频时长
 */
const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};

/**
 * 生成识别 ID
 */
const generateId = (): string => {
    const num = Math.floor(Math.random() * 1000);
    return `#${num.toString().padStart(3, '0')}`;
};

/**
 * 将 API 检测结果转换为 BirdMatch
 */
const mapDetectionToBirdMatch = (
    detection: ApiAnalysisResponse['detections'][0]
): BirdMatch => {
    return {
        name: detection.common_name || detection.scientific_name,
        scientificName: detection.scientific_name,
        confidence: Math.round(detection.confidence * 100),
        imageUrl: getBirdImageUrl(detection.scientific_name),
    };
};

/**
 * 将后端 API 响应转换为前端 RecognitionResult
 */
export const mapApiResponseToResult = (
    apiResponse: ApiAnalysisResponse,
    locationName: string = '未知位置'
): RecognitionResult => {
    // 按置信度排序
    const sortedDetections = [...apiResponse.detections].sort(
        (a, b) => b.confidence - a.confidence
    );

    // 如果没有检测结果，返回空结果
    if (sortedDetections.length === 0) {
        throw new Error('未检测到鸟类声音，请尝试在更安静的环境中录音');
    }

    // 主要匹配（置信度最高的）
    const primaryMatch = mapDetectionToBirdMatch(sortedDetections[0]);

    // 其他可能（最多取前 3 个）
    const alternatives = sortedDetections
        .slice(1, 4)
        .map(mapDetectionToBirdMatch);

    // 计算音频时长
    const duration = apiResponse.metadata.audio_duration
        ? formatDuration(apiResponse.metadata.audio_duration)
        : '0:15';

    return {
        id: generateId(),
        timestamp: formatTimestamp(),
        location: locationName,
        primaryMatch,
        alternatives,
        duration,
    };
};

/**
 * 根据地理坐标获取位置名称
 * 这里使用简化版本，实际可以调用地理编码 API
 */
export const getLocationName = (
    latitude: number,
    longitude: number
): string => {
    // 简化版本：只返回坐标
    return `${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°`;
};
