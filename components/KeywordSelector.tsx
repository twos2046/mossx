
import React from 'react';
import { motion } from 'framer-motion';
import { User, Globe, Heart, Clock as ClockIcon } from 'lucide-react';
import { useApp } from '../store/AppContext';
import { DanmeiKeywords } from '../types';

const keywordData = {
  seme: {
    label: '攻方设定',
    icon: User,
    options: ['温柔总裁攻', '冰山医生攻', '阳光学生攻', '腹黑权臣攻', '禁欲教主攻', '傲娇影帝攻']
  },
  uke: {
    label: '受方设定',
    icon: User,
    options: ['清冷美人受', '傲娇学生受', '腹黑助理受', '软糯团宠受', '孤傲将军受', '慵懒黑客受']
  },
  era: {
    label: '时代背景',
    icon: Globe,
    options: ['现代都市', '古代架空', '校园青春', '星际未来', '无限流', '西幻史诗']
  },
  relationship: {
    label: '关系设定',
    icon: Heart,
    options: ['年上', '年下', '强强', '竹马竹马', '天降之星', '宿命之敌']
  },
  plot: {
    label: '情感走向',
    icon: Heart,
    options: ['甜宠', '虐恋情深', '破镜重圆', '治愈互救', '相爱相杀', '先婚后爱']
  },
  length: {
    label: '篇幅要求',
    icon: ClockIcon,
    options: ['短篇1000字', '中篇3000字', '长篇8000字']
  }
};

const KeywordSelector: React.FC = () => {
  const { state, dispatch } = useApp();
  const { keywords } = state;

  const toggleKeyword = (category: keyof DanmeiKeywords, value: string) => {
    const current = keywords[category];
    dispatch({ 
      type: 'SET_KEYWORDS', 
      payload: { [category]: current === value ? undefined : value } 
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
      {(Object.entries(keywordData) as [keyof DanmeiKeywords, any][]).map(([key, data]) => (
        <div key={key} className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-purple-400 uppercase tracking-widest">
            <data.icon size={14} />
            <span>{data.label}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {data.options.map((opt: string) => {
              const isActive = keywords[key] === opt;
              return (
                <motion.button
                  key={opt}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleKeyword(key, opt)}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-medium border transition-all ${
                    isActive
                      ? 'bg-purple-500 text-white border-transparent shadow-md'
                      : 'bg-white/50 dark:bg-white/5 text-gray-500 dark:text-gray-400 border-white/40 dark:border-white/10 hover:border-purple-300'
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

export default KeywordSelector;
