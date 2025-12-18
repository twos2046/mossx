
import React, { useState, useEffect, useCallback } from 'react';

interface Props {
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
}

/**
 * 性能优化组件：局部化输入框状态
 * 避免字符级全局 Context 更新导致的重绘压力
 */
const PromptInput: React.FC<Props> = ({ value, onChange, placeholder }) => {
  const [localValue, setLocalValue] = useState(value);

  // 当外部 value 改变时（如点击历史记录），同步局部状态
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleSync = useCallback(() => {
    if (localValue !== value) {
      onChange(localValue);
    }
  }, [localValue, value, onChange]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSync();
      // 这里不直接触发生成，让父组件处理同步后的逻辑
    }
  };

  return (
    <div className="relative group">
      <textarea
        className="w-full bg-white/30 dark:bg-black/20 border border-white/50 dark:border-white/5 rounded-[24px] p-6 focus:ring-4 focus:ring-purple-200 dark:focus:ring-purple-900/30 min-h-[140px] outline-none transition-all placeholder:text-gray-300 dark:placeholder:text-gray-600 text-gray-800 dark:text-gray-200 resize-none shadow-inner"
        placeholder={placeholder}
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onBlur={handleSync}
        onKeyDown={handleKeyDown}
      />
      <div className="absolute bottom-4 right-6 text-[10px] text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
        输入完成或按 Command/Ctrl + Enter 快速同步
      </div>
    </div>
  );
};

export default React.memo(PromptInput);