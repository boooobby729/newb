import React from 'react';

const Index = () => {
  return (
    <div className="relative w-full min-h-screen bg-black overflow-hidden flex items-center justify-center">
      {/* 背景模糊层 */}
      <div 
        className="absolute w-[602.5px] h-[906.5px] left-[-59.5px] top-[-25px] opacity-10"
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
        }}
      />
      
      {/* 紫色渐变圆形背景 */}
      <div 
        className="absolute w-[298.5px] h-[193.5px] left-[38.5px] top-[-205.5px] rounded-full opacity-100"
        style={{
          backgroundColor: 'rgba(89, 80, 255, 1)',
          filter: 'blur(500px)',
        }}
      />
      
      {/* 主要内容容器 */}
      <div className="relative w-full max-w-[375px] h-[812px] flex flex-col items-center justify-center px-6">
        {/* 主标题 - 实心文字 */}
        <div className="relative w-full mb-8">
          <h1 
            className="absolute left-[24.5px] top-[299.5px] opacity-80 whitespace-nowrap overflow-hidden text-ellipsis"
            style={{
              fontSize: '37.72px',
              fontFamily: 'Source Han Serif CN, serif',
              fontWeight: 400,
              color: 'rgba(255, 255, 255, 1)',
              lineHeight: '1.2',
            }}
          >
            我们一起触摸湖心，探清自己
          </h1>
          
          {/* 主标题 - 渐变描边文字 */}
          <h1 
            className="absolute left-[56px] top-0 opacity-40 whitespace-nowrap overflow-hidden text-ellipsis"
            style={{
              fontSize: '37.72px',
              fontFamily: 'Source Han Serif CN, serif',
              fontWeight: 400,
              lineHeight: '1.2',
              background: 'linear-gradient(0deg, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'blur(5px)',
            }}
          >
            我们一起触摸湖心，探清自己
          </h1>
        </div>
        
        {/* 底部文字和箭头 */}
        <div className="absolute bottom-[178px] flex flex-col items-center gap-4">
          <span 
            className="opacity-70"
            style={{
              fontSize: '16px',
              fontFamily: 'PingFang SC, sans-serif',
              fontWeight: 400,
              color: 'rgba(255, 255, 255, 1)',
            }}
          >
            探索心湖
          </span>
          
          {/* 向下箭头 */}
          <div 
            className="w-[11px] h-[5.5px] opacity-40 border-white border-l-[1.5px] border-b-[1.5px] border-solid"
            style={{
              transform: 'rotate(-45deg)',
              borderRadius: '0px',
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
