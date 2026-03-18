
export type AppScreen = 'home' | 'analyzing' | 'result';

export interface BirdMatch {
  name: string;
  scientificName: string;
  confidence: number;
  imageUrl: string;
  description?: string;
}

export interface RecognitionResult {
  id: string;
  timestamp: string;
  location: string;
  primaryMatch: BirdMatch;
  alternatives: BirdMatch[];
  audioUrl?: string;
  duration: string;
}

// 后端 API 响应类型
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
