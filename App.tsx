
import React, { useState, useEffect } from 'react';
import { 
  Mountain as MountainIcon, 
  Sun, 
  Cloud, 
  CloudRain, 
  Backpack, 
  Utensils, 
  ArrowLeft, 
  ChevronRight,
  Info,
  MapPin,
  Clock,
  Navigation,
  Trophy,
  CheckCircle2,
  Compass,
  User,
  Heart
} from 'lucide-react';
import { NANJING_MOUNTAINS } from './constants';
import { Mountain, WeatherInfo, Difficulty, AIAdvice, UserStats, Guide } from './types';
import { getHikingAdvice, getNanjingHikingGuides } from './geminiService';

// --- Sub-components ---

const DifficultyBadge: React.FC<{ difficulty: Difficulty }> = ({ difficulty }) => {
  const colorMap = {
    [Difficulty.EASY]: 'bg-green-100 text-green-700 border-green-200',
    [Difficulty.MEDIUM]: 'bg-orange-100 text-orange-700 border-orange-200',
    [Difficulty.HARD]: 'bg-red-100 text-red-700 border-red-200'
  };
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-bold border ${colorMap[difficulty]}`}>
      {difficulty}
    </span>
  );
};

// --- Main App ---

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'discover' | 'guide' | 'weather' | 'profile'>('discover');
  const [selectedMountain, setSelectedMountain] = useState<Mountain | null>(null);
  const [weather, setWeather] = useState<WeatherInfo>({
    condition: 'Sunny',
    temp: 24,
    description: '晴朗'
  });
  const [advice, setAdvice] = useState<AIAdvice | null>(null);
  const [loadingAdvice, setLoadingAdvice] = useState(false);
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loadingGuides, setLoadingGuides] = useState(false);
  
  // User Progress
  const [stats, setStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('nj_hiking_stats');
    return saved ? JSON.parse(saved) : { climbedIds: [], points: 0, rank: '新晋驴友' };
  });

  useEffect(() => {
    localStorage.setItem('nj_hiking_stats', JSON.stringify(stats));
  }, [stats]);

  const fetchAdvice = async (mountain: Mountain) => {
    setLoadingAdvice(true);
    const data = await getHikingAdvice(mountain, weather);
    setAdvice(data);
    setLoadingAdvice(false);
  };

  const fetchGuides = async () => {
    setLoadingGuides(true);
    const data = await getNanjingHikingGuides();
    setGuides(data);
    setLoadingGuides(false);
  };

  const handleSelectMountain = (m: Mountain) => {
    setSelectedMountain(m);
    fetchAdvice(m);
  };

  const handleCheckIn = (m: Mountain) => {
    if (!stats.climbedIds.includes(m.id)) {
      setStats(prev => ({
        ...prev,
        climbedIds: [...prev.climbedIds, m.id],
        points: prev.points + 100,
        rank: prev.climbedIds.length + 1 >= 5 ? '资深驴友' : '新晋驴友'
      }));
      alert(`🎉 恭喜！打卡 ${m.name} 成功！获得100积分。`);
    }
  };

  const toggleWeather = () => {
    const scenarios = [
      { condition: 'Sunny', temp: 28, description: '烈日当空' },
      { condition: 'Rainy', temp: 18, description: '小雨淅沥' },
      { condition: 'Cloudy', temp: 22, description: '多云转晴' }
    ];
    const currentIndex = scenarios.findIndex(s => s.condition === weather.condition);
    setWeather(scenarios[(currentIndex + 1) % scenarios.length]);
  };

  const findNearest = () => {
    const loadingToast = alert("正在利用定位寻找离你最近的山...");
    // Mocking finding nearest mountain
    setTimeout(() => {
      handleSelectMountain(NANJING_MOUNTAINS[0]); // Default to Zijin Shan for demo
    }, 1500);
  };

  useEffect(() => {
    if (activeTab === 'guide' && guides.length === 0) {
      fetchGuides();
    }
  }, [activeTab]);

  const renderDiscover = () => (
    <div className="space-y-6">
      <section>
        <div className="flex justify-between items-center mb-4 px-2">
          <h2 className="text-lg font-bold text-slate-800 italic">“南京哪块好爬？”</h2>
          <span className="text-xs text-slate-400">发现 {NANJING_MOUNTAINS.length} 个登山点</span>
        </div>
        <div className="grid grid-cols-1 gap-5">
          {NANJING_MOUNTAINS.map(m => (
            <div 
              key={m.id}
              onClick={() => handleSelectMountain(m)}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer border border-green-100 group relative"
            >
              {stats.climbedIds.includes(m.id) && (
                <div className="absolute top-3 right-3 z-10 bg-green-500 text-white p-1 rounded-full shadow-lg">
                  <CheckCircle2 size={16} />
                </div>
              )}
              <div className="relative h-48 overflow-hidden">
                <img src={m.imageUrl} alt={m.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-3 left-3"><DifficultyBadge difficulty={m.difficulty} /></div>
              </div>
              <div className="p-4">
                <h3 className="text-xl font-bold text-slate-800">{m.name}</h3>
                <div className="flex justify-between items-center mt-2 text-sm text-slate-500">
                  <span className="flex items-center"><MapPin size={12} className="mr-1" /> {m.englishName}</span>
                  <span className="text-green-600 font-bold">{m.height}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );

  const renderGuides = () => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h2 className="text-xl font-bold text-slate-800 px-2 flex items-center gap-2">
        <Compass className="text-orange-500" /> 爬山哥韶一韶
      </h2>
      {loadingGuides ? (
        <div className="text-center py-20 text-slate-400">正在搜刮攻略...</div>
      ) : (
        guides.map((g, idx) => (
          <div key={idx} className="bg-white p-5 rounded-3xl shadow-sm border border-orange-50 space-y-3">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${g.category === 'safety' ? 'bg-red-400' : 'bg-blue-400'}`}></span>
              <h3 className="font-bold text-slate-700">{g.title}</h3>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">{g.content}</p>
          </div>
        ))
      )}
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6 animate-in zoom-in-95 duration-300 px-2">
      <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="w-20 h-20 bg-white/20 rounded-full mb-4 flex items-center justify-center backdrop-blur-md border border-white/30">
            <User size={40} />
          </div>
          <h2 className="text-2xl font-black mb-1">爬山小能手</h2>
          <p className="text-green-100 text-sm">{stats.rank}</p>
          <div className="mt-6 flex gap-8">
            <div>
              <p className="text-[10px] uppercase font-bold opacity-70">总积分</p>
              <p className="text-2xl font-black">{stats.points}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold opacity-70">打卡山峰</p>
              <p className="text-2xl font-black">{stats.climbedIds.length}</p>
            </div>
          </div>
        </div>
        <div className="absolute -right-10 -bottom-10 opacity-10">
          <Trophy size={200} />
        </div>
      </div>

      <section>
        <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2 px-2">
          <Trophy className="text-yellow-500" size={18} /> 我的荣誉勋章
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {['初试身手', '紫金之巅', '栖霞访枫', '老山勇士', '牛首春踏', '幕府望江'].map((badge, i) => {
            const unlocked = i < stats.climbedIds.length + 1;
            return (
              <div key={i} className={`flex flex-col items-center p-4 rounded-2xl border transition-all ${unlocked ? 'bg-white border-green-100 shadow-sm opacity-100' : 'bg-slate-50 border-slate-100 opacity-40 grayscale'}`}>
                <div className={`w-12 h-12 rounded-full mb-2 flex items-center justify-center ${unlocked ? 'bg-green-100 text-green-600' : 'bg-slate-200 text-slate-400'}`}>
                  {i === 0 ? <Heart size={20} /> : <MountainIcon size={20} />}
                </div>
                <span className="text-[10px] font-bold text-slate-600 text-center">{badge}</span>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );

  return (
    <div className="min-h-screen max-w-md mx-auto bg-green-50 relative pb-28 overflow-x-hidden">
      {/* Header */}
      {!selectedMountain && (
        <header className="bg-white p-6 pb-8 rounded-b-[2rem] shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-black text-green-800">南京爬山小助手</h1>
              <p className="text-slate-500 text-sm">韶一韶南京爬山那些事儿</p>
            </div>
            <button 
              onClick={toggleWeather}
              className="flex flex-col items-center p-3 bg-green-50 rounded-2xl border border-green-100 transition-transform active:scale-95"
            >
              {weather.condition === 'Sunny' && <Sun className="text-yellow-500 mb-1" />}
              {weather.condition === 'Rainy' && <CloudRain className="text-blue-500 mb-1" />}
              {weather.condition === 'Cloudy' && <Cloud className="text-slate-500 mb-1" />}
              <span className="text-[10px] font-bold text-green-700">{weather.temp}°C {weather.description}</span>
            </button>
          </div>

          {/* Quick Stats Banner */}
          <div className="bg-green-800 rounded-2xl p-4 text-white flex justify-between items-center shadow-lg shadow-green-100">
            <div className="flex items-center gap-3">
              <div className="bg-green-700 p-2 rounded-xl">
                <Trophy size={20} />
              </div>
              <div>
                <p className="text-[10px] opacity-70 uppercase font-bold">当前等级</p>
                <p className="font-bold">{stats.rank}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black">{stats.points}</p>
              <p className="text-[10px] opacity-70 uppercase font-bold">积分总计</p>
            </div>
          </div>
        </header>
      )}

      {/* Main Content Area */}
      <main className="p-4">
        {selectedMountain ? (
          <div className="animate-in slide-in-from-right duration-300">
            <button 
              onClick={() => setSelectedMountain(null)}
              className="flex items-center text-green-700 font-bold mb-4 px-3 py-1 bg-white rounded-full shadow-sm border border-green-50"
            >
              <ArrowLeft size={18} className="mr-1" /> 换个山头
            </button>

            <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-xl border border-green-50">
              <div className="relative h-72">
                <img src={selectedMountain.imageUrl} alt={selectedMountain.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <h2 className="text-3xl font-black">{selectedMountain.name}</h2>
                  <p className="opacity-80 text-sm">{selectedMountain.englishName}</p>
                </div>
                <div className="absolute top-6 right-6">
                  <DifficultyBadge difficulty={selectedMountain.difficulty} />
                </div>
              </div>

              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex gap-4">
                    <div className="flex items-center text-slate-400 text-xs">
                      <Navigation size={14} className="mr-1 text-green-500" /> {selectedMountain.height}
                    </div>
                    <div className="flex items-center text-slate-400 text-xs">
                      <Clock size={14} className="mr-1 text-green-500" /> {selectedMountain.estimatedTime}
                    </div>
                  </div>
                  <button 
                    onClick={() => handleCheckIn(selectedMountain)}
                    className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm font-bold transition-all ${stats.climbedIds.includes(selectedMountain.id) ? 'bg-green-100 text-green-700' : 'bg-green-600 text-white shadow-md active:scale-95'}`}
                  >
                    {stats.climbedIds.includes(selectedMountain.id) ? (
                      <><CheckCircle2 size={16} /> 已打卡</>
                    ) : (
                      '立即打卡'
                    )}
                  </button>
                </div>

                <p className="text-slate-600 leading-relaxed mb-8 text-sm italic">“{selectedMountain.description}”</p>

                {/* AI Section */}
                <div className="bg-slate-50 rounded-[2rem] p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="font-black text-slate-800 text-sm uppercase tracking-widest flex items-center gap-2">
                      <Sun className="text-orange-400" size={16} /> 装备补给建议
                    </h4>
                    <span className="text-[10px] bg-white px-2 py-1 rounded-full border border-slate-200 text-slate-400">AI 智能分析</span>
                  </div>

                  {loadingAdvice ? (
                    <div className="py-10 text-center"><div className="w-6 h-6 border-2 border-green-500 border-t-transparent rounded-full animate-spin mx-auto"></div></div>
                  ) : advice && (
                    <div className="space-y-6 animate-in fade-in duration-500">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white p-4 rounded-2xl border border-slate-100">
                          <p className="text-[10px] font-bold text-orange-500 mb-2 flex items-center gap-1"><Backpack size={10} /> 必带装备</p>
                          <ul className="text-xs text-slate-600 space-y-1">
                            {advice.equipment.slice(0, 4).map((e, i) => <li key={i}>• {e}</li>)}
                          </ul>
                        </div>
                        <div className="bg-white p-4 rounded-2xl border border-slate-100">
                          <p className="text-[10px] font-bold text-blue-500 mb-2 flex items-center gap-1"><Utensils size={10} /> 能量干粮</p>
                          <ul className="text-xs text-slate-600 space-y-1">
                            {advice.food.slice(0, 4).map((f, i) => <li key={i}>• {f}</li>)}
                          </ul>
                        </div>
                      </div>
                      <div className="bg-green-800 text-white p-4 rounded-2xl rounded-tr-none relative shadow-lg">
                        <p className="text-sm leading-relaxed italic">“{advice.tips}”</p>
                        <div className="text-right mt-3 opacity-60 text-[10px] font-bold">— 南京爬山哥</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {activeTab === 'discover' && renderDiscover()}
            {activeTab === 'guide' && renderGuides()}
            {activeTab === 'profile' && renderProfile()}
            {activeTab === 'weather' && (
              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-green-100 flex flex-col items-center space-y-6 text-center animate-in zoom-in-95">
                <div className="w-32 h-32 bg-yellow-50 rounded-full flex items-center justify-center">
                   {weather.condition === 'Sunny' ? <Sun size={64} className="text-yellow-500 animate-pulse" /> : <CloudRain size={64} className="text-blue-400" />}
                </div>
                <div>
                  <h2 className="text-4xl font-black text-slate-800">{weather.temp}°C</h2>
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-sm mt-1">{weather.description}</p>
                </div>
                <div className="bg-green-50 p-6 rounded-3xl w-full">
                  <p className="text-green-800 font-bold text-lg mb-2">今日登山指数：100%</p>
                  <p className="text-sm text-green-600">天气太攒了！别搁家呆着了，赶紧出去哈风去！</p>
                </div>
                <button onClick={toggleWeather} className="text-xs text-slate-300 underline">模拟切换天气查看建议</button>
              </div>
            )}
          </>
        )}
      </main>

      {/* Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/90 backdrop-blur-xl border-t border-green-50 px-6 py-4 flex justify-between items-center z-50 rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <button 
          onClick={() => { setActiveTab('discover'); setSelectedMountain(null); }}
          className={`flex flex-col items-center transition-all ${activeTab === 'discover' ? 'text-green-600 scale-110' : 'text-slate-300'}`}
        >
          <MountainIcon size={20} />
          <span className="text-[10px] font-bold mt-1">发现</span>
        </button>
        <button 
          onClick={() => { setActiveTab('guide'); setSelectedMountain(null); }}
          className={`flex flex-col items-center transition-all ${activeTab === 'guide' ? 'text-green-600 scale-110' : 'text-slate-300'}`}
        >
          <Compass size={20} />
          <span className="text-[10px] font-bold mt-1">攻略</span>
        </button>
        
        <div className="relative -top-10">
          <button 
            onClick={findNearest}
            className="w-16 h-16 bg-gradient-to-tr from-green-600 to-green-400 rounded-full shadow-2xl shadow-green-200 flex items-center justify-center text-white ring-8 ring-green-50/50 transition-transform active:scale-90"
          >
            <Navigation size={28} />
          </button>
        </div>

        <button 
          onClick={() => { setActiveTab('weather'); setSelectedMountain(null); }}
          className={`flex flex-col items-center transition-all ${activeTab === 'weather' ? 'text-green-600 scale-110' : 'text-slate-300'}`}
        >
          <Sun size={20} />
          <span className="text-[10px] font-bold mt-1">天气</span>
        </button>
        <button 
          onClick={() => { setActiveTab('profile'); setSelectedMountain(null); }}
          className={`flex flex-col items-center transition-all ${activeTab === 'profile' ? 'text-green-600 scale-110' : 'text-slate-300'}`}
        >
          <User size={20} />
          <span className="text-[10px] font-bold mt-1">我的</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
