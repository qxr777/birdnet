
import React, { useState, useCallback } from 'react';
import { AppScreen, RecognitionResult } from './types';
import HomeScreen from './components/HomeScreen';
import AnalyzingScreen from './components/AnalyzingScreen';
import ResultScreen from './components/ResultScreen';
import { AudioRecorder, getGeolocation } from './services/audioRecorder';
import { analyzeAudio } from './services/api';
import { mapApiResponseToResult, getLocationName } from './utils/dataMapper';

const App: React.FC = () => {
  const [screen, setScreen] = useState<AppScreen>('home');
  const [result, setResult] = useState<RecognitionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);

  const recorder = new AudioRecorder();

  const startRecording = useCallback(async () => {
    try {
      setError(null);
      setScreen('analyzing');
      setIsRecording(true);

      // 开始录音（15秒）
      await recorder.startRecording({ maxDuration: 15000 });

      // 等待录音完成
      setTimeout(async () => {
        try {
          const audioBlob = await recorder.stopRecording();
          setIsRecording(false);

          // 创建本地播放链接
          const audioUrl = URL.createObjectURL(audioBlob);

          // 获取地理位置（可选）
          const location = await getGeolocation();

          // 调用 API 分析音频
          const apiResponse = await analyzeAudio(audioBlob, location || undefined);

          // 转换数据格式
          const locationName = location
            ? getLocationName(location.latitude, location.longitude)
            : '未知位置';

          const recognitionResult = mapApiResponseToResult(apiResponse, locationName);
          recognitionResult.audioUrl = audioUrl; // 注入播放链接

          setResult(recognitionResult);
          setScreen('result');
        } catch (err) {
          handleError(err);
        }
      }, 15000);

    } catch (err) {
      handleError(err);
    }
  }, []);

  const handleCancelAnalysis = useCallback(() => {
    recorder.cancelRecording();
    setIsRecording(false);
    setScreen('home');
    setResult(null);
    setError(null);
  }, []);

  const reset = useCallback(() => {
    setScreen('home');
    setResult(null);
    setError(null);
  }, []);

  const handleFileUpload = useCallback(async (file: File) => {
    try {
      setError(null);
      setScreen('analyzing');
      setIsRecording(false);

      // 直接使用原始文件
      const audioBlob = file;
      const audioUrl = URL.createObjectURL(file); // 创建本地播放链接

      // 获取地理位置（可选）
      const location = await getGeolocation();

      // 调用 API 分析音频，传递原始文件名
      const apiResponse = await analyzeAudio(audioBlob, location || undefined, file.name);

      // 转换数据格式
      const locationName = location
        ? getLocationName(location.latitude, location.longitude)
        : '上传的文件';

      const recognitionResult = mapApiResponseToResult(apiResponse, locationName);
      recognitionResult.audioUrl = audioUrl; // 注入播放链接

      setResult(recognitionResult);
      setScreen('result');
    } catch (err) {
      handleError(err);
    }
  }, []);

  const handleError = (err: unknown) => {
    const errorMessage = err instanceof Error ? err.message : '发生未知错误';
    setError(errorMessage);
    setScreen('home');
    setIsRecording(false);

    // 显示错误提示
    alert(`错误: ${errorMessage}`);
  };

  return (
    <div className="h-screen w-full overflow-hidden flex flex-col items-center bg-background-dark text-white font-display">
      <div className="w-full h-full max-w-[480px] relative shadow-2xl overflow-hidden bg-black">
        {screen === 'home' && (
          <HomeScreen
            onStartRecording={startRecording}
            onFileUpload={handleFileUpload}
          />
        )}
        {screen === 'analyzing' && (
          <AnalyzingScreen
            onCancel={handleCancelAnalysis}
            isRecording={isRecording}
          />
        )}
        {screen === 'result' && result && (
          <ResultScreen result={result} onBack={reset} />
        )}
      </div>
    </div>
  );
};

export default App;
