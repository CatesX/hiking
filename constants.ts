
import { Mountain, Difficulty } from './types';

export const NANJING_MOUNTAINS: Mountain[] = [
  {
    id: 'zijin-shan',
    name: '紫金山 (钟山)',
    englishName: 'Purple Mountain',
    description: '南京最著名的山，也是江南四大名山之一。四季皆美，登山道多样。',
    difficulty: Difficulty.MEDIUM,
    height: '448.9米',
    estimatedTime: '2-3小时',
    imageUrl: 'https://picsum.photos/seed/purplemountain/800/600',
    features: ['天文台', '明孝陵', '中山陵', '林间栈道']
  },
  {
    id: 'qixia-shan',
    name: '栖霞山',
    englishName: 'Qixia Mountain',
    description: '“栖霞胜境”，以红枫闻名遐迩。秋季满山红叶，美不胜收。',
    difficulty: Difficulty.EASY,
    height: '286米',
    estimatedTime: '1.5-2小时',
    imageUrl: 'https://picsum.photos/seed/qixiamountain/800/600',
    features: ['红枫', '栖霞寺', '千佛岩']
  },
  {
    id: 'lao-shan',
    name: '老山国家森林公园',
    englishName: 'Lao Shan',
    description: '南京的“绿肺”，森林覆盖率极高，空气清新，适合重装徒步。',
    difficulty: Difficulty.HARD,
    height: '442米',
    estimatedTime: '4-6小时',
    imageUrl: 'https://picsum.photos/seed/laoshan/800/600',
    features: ['森林氧吧', '狮子岭', '兜率寺']
  },
  {
    id: 'mufu-shan',
    name: '幕府山',
    englishName: 'Mufu Mountain',
    description: '临江而立，可以俯瞰滚滚长江，风景开阔。',
    difficulty: Difficulty.EASY,
    height: '190米',
    estimatedTime: '1-1.5小时',
    imageUrl: 'https://picsum.photos/seed/mufushan/800/600',
    features: ['长江景', '达摩古洞', '幕燕滨江']
  },
  {
    id: 'niushou-shan',
    name: '牛首山',
    englishName: 'Niushou Mountain',
    description: '“春牛首”之美誉，现代建筑与自然景观的完美结合。',
    difficulty: Difficulty.EASY,
    height: '243米',
    estimatedTime: '2-3小时',
    imageUrl: 'https://picsum.photos/seed/niushoushan/800/600',
    features: ['佛顶宫', '宏觉寺塔', '春季踏青']
  },
  {
    id: 'fang-shan',
    name: '方山',
    englishName: 'Fang Mountain',
    description: '位于江宁，是一座死火山，山顶平坦如砥。',
    difficulty: Difficulty.EASY,
    height: '209米',
    estimatedTime: '1.5小时',
    imageUrl: 'https://picsum.photos/seed/fangshan/800/600',
    features: ['定林寺', '斜塔', '火山口遗迹']
  }
];
