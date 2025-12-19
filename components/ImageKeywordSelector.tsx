
import React from 'react';
import { motion } from 'framer-motion';
import { User, Image as ImageIcon, Palette, Wind, Sun } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { DanmeiImageKeywords } from '../types';

const imageKeywordData = {
  semeFeature: {
    label: '攻方特征',
    icon: User,
    options: ['银发紫眸·挺拔绅士', '黑发黑眸·冷峻总裁', '金发蓝眸·阳光温暖', '高马尾·古风长袍', '军装制服·禁欲克制']
  },
  ukeFeature: {
    label: '受方特征',
    icon: User,
    options: ['清冷美人·优雅高挑', '傲娇可爱·学院风', '黑客少年·简约休闲', '长发飘逸·古风白衣', '红瞳猫系·精致柔弱']
  },
  composition: {
    label: '构图视角',
    icon: ImageIcon,
    options: ['双人互动·近景', '单人特写·侧面', '俯视视角·深景深', '仰视视角·英雄感', '对称美学·群体场景']
  },
  lighting: {
    label: '光影方案',
    icon: Sun,
    options: ['温暖柔和', '梦幻朦胧', '戏剧强烈·丁达尔', '冷调月光', '斑驳树影']
  },
  colorScheme: {
    label: '主色调',
    icon: Palette,
    options: ['薰衣草紫', '樱花粉', '薄荷绿', '珍珠白', '水墨黑白', '夕阳暖橘']
  },
  atmosphere: {
    label: '视觉风格',
    icon: Wind,
    options: ['浪漫唯美', '清新自然', '复古优雅', '现代简约', '赛博霓虹', '中式水墨']
  },
  scene: {
    label: '场景环境',
    icon: Sun,
    options: ['古代庭院', '现代都市', '校园教室', '自然森林', '漫天雪地', '星际空港']
  },
  elements: {
    label: '特效元素',
    icon: Wind,
    options: ['花瓣飞舞', '光影斑驳', '烟雾缭绕', '星光点点', '羽毛飘落', '水波纹理']
  }
};

const ImageKeywordSelector: React.FC = () => {
  const { state, dispatch } = useApp();
  const { imageKeywords } = state;

  const toggleKeyword = (category: keyof DanmeiImageKeywords, value: string) => {
    const current = imageKeywords[category];
    dispatch({ 
      type: 'SET_IMAGE_KEYWORDS', 
      payload: { [category]: current === value ? undefined : value } 
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
      {(Object.entries(imageKeywordData) as [keyof DanmeiImageKeywords, any][]).map(([key, data]) => (
        <div key={key} className="space-y-4">
          <div className="flex items-center gap-2 text-lg font-black text-blue-800 dark:text-blue-300 uppercase tracking-widest">
            <data.icon size={20} className="stroke-[3]" />
            <span>{data.label}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {data.options.map((opt: string) => {
              const isActive = imageKeywords[key] === opt;
              return (
                <motion.button
                  key={opt}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleKeyword(key, opt)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${
                    isActive
                      ? 'bg-blue-700 text-white border-transparent shadow-md'
                      : 'bg-white/60 dark:bg-white/10 text-gray-800 dark:text-gray-200 border-blue-200 dark:border-blue-900/50 hover:border-blue-500'
                  }`}
                >
                  {opt}
                </motion.button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ImageKeywordSelector;
