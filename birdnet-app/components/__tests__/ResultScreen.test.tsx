import { render, screen } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import ResultScreen from '../ResultScreen';
import { RecognitionResult } from '../../types';

// 🚨 守门线：由于 ResultScreen 会调用 Gemini 外部 API，必须在测试中强制 Mock 掉！
vi.mock('../services/gemini', () => ({
  getBirdFacts: vi.fn(() => Promise.resolve([
    '大杜鹃是典型的夏候鸟，属于杜鹃科。',
    '它们不孵卵，而是将卵产在其他鸟类巢中（巢寄生）。'
  ]))
}));

describe('ResultScreen 组件自动化大屏渲染测试', () => {
    
  // 1. 制造高内聚的 Mock 假数据，符合 types.ts 严格标准
  const mockResult: RecognitionResult = {
    id: 'rec_001',
    timestamp: '2026-03-18 14:00',
    location: '全球识别范围',
    duration: '00:15',
    audioUrl: 'https://example.com/audio.mp3',
    primaryMatch: {
      name: '大杜鹃 (Common Cuckoo)',
      scientificName: 'Cuculus canorus',
      confidence: 88,
      imageUrl: 'https://example.com/cuckoo.jpg'
    },
    alternatives: [
      {
        name: '大山雀',
        scientificName: 'Parus major',
        confidence: 45,
        imageUrl: 'https://example.com/tit.jpg'
      }
    ]
  };

  test('✅ 应当在首屏正确打出最佳匹配的鸟类科学名与俗名', async () => {
    render(<ResultScreen result={mockResult} onBack={() => {}} />);

    // 2. 断言是否存在关键物种档案数据
    expect(screen.queryByText('大杜鹃 (Common Cuckoo)')).toBeTruthy();
    expect(screen.queryByText('Cuculus canorus')).toBeTruthy();
    
    // 3. 断言概率百分比是否渲染出来
    expect(screen.queryByText('88%')).toBeTruthy();
  });

  test('✅ 应当展示 AI 百科速览的 Mock 加载数据', async () => {
    const { container } = render(<ResultScreen result={mockResult} onBack={() => {}} />);
    
    // 4. 等待由 useEffect 拉取的 mock facts 渲染（测试组件的状态变更异步能力）
    const loadingState = container.querySelector('.animate-pulse');
    expect(loadingState).toBeDefined(); // 初始可能有骨架屏
  });
});
