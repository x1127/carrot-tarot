import { useState } from 'react';
import { 
  Settings, 
  Key, 
  Server, 
  Cpu, 
  Save, 
  Eye, 
  EyeOff,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import { useAdminConfigStore } from '../../store/adminConfig';

const presetModels = [
  { value: 'gpt-4o-mini', label: 'GPT-4o Mini', desc: '快速且经济' },
  { value: 'gpt-4o', label: 'GPT-4o', desc: '高质量解读' },
  { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo', desc: '稳定可靠' },
  { value: 'claude-3-sonnet-20240229', label: 'Claude 3 Sonnet', desc: 'Anthropic' },
  { value: 'qwen-plus', label: '通义千问 Plus', desc: '阿里云' },
  { value: 'deepseek-chat', label: 'DeepSeek Chat', desc: '深度思考' },
];

const presetEndpoints = [
  { value: 'https://api.openai.com/v1', label: 'OpenAI', desc: 'api.openai.com' },
  { value: 'https://api.deepseek.com/v1', label: 'DeepSeek', desc: 'api.deepseek.com' },
  { value: 'https://dashscope.aliyuncs.com/compatible-mode/v1', label: '阿里云', desc: 'dashscope.aliyuncs.com' },
  { value: 'https://api.moonshot.cn/v1', label: 'Kimi', desc: 'api.moonshot.cn' },
  { value: 'custom', label: '自定义', desc: '自己填写' },
];

export default function ApiSettings() {
  const config = useAdminConfigStore((state) => state.config);
  const updateApi = useAdminConfigStore((state) => state.updateApi);
  
  const [localApi, setLocalApi] = useState(config.api);
  const [showApiKey, setShowApiKey] = useState(false);
  const [saved, setSaved] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null);

  const handleChange = (key: keyof typeof localApi, value: string | boolean) => {
    setLocalApi(prev => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    updateApi(localApi);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    
    try {
      const response = await fetch(`${localApi.llmBaseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localApi.llmApiKey}`,
        },
        body: JSON.stringify({
          model: localApi.llmModel,
          messages: [{ role: 'user', content: 'test' }],
          max_tokens: 5,
        }),
      });
      
      if (response.ok) {
        setTestResult('success');
      } else {
        setTestResult('error');
      }
    } catch {
      setTestResult('error');
    }
    
    setTesting(false);
  };

  const isConfigured = localApi.llmApiKey.length > 0;

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-amber-400" />
          API配置
        </h1>
        <p className="text-purple-300/70 mt-1">配置AI解读所需的API接口和密钥</p>
      </div>

      {/* 状态卡片 */}
      <div className={`glass-card rounded-2xl p-4 flex items-center justify-between ${
        isConfigured ? 'border-green-500/30' : 'border-red-500/30'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            isConfigured ? 'bg-green-500/20' : 'bg-red-500/20'
          }`}>
            {isConfigured ? (
              <CheckCircle className="w-6 h-6 text-green-400" />
            ) : (
              <AlertCircle className="w-6 h-6 text-red-400" />
            )}
          </div>
          <div>
            <p className="text-white font-medium">
              {isConfigured ? 'AI解读已配置' : 'API密钥未配置'}
            </p>
            <p className="text-sm text-purple-300/60">
              {isConfigured ? '可以使用AI解读功能' : '请配置API密钥以使用AI解读'}
            </p>
          </div>
        </div>
        <button
          onClick={() => handleChange('enableAiInterpretation', !localApi.enableAiInterpretation)}
          disabled={!isConfigured}
          className={`relative w-14 h-8 rounded-full transition-all ${
            localApi.enableAiInterpretation && isConfigured
              ? 'bg-gradient-to-r from-purple-500 to-amber-500'
              : 'bg-purple-500/30'
          } ${!isConfigured ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform ${
            localApi.enableAiInterpretation && isConfigured ? 'translate-x-7' : 'translate-x-1'
          }`} />
        </button>
      </div>

      {/* API密钥 */}
      <section className="glass-card rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
            <Key className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">API密钥</h2>
            <p className="text-sm text-purple-300/60">用于调用AI解读服务</p>
          </div>
        </div>

        <div className="relative">
          <input
            type={showApiKey ? 'text' : 'password'}
            value={localApi.llmApiKey}
            onChange={(e) => handleChange('llmApiKey', e.target.value)}
            placeholder="sk-..."
            className="w-full px-4 py-3 pr-12 bg-purple-950/50 border border-purple-500/20 rounded-xl text-white placeholder-purple-400/50 focus:outline-none focus:border-amber-500/50"
          />
          <button
            onClick={() => setShowApiKey(!showApiKey)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 hover:text-white transition-colors"
          >
            {showApiKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        <div className="flex items-center gap-2 text-sm text-purple-300/60">
          <AlertCircle className="w-4 h-4" />
          <span>密钥仅存储在本地浏览器中，不会上传到服务器</span>
        </div>
      </section>

      {/* 接口地址 */}
      <section className="glass-card rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
            <Server className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">接口地址</h2>
            <p className="text-sm text-purple-300/60">选择或自定义API端点</p>
          </div>
        </div>

        {/* 预设端点 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {presetEndpoints.map((endpoint) => (
            <button
              key={endpoint.value}
              onClick={() => handleChange('llmBaseUrl', endpoint.value)}
              className={`p-3 rounded-xl border transition-all text-left ${
                localApi.llmBaseUrl === endpoint.value
                  ? 'border-amber-500/50 bg-amber-500/10'
                  : 'border-purple-500/20 hover:border-purple-500/40'
              }`}
            >
              <p className="font-medium text-white">{endpoint.label}</p>
              <p className="text-xs text-purple-300/60 truncate">{endpoint.desc}</p>
            </button>
          ))}
        </div>

        {/* 自定义端点输入 */}
        <div>
          <label className="block text-sm text-purple-200 mb-2">自定义接口地址</label>
          <input
            type="text"
            value={localApi.llmBaseUrl}
            onChange={(e) => handleChange('llmBaseUrl', e.target.value)}
            placeholder="https://api.example.com/v1"
            className="w-full px-4 py-3 bg-purple-950/50 border border-purple-500/20 rounded-xl text-white placeholder-purple-400/50 focus:outline-none focus:border-amber-500/50"
          />
        </div>
      </section>

      {/* 模型选择 */}
      <section className="glass-card rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
            <Cpu className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">模型选择</h2>
            <p className="text-sm text-purple-300/60">选择AI模型</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {presetModels.map((model) => (
            <button
              key={model.value}
              onClick={() => handleChange('llmModel', model.value)}
              className={`p-4 rounded-xl border transition-all text-left ${
                localApi.llmModel === model.value
                  ? 'border-amber-500/50 bg-amber-500/10'
                  : 'border-purple-500/20 hover:border-purple-500/40'
              }`}
            >
              <p className="font-medium text-white">{model.label}</p>
              <p className="text-xs text-purple-300/60">{model.desc}</p>
            </button>
          ))}
        </div>

        {/* 自定义模型输入 */}
        <div>
          <label className="block text-sm text-purple-200 mb-2">自定义模型名称</label>
          <input
            type="text"
            value={localApi.llmModel}
            onChange={(e) => handleChange('llmModel', e.target.value)}
            placeholder="输入模型名称"
            className="w-full px-4 py-3 bg-purple-950/50 border border-purple-500/20 rounded-xl text-white placeholder-purple-400/50 focus:outline-none focus:border-amber-500/50"
          />
        </div>
      </section>

      {/* 操作按钮 */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleSave}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-amber-500 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-amber-600 transition-all"
        >
          {saved ? (
            <>
              <CheckCircle className="w-5 h-5" />
              已保存
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              保存配置
            </>
          )}
        </button>
        <button
          onClick={handleTestConnection}
          disabled={!isConfigured || testing}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-purple-500/20 text-purple-200 font-semibold rounded-xl hover:bg-purple-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw className={`w-5 h-5 ${testing ? 'animate-spin' : ''}`} />
          {testing ? '测试中...' : '测试连接'}
        </button>
      </div>

      {/* 测试结果 */}
      {testResult && (
        <div className={`glass-card rounded-2xl p-4 flex items-center gap-3 animate-fade-in-up ${
          testResult === 'success' ? 'border-green-500/30' : 'border-red-500/30'
        }`}>
          {testResult === 'success' ? (
            <>
              <CheckCircle className="w-6 h-6 text-green-400" />
              <div>
                <p className="text-white font-medium">连接成功</p>
                <p className="text-sm text-purple-300/60">API接口配置正确，可以正常使用</p>
              </div>
            </>
          ) : (
            <>
              <AlertCircle className="w-6 h-6 text-red-400" />
              <div>
                <p className="text-white font-medium">连接失败</p>
                <p className="text-sm text-purple-300/60">请检查API密钥和接口地址是否正确</p>
              </div>
            </>
          )}
        </div>
      )}

      {/* 帮助链接 */}
      <div className="glass-card rounded-2xl p-4">
        <div className="flex items-center gap-3 text-sm text-purple-300/70">
          <ExternalLink className="w-4 h-4" />
          <span>获取API密钥请访问对应的AI服务提供商官网</span>
        </div>
      </div>
    </div>
  );
}
