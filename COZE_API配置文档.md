# Coze API 配置文档

## 📋 目录

1. [快速开始](#快速开始)
2. [配置步骤](#配置步骤)
3. [API 端点说明](#api-端点说明)
4. [使用方法](#使用方法)
5. [代理配置](#代理配置)
6. [常见问题](#常见问题)
7. [错误排查](#错误排查)

---

## 🚀 快速开始

### 1. 获取 API Token

1. 登录 [Coze 开放平台](https://www.coze.cn/open)
2. 进入 **个人中心** → **API 密钥**
3. 创建新的 API Token 或使用现有的 Token
4. **重要**：Token 最长有效期为 30 天，请妥善保管

### 2. 获取 Bot ID

1. 在 Coze 平台创建或选择一个 Bot
2. 在 Bot 详情页面的 URL 中找到 `bot_id` 参数
3. 或者在 Bot 设置页面查看 Bot ID

### 3. 配置到项目中

打开 `src/utils/cozeApi.js` 文件，填写以下配置：

```javascript
const COZE_API_TOKEN = '你的API_TOKEN';  // 👈 在这里填写你的 Token
const COZE_BOT_ID = '你的BOT_ID';        // 👈 在这里填写你的 Bot ID
```

---

## ⚙️ 配置步骤

### 步骤 1: 修改配置文件

编辑文件：`src/utils/cozeApi.js`

找到配置区域（文件开头第 11-12 行）：

```javascript
// ==================== 配置区域 - 请在这里填写你的信息 ====================
const COZE_API_TOKEN = '你的API_TOKEN'; // 请替换为你的 Coze API Token
const COZE_BOT_ID = '你的BOT_ID'; // 请替换为你的 Bot ID
```

**示例：**

```javascript
const COZE_API_TOKEN = 'pat_MB1vzZ6uS1jGjtRSMC8Ia4NDzIKngATpkTEk46dmxB5nGABIjiPJQJvlSWJE6PGQ';
const COZE_BOT_ID = '7588562297833652265';
```

### 步骤 2: 配置代理（开发环境）

开发环境下，浏览器会有 CORS 限制，需要通过代理访问 API。

**配置文件：** `vite.config.js`

确保代理配置如下：

```javascript
proxy: {
  "/api/coze": {
    target: "https://api.coze.cn",
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api\/coze/, ""),
    secure: false,
  },
}
```

### 步骤 3: 重启开发服务器

修改配置后，需要重启开发服务器：

```bash
# 停止当前服务器 (Ctrl+C 或 Cmd+C)
# 然后重新启动
npm run dev
```

---

## 📡 API 端点说明

### 1. 创建会话

**端点：** `POST /v1/conversation/create`

**功能：** 创建一个新的对话会话，返回会话ID

**请求参数：**
```json
{
  "bot_id": "你的Bot ID"
}
```

**响应示例：**
```json
{
  "data": {
    "conversation_id": "会话ID"
  }
}
```

### 2. 发送消息

**端点：** `POST /v1/conversation/chat`

**功能：** 发送消息并获取机器人回复

**请求参数：**
```json
{
  "conversation_id": "会话ID",
  "bot_id": "你的Bot ID",
  "query": "用户消息",
  "stream": false
}
```

**响应示例：**
```json
{
  "data": {
    "messages": [
      {
        "role": "assistant",
        "content": "机器人回复内容"
      }
    ]
  }
}
```

---

## 💡 使用方法

### 在 React 组件中使用

```javascript
import { chatWithBot, createConversation, sendMessage } from '../utils/cozeApi';

// 方式1: 单次对话（自动创建会话）
const handleSingleChat = async (userMessage) => {
  try {
    const { conversationId, reply } = await chatWithBot(userMessage);
    console.log('会话ID:', conversationId);
    console.log('机器人回复:', reply);
    // 在这里处理回复内容
  } catch (error) {
    console.error('对话失败:', error.message);
  }
};

// 方式2: 多次对话（复用会话，保持上下文）
const [conversationId, setConversationId] = useState(null);

const handleMultiChat = async (userMessage) => {
  try {
    // 如果没有会话，先创建
    if (!conversationId) {
      const id = await createConversation();
      setConversationId(id);
    }
    
    // 发送消息
    const reply = await sendMessage(conversationId, userMessage);
    console.log('机器人回复:', reply);
    // 在这里处理回复内容
  } catch (error) {
    console.error('发送消息失败:', error.message);
  }
};
```

### 函数说明

#### `createConversation()`
创建新的会话

```javascript
const conversationId = await createConversation();
```

**返回：** `Promise<string>` - 会话ID

#### `sendMessage(conversationId, userMessage, stream?)`
发送消息并获取回复

**参数：**
- `conversationId` (string): 会话ID
- `userMessage` (string): 用户消息
- `stream` (boolean, 可选): 是否使用流式返回，默认 `false`

**返回：** `Promise<string>` - 机器人回复内容

```javascript
const reply = await sendMessage(conversationId, '你好');
```

#### `chatWithBot(userMessage)`
完整的对话流程（创建会话 + 发送消息）

**参数：**
- `userMessage` (string): 用户消息

**返回：** `Promise<{conversationId: string, reply: string}>`

```javascript
const { conversationId, reply } = await chatWithBot('你好');
```

---

## 🔧 代理配置

### 开发环境

使用 Vite 开发服务器的代理功能，配置文件：`vite.config.js`

```javascript
server: {
  proxy: {
    "/api/coze": {
      target: "https://api.coze.cn",
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api\/coze/, ""),
      secure: false,
    },
  },
}
```

**工作原理：**
- 前端请求：`/api/coze/v1/conversation/create`
- 代理转发到：`https://api.coze.cn/v1/conversation/create`
- 这样可以绕过浏览器的 CORS 限制

### 生产环境

生产环境需要根据实际部署情况配置：

**选项1：继续使用代理**
- 在服务器端（如 Nginx）配置代理
- 配置方式类似开发环境的代理

**选项2：直接调用 API**
- 如果服务器允许 CORS，可以修改 `src/utils/cozeApi.js` 中的 `API_BASE_URL`：
```javascript
const API_BASE_URL = 'https://api.coze.cn'; // 直接使用 API 地址
```

---

## ❓ 常见问题

### Q1: API Token 无效或已过期

**错误信息：** `API Token无效或已过期，请检查API Token配置` (HTTP 401)

**解决方法：**
1. 登录 Coze 开放平台
2. 检查 Token 是否过期（最长有效期 30 天）
3. 重新生成新的 Token
4. 更新 `src/utils/cozeApi.js` 中的 `COZE_API_TOKEN`

### Q2: 创建会话成功但未返回会话ID

**错误信息：** `创建会话成功但未返回会话ID`

**解决方法：**
1. 查看浏览器控制台的 `创建会话完整响应` 日志
2. 检查响应数据结构
3. 如果是字段路径问题，可能需要调整代码中的字段提取逻辑

### Q3: API 端点不存在 (404)

**错误信息：** `发送消息失败 (HTTP 404)`

**可能原因：**
1. API 路径不正确
2. 代理配置有问题
3. API 端点已变更

**解决方法：**
1. 查看控制台的 `发送消息 - 请求URL` 日志
2. 检查代理配置是否正确
3. 查看 Coze API 官方文档确认正确的端点路径

### Q4: CORS 跨域错误

**错误信息：** `网络请求失败，可能是CORS问题或网络连接问题`

**解决方法：**
1. 确保 `vite.config.js` 中已配置代理
2. 确保使用 `/api/coze` 作为 API 基础路径（不是 `https://api.coze.cn`）
3. 重启开发服务器

### Q5: 无法提取回复内容

**错误信息：** `API返回的数据格式不正确，无法提取回复内容`

**解决方法：**
1. 查看控制台的 `发送消息完整响应` 日志
2. 检查 API 响应的实际数据结构
3. 可能需要根据实际响应格式调整代码

---

## 🔍 错误排查

### 查看详细日志

代码中已经添加了详细的日志输出，可以通过以下方式查看：

1. **打开浏览器控制台** (F12)
2. **切换到 Console 标签**
3. **查找以下日志：**

```
创建会话 - 请求URL: /api/coze/v1/conversation/create
创建会话完整响应: {...}
发送消息 - 请求URL: /api/coze/v1/conversation/chat
发送消息完整响应: {...}
```

### 检查清单

遇到问题时，请检查以下项目：

- [ ] API Token 是否正确填写
- [ ] Bot ID 是否正确填写
- [ ] 开发服务器是否已重启
- [ ] 代理配置是否正确（`vite.config.js`）
- [ ] 网络连接是否正常
- [ ] 浏览器控制台是否有错误信息
- [ ] API Token 是否已过期

### 测试 API 配置

可以使用以下代码测试配置是否正确：

```javascript
import { createConversation } from '../utils/cozeApi';

// 测试创建会话
createConversation()
  .then(id => {
    console.log('✅ 配置正确，会话ID:', id);
  })
  .catch(error => {
    console.error('❌ 配置有误:', error.message);
  });
```

---

## 📚 相关资源

- **Coze 开放平台：** https://www.coze.cn/open
- **API 文档：** https://www.coze.cn/open/apidocs
- **代码文件位置：** `src/utils/cozeApi.js`
- **配置文件位置：** `vite.config.js`

---

## 📝 更新日志

### v1.0.0 (当前版本)
- ✅ 基础 API 调用功能
- ✅ 会话管理
- ✅ 消息发送和回复提取
- ✅ 代理配置支持
- ✅ 详细错误处理和日志

---

## 💬 技术支持

如果遇到问题：
1. 查看本文档的 **常见问题** 和 **错误排查** 章节
2. 查看浏览器控制台的详细日志
3. 参考 Coze API 官方文档
4. 检查代码中的注释和示例

---

**最后更新：** 2024年






