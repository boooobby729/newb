/**
 * Coze API 调用工具函数
 * 
 * 使用方法：
 * 1. 设置 COZE_API_TOKEN 和 COZE_WORKFLOW_ID
 * 2. 调用 chatWithBot(userMessage) 发送消息并获取回复
 */

// ==================== 配置区域 - 请在这里填写你的信息 ====================
// 默认配置（如果 localStorage 中没有配置，将使用这些值）
const DEFAULT_COZE_API_TOKEN = 'pat_Bwj19XEVSglRJZhNjnuQ2aY0ZUB5CcK6SzGiSunRZSADkZRyR5UHbH3vMe5UJpT4'; // Coze API Token
const DEFAULT_COZE_WORKFLOW_ID = '7588851266873720832'; // Workflow ID

// 从 localStorage 读取配置，如果没有则使用默认值
const getConfig = () => {
  try {
    const storedToken = localStorage.getItem('coze_api_token');
    const storedWorkflowId = localStorage.getItem('coze_workflow_id');
    return {
      token: storedToken || DEFAULT_COZE_API_TOKEN,
      workflowId: storedWorkflowId || DEFAULT_COZE_WORKFLOW_ID,
    };
  } catch (e) {
    console.warn('无法读取 localStorage，使用默认配置:', e);
    return {
      token: DEFAULT_COZE_API_TOKEN,
      workflowId: DEFAULT_COZE_WORKFLOW_ID,
    };
  }
};

// 获取配置的函数
const COZE_API_TOKEN = () => getConfig().token;
const COZE_WORKFLOW_ID = () => getConfig().workflowId;

// 保存配置到 localStorage
export const saveCozeConfig = (token, workflowId) => {
  try {
    if (token) {
      localStorage.setItem('coze_api_token', token);
    }
    if (workflowId) {
      localStorage.setItem('coze_workflow_id', workflowId);
    }
    return true;
  } catch (e) {
    console.error('保存配置失败:', e);
    return false;
  }
};

// 获取配置（用于配置界面显示）
export const getCozeConfig = () => {
  const config = getConfig();
  return {
    token: config.token,
    workflowId: config.workflowId,
  };
};

// API 基础URL（如果使用代理，请使用 '/api/coze'，否则使用 'https://api.coze.cn'）
const API_BASE_URL = '/api/coze'; // 使用代理路径，通过 Vite 代理避免 CORS 问题

// ==================== API 调用函数 ====================

/**
 * 创建会话
 * @returns {Promise<string>} 返回会话ID (conversation_id)
 */
