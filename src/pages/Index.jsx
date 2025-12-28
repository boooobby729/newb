import React from 'react';

const Index = () => {
  return (
    <div className="relative w-full min-h-screen bg-black overflow-hidden flex items-center justify-center">
      {/* 半透明白色遮罩背景层 */}
      <div 
        className="absolute opacity-10"
        style={{
          width: '602.5px',
          height: '906.5px',
          left: '-59.5px',
          top: '-25px',
          background: 'rgba(255, 255, 255, 0.1)',
        }}
      />
      
      {/* 紫色渐变圆形模糊背景 */}
      <div 
        className="absolute rounded-full"
        style={{
          width: '298.5px',
          height: '193.5px',
          left: '38.5px',
          top: '-205.5px',
          backgroundColor: 'rgba(89, 80, 255, 1)',
          filter: 'blur(500px)',
        }}
      />
      
      {/* 主要内容容器 - 固定 375px 宽度 */}
      <div className="relative w-[375px] h-screen flex flex-col items-center justify-center">
        {/* 主标题区域 */}
        <div className="relative w-full" style={{ height: '90px', marginTop: '299.5px' }}>
          {/* 主标题 - 实心白色文字 */}
          <h1 
            className="absolute whitespace-nowrap"
            style={{
              left: '24.5px',
              top: '0',
              fontSize: '37.72px',
              fontFamily: "'Noto Serif SC', 'Source Han Serif CN', serif",
              fontWeight: 400,
              color: 'rgba(255, 255, 255, 1)',
              opacity: 0.8,
              lineHeight: '1.2',
              letterSpacing: '0',
            }}
          >
            我们一起触摸湖心，探清自己
          </h1>
          
          {/* 主标题 - 渐变描边模糊文字（叠加效果） */}
          <h1 
            className="absolute whitespace-nowrap"
            style={{
              left: '24.5px',
              top: '0',
              fontSize: '37.72px',
              fontFamily: "'Noto Serif SC', 'Source Han Serif CN', serif",
              fontWeight: 400,
              lineHeight: '1.2',
              letterSpacing: '0',
              opacity: 0.4,
              background: 'linear-gradient(180deg, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'blur(5px)',
            }}
          >
            我们一起触摸湖心，探清自己
          </h1>
        </div>
        
        {/* 底部引导区域 */}
        <div 
          className="absolute flex flex-col items-center gap-4"
          style={{
            bottom: '178px',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        >
          {/* 引导文字 */}
          <span 
            style={{
              fontSize: '16px',
              fontFamily: "'PingFang SC', -apple-system, BlinkMacSystemFont, sans-serif",
              fontWeight: 400,
              color: 'rgba(255, 255, 255, 1)',
              opacity: 0.7,
              letterSpacing: '0',
            }}
          >
            探索心湖
          </span>
          
          {/* 向下箭头指示器 */}
          <div 
            style={{
              width: '11px',
              height: '11px',
              opacity: 0.4,
              borderLeft: '1.5px solid rgba(255, 255, 255, 1)',
              borderBottom: '1.5px solid rgba(255, 255, 255, 1)',
              transform: 'rotate(-45deg)',
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
