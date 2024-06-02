import React from 'react';
import { createRoot } from 'react-dom/client';
import MeetingEditorView from './MeetingEditorView';

// 獲取根 DOM 元素
const container = document.getElementById('root');

// 使用 createRoot API 渲染應用
const root = createRoot(container);
root.render(<MeetingEditorView />);