export const createConversation = async () => {
  try {
    console.log('创建会话 - 请求URL:', `${API_BASE_URL}/v1/conversation/create`);
    const response = await fetch(`${API_BASE_URL}/v1/conversation/create`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${COZE_API_TOKEN()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bot_id: '7394767730747981878', // 如果仍然需要创建会话，使用固定的 bot_id（如果不需要可以删除此函数）
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorMessage = `创建会话失败 (HTTP ${response.status})`;
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || errorData.error?.message || errorMessage;
      } catch (e) {
        errorMessage = errorText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('创建会话完整响应:', JSON.stringify(data, null, 2));
    
    // 尝试多种可能的字段路径来提取conversation_id
    let conversationId = 
      data.data?.conversation_id || 
      data.data?.id ||
      data.conversation_id || 
      data.id ||
      data.conversation?.id ||
      data.conversation?.conversation_id ||
      data.result?.conversation_id ||
      data.result?.id;
    
    if (!conversationId) {
      console.error('无法从响应中提取conversation_id');
      console.error('响应数据结构:', JSON.stringify(data, null, 2));
      console.error('尝试的字段路径:');
      console.error('  - data.data?.conversation_id');
      console.error('  - data.data?.id');
      console.error('  - data.conversation_id');
      console.error('  - data.id');
      console.error('  - data.conversation?.id');
      console.error('  - data.conversation?.conversation_id');
      console.error('  - data.result?.conversation_id');
      console.error('  - data.result?.id');
      throw new Error('创建会话成功但未返回会话ID，请查看控制台查看完整响应结构');
    }

    console.log('成功提取会话ID:', conversationId);
    return conversationId;
  } catch (error) {
    console.error('创建会话失败:', error);
    throw error;
  }
};

/**
 * 发送消息并获取回复（使用 Coze Workflow API）
 * @param {string} conversationId - 会话ID（可选，workflow API可能不需要）
 * @param {string} userMessage - 用户消息
 * @param {boolean} stream - 是否使用流式返回（默认false）
 * @returns {Promise<string>} 返回机器人的回复内容
 */
export const sendMessage = async (conversationId, userMessage, stream = false) => {
  try {
    // 使用 Coze Workflows Chat 端点
    const workflowUrl = `${API_BASE_URL}/v1/workflows/chat`;
    const currentWorkflowId = COZE_WORKFLOW_ID();
    console.log('运行工作流 - 请求URL:', workflowUrl);
    console.log('运行工作流 - Workflow ID:', currentWorkflowId);
    console.log('运行工作流 - 用户消息:', userMessage);
    
    // 根据新的 API 格式构建请求体
    const requestBody = {
      workflow_id: currentWorkflowId,
      parameters: {
        CONVERSATION_NAME: 'Default',
        USER_INPUT: userMessage || '',
      },
      additional_messages: [
        {
          content: userMessage || '',
          content_type: 'text',
          role: 'user',
          type: 'question',
        },
      ],
    };
    
    const currentToken = COZE_API_TOKEN();
    console.log('运行工作流 - 请求体:', JSON.stringify(requestBody, null, 2));
    console.log('运行工作流 - Authorization头:', `Bearer ${currentToken ? currentToken.substring(0, 15) + '...' : '未设置'}`);
    console.log('运行工作流 - Token长度:', currentToken ? currentToken.length : 0);
    
    const response = await fetch(workflowUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${currentToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    console.log('运行工作流 - 响应状态:', response.status, response.statusText);
    
    if (!response.ok) {
      const errorText = await response.text();
      const currentToken = COZE_API_TOKEN();
      console.error('运行工作流失败 - HTTP状态:', response.status);
      console.error('运行工作流失败 - 响应内容:', errorText);
      console.error('运行工作流失败 - 请求URL:', workflowUrl);
      console.error('运行工作流失败 - 使用的Token:', currentToken ? `${currentToken.substring(0, 10)}...` : '未设置');
      console.error('运行工作流失败 - Authorization头:', `Bearer ${currentToken ? '已设置' : '未设置'}`);
      
      let errorMessage = `运行工作流失败 (HTTP ${response.status})`;
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.message || errorData.error?.message || errorData.error || errorMessage;
        console.error('运行工作流失败 - 错误详情:', JSON.stringify(errorData, null, 2));
      } catch (e) {
        errorMessage = errorText || errorMessage;
      }
      
      // 401错误的特殊提示
      if (response.status === 401) {
        const currentToken = COZE_API_TOKEN();
        const tokenPrefix = currentToken ? currentToken.substring(0, 15) : '未设置';
        const tokenLength = currentToken ? currentToken.length : 0;
        const tokenSuffix = currentToken && currentToken.length > 20 ? currentToken.substring(currentToken.length - 10) : '';
        
        errorMessage = `API认证失败 (401)。可能的原因：1) API Token无效或已过期 2) Token格式不正确 3) 请检查Token是否正确配置。当前使用的Token前缀: ${tokenPrefix}... 后缀: ...${tokenSuffix} (长度: ${tokenLength})`;
        console.error('========== 401 认证失败 ==========');
        console.error('Token前缀:', tokenPrefix);
        console.error('Token后缀:', tokenSuffix);
        console.error('Token长度:', tokenLength);
        console.error('Token格式检查:');
        console.error('  - Token是否以 "cztei_" 或 "pat_" 开头:', currentToken ? (currentToken.startsWith('cztei_') || currentToken.startsWith('pat_')) : false);
        console.error('  - Token是否包含空格:', currentToken ? currentToken.includes(' ') : false);
        console.error('  - Token是否包含换行符:', currentToken ? currentToken.includes('\n') : false);
        console.error('请确认：');
        console.error('  1) 在 Coze 控制台检查 Token 是否已过期');
        console.error('  2) 重新生成新的 API Token');
        console.error('  3) 确保 Token 没有多余的空格或换行符');
        console.error('  4) 确保 Token 有访问该 Workflow 的权限');
        console.error('===================================');
      }
      
      // 404错误的特殊提示
      if (response.status === 404) {
        errorMessage = `API端点不存在 (404)。请检查：1) API路径是否正确 2) 代理配置是否正确 3) Coze API文档中的正确端点`;
        console.error('404错误提示: 请检查API端点路径，可能路径不正确');
      }
      
      throw new Error(errorMessage);
    }

    // Workflows Chat API 可能返回 SSE (Server-Sent Events) 流式数据或 JSON
    const contentType = response.headers.get('content-type') || '';
    
    let replyText = '';
    let fullResponseData = [];
    
    if (contentType.includes('text/event-stream') || contentType.includes('text/plain')) {
      // 处理 SSE 格式的流式响应
      console.log('检测到 SSE 流式响应，开始解析...');
      
      const text = await response.text();
      console.log('运行工作流 - 原始响应（SSE）:', text.substring(0, 500));
      
      // 解析 SSE 格式
      const lines = text.split('\n');
      let currentEvent = null;
      let currentData = '';
      let eventType = null;
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        
        if (line.startsWith('id:')) {
          // 忽略 id 行
          continue;
        } else if (line.startsWith('event:')) {
          eventType = line.substring(6).trim();
        } else if (line.startsWith('data:')) {
          currentData = line.substring(5).trim();
          
          // 尝试解析 JSON 数据
          try {
            const jsonData = JSON.parse(currentData);
            fullResponseData.push(jsonData);
            
            console.log('SSE 消息事件:', eventType, '数据:', jsonData);
            
            // 从数据中提取内容
            // 方式1: 直接有 content 字段
            if (jsonData.content) {
              const content = typeof jsonData.content === 'string' 
                ? jsonData.content 
                : jsonData.content.text || jsonData.content.content || '';
              if (content) {
                replyText += content;
              }
            }
            // 方式2: data.content
            else if (jsonData.data?.content) {
              const content = typeof jsonData.data.content === 'string'
                ? jsonData.data.content
                : jsonData.data.content.text || jsonData.data.content.content || '';
              if (content) {
                replyText += content;
              }
            }
            // 方式3: data.output 或 data.result
            else if (jsonData.data?.output) {
              const output = typeof jsonData.data.output === 'string'
                ? jsonData.data.output
                : jsonData.data.output.text || jsonData.data.output.content || '';
              if (output) {
                replyText += output;
              }
            }
            else if (jsonData.data?.result) {
              const result = typeof jsonData.data.result === 'string'
                ? jsonData.data.result
                : jsonData.data.result.text || jsonData.data.result.content || '';
              if (result) {
                replyText += result;
              }
            }
            // 方式4: 直接在根级别的文本字段
            else if (jsonData.text || jsonData.message || jsonData.output) {
              replyText += jsonData.text || jsonData.message || jsonData.output || '';
            }
            
            // 方式5: 从 node_type 为 "End" 的消息中提取 content（根据错误信息中的结构）
            // 如果节点完成且有 content，提取它
            if (jsonData.node_type === 'End' && jsonData.content) {
              const content = typeof jsonData.content === 'string' 
                ? jsonData.content 
                : jsonData.content.text || jsonData.content.content || '';
              if (content) {
                replyText = content; // End 节点的 content 通常是最终回复
              }
            }
            
          } catch (e) {
            // 如果不是 JSON，忽略这行
            console.warn('无法解析 SSE 数据行:', currentData.substring(0, 100));
          }
        } else if (line === '') {
          // 空行表示一个事件结束，重置
          currentEvent = null;
          currentData = '';
        }
      }
      
      console.log('SSE 解析完成，提取的内容:', replyText);
      console.log('完整响应数据:', JSON.stringify(fullResponseData, null, 2));
      
      if (!replyText) {
        // 如果没能提取到内容，尝试从最后一个消息中提取
        if (fullResponseData.length > 0) {
          const lastMsg = fullResponseData[fullResponseData.length - 1];
          console.warn('未能直接提取内容，尝试从最后一条消息提取:', lastMsg);
          
          // 尝试各种可能的字段路径
          replyText = lastMsg.content || 
                     lastMsg.data?.content || 
                     lastMsg.data?.output || 
                     lastMsg.data?.result ||
                     lastMsg.text ||
                     lastMsg.message ||
                     '';
        }
      }
      
      if (!replyText) {
        console.warn('无法从 SSE 响应中提取回复内容');
        console.warn('完整响应数据:', JSON.stringify(fullResponseData, null, 2));
        throw new Error('API返回的数据格式不正确，无法提取回复内容，请查看控制台查看完整响应');
      }
      
      console.log('成功提取回复内容:', replyText);
      return replyText;
      
    } else {
      // 如果不是 SSE，尝试作为普通 JSON 处理
      const data = await response.json();
      console.log('运行工作流完整响应:', JSON.stringify(data, null, 2));
      
      // 对于非 SSE 响应，尝试从 JSON 中提取内容
      let replyText = '';
      
      // 方式1: data.data.output 或 data.data.result
      if (data.data?.output) {
        replyText = typeof data.data.output === 'string' 
          ? data.data.output 
          : data.data.output.text || data.data.output.content || data.data.output.message || '';
      }
      else if (data.data?.result) {
        replyText = typeof data.data.result === 'string'
          ? data.data.result
          : data.data.result.text || data.data.result.content || data.data.result.message || '';
      }
      // 方式2: data.output 或 data.result
      else if (data.output) {
        replyText = typeof data.output === 'string' 
          ? data.output 
          : data.output.text || data.output.content || data.output.message || '';
      }
      else if (data.result) {
        replyText = typeof data.result === 'string'
          ? data.result
          : data.result.text || data.result.content || data.result.message || '';
      }
      // 方式3: data.content 或 data.message
      else if (data.data?.content) {
        replyText = typeof data.data.content === 'string' 
          ? data.data.content 
          : data.data.content.text || data.data.content.content || data.data.content.message || '';
      }
      else if (data.content) {
        replyText = typeof data.content === 'string' ? data.content : (data.content.text || data.content.content || data.content.message || '');
      }
      else if (data.message) {
        replyText = typeof data.message === 'string' ? data.message : (data.message.text || data.message.content || '');
      }
      // 方式4: 尝试从 data.data 中递归查找
      else if (data.data) {
        // 递归查找包含文本的字段
        const findTextInObject = (obj) => {
          if (typeof obj === 'string' && obj.trim().length > 0) return obj;
          if (typeof obj !== 'object' || obj === null) return '';
          for (const key of ['text', 'content', 'output', 'result', 'message', 'answer', 'reply']) {
            if (obj[key]) {
              const value = obj[key];
              if (typeof value === 'string' && value.trim().length > 0) return value;
              if (typeof value === 'object') {
                const found = findTextInObject(value);
                if (found) return found;
              }
            }
          }
          return '';
        };
        replyText = findTextInObject(data.data);
      }
      
      if (!replyText) {
        console.warn('无法从 JSON 响应中提取回复内容');
        console.warn('完整响应结构:', JSON.stringify(data, null, 2));
        throw new Error('API返回的数据格式不正确，无法提取回复内容，请查看控制台查看完整响应');
      }
      
      console.log('成功提取回复内容:', replyText);
      return replyText;
    }
  } catch (error) {
    console.error('发送消息失败:', error);
    throw error;
  }
};

/**
 * 完整的对话流程（使用 Workflow API）
 * @param {string} userMessage - 用户消息
 * @returns {Promise<{conversationId: string, reply: string}>} 返回会话ID和回复内容
 */
export const chatWithBot = async (userMessage) => {
  try {
    // 使用 Workflow API 运行工作流
    console.log('使用 Workflow API 运行工作流');
    const reply = await sendMessage(null, userMessage);
    console.log('收到回复:', reply);
    
    return {
      conversationId: null, // Workflow API 可能不需要会话ID
      reply,
    };
  } catch (error) {
    console.error('对话失败:', error);
    throw error;
  }
};

// ==================== 使用示例 ====================

/**
 * 使用示例1: 单次对话（自动创建会话）
 */
export const example1 = async () => {
  try {
    const result = await chatWithBot('你好');
    console.log('回复:', result.reply);
  } catch (error) {
    console.error('错误:', error.message);
  }
};

/**
 * 使用示例2: 多次对话（复用同一会话）
 */
export const example2 = async () => {
  try {
    // 创建会话
    const conversationId = await createConversation();
    
    // 第一次对话
    const reply1 = await sendMessage(conversationId, '你好');
    console.log('第一次回复:', reply1);
    
    // 第二次对话（使用同一个会话）
    const reply2 = await sendMessage(conversationId, '你叫什么名字？');
    console.log('第二次回复:', reply2);
  } catch (error) {
    console.error('错误:', error.message);
  }
};

