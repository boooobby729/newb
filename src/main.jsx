import ReactDOM from "react-dom/client";
import React from 'react';
import App from "./App.jsx";
import { NoCodeProvider } from "./contexts/NoCodeContext.jsx";
import "./index.css";

// 确保 HashRouter 能正确初始化
// 如果当前 URL 没有 hash，自动添加 #/
if (!window.location.hash || window.location.hash === '#') {
  window.location.hash = '#/';
}

// 创建根节点并渲染应用
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <NoCodeProvider>
      <App />
    </NoCodeProvider>
  </React.StrictMode>
);

