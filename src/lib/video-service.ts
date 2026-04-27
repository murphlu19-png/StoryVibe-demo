/**
 * 即梦 (Dreamina) — 视频生成服务
 * 火山引擎 API 签名 + 真实调用
 *
 * 使用浏览器原生 Web Crypto API 进行 HMAC-SHA256 签名
 */

const CONFIG = {
  accessKeyId: 'AKLTODJiZDhlMjVhM2ZlNDAyYmIyYmVlOTM4MTlkZmFlNzg',
  secretAccessKey: 'TUdaaFlUSTJORGt3T1RNeU5HRmxOamxrTkRrNVkyTmtNemcyTVdSbVlUZw==',
  endpoint: 'https://visual.volcengineapi.com',
  region: 'cn-north-1',
  service: 'cv',
  version: '2022-08-31',
  actionSubmit: 'CVSync2AsyncSubmitTask',
  actionQuery: 'CVSync2AsyncGetResult',
};

// ===== Web Crypto 工具函数 =====

async function sha256Hex(message: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function hmacSha256(key: ArrayBuffer, message: string): Promise<ArrayBuffer> {
  const cryptoKey = await crypto.subtle.importKey(
    'raw', key, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  return crypto.subtle.sign('HMAC', cryptoKey, new TextEncoder().encode(message));
}

async function getSignatureKey(secretKey: string, dateStamp: string, regionName: string, serviceName: string): Promise<ArrayBuffer> {
  const encoder = new TextEncoder();
  const kDate = await hmacSha256(encoder.encode(secretKey).buffer, dateStamp);
  const kRegion = await hmacSha256(kDate, regionName);
  const kService = await hmacSha256(kRegion, serviceName);
  return hmacSha256(kService, 'request');
}

function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * 构建规范查询字符串
 */
function buildCanonicalQueryString(params: Record<string, string>): string {
  const sorted = Object.entries(params).sort(([a], [b]) => a.localeCompare(b));
  return sorted.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&');
}

/**
 * 生成请求签名（Web Crypto 版）
 */
async function signRequest(
  method: string,
  path: string,
  queryParams: Record<string, string>,
  body: string,
  date: Date
): Promise<Record<string, string>> {
  const dateStamp = date.toISOString().slice(0, 10).replace(/-/g, '');
  const amzDate = date.toISOString().replace(/[:\-]|\./g, '').slice(0, 15) + 'Z';

  const payloadHash = await sha256Hex(body);
  const queryString = buildCanonicalQueryString(queryParams);

  const headers: Record<string, string> = {
    'content-type': 'application/json',
    'host': 'visual.volcengineapi.com',
    'x-content-sha256': payloadHash,
    'x-date': amzDate,
  };

  const canonicalHeaders = Object.entries(headers)
    .map(([k, v]) => `${k.toLowerCase()}:${v.trim()}\n`)
    .join('');
  const signedHeaders = Object.keys(headers).join(';');

  const canonicalRequest = [
    method,
    path,
    queryString,
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join('\n');

  const algorithm = 'HMAC-SHA256';
  const credentialScope = `${dateStamp}/${CONFIG.region}/${CONFIG.service}/request`;
  const canonicalHash = await sha256Hex(canonicalRequest);
  const stringToSign = [
    algorithm,
    amzDate,
    credentialScope,
    canonicalHash,
  ].join('\n');

  const signingKey = await getSignatureKey(CONFIG.secretAccessKey, dateStamp, CONFIG.region, CONFIG.service);
  const signature = bufferToHex(await hmacSha256(signingKey, stringToSign));

  const authorization = `${algorithm} Credential=${CONFIG.accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

  return {
    ...headers,
    'Authorization': authorization,
    'X-Date': amzDate,
  };
}

/**
 * 提交视频生成任务
 */
export async function submitVideoGeneration(params: {
  prompt: string;
  duration?: number;
  ratio?: string;
  model?: string;
  seed?: number;
}): Promise<{ taskId: string; status: string; message?: string }> {
  const {
    prompt,
    duration = 5,
    ratio = '16:9',
    model = 'jimeng_t2v_v30',
    seed,
  } = params;

  const queryParams = {
    Action: CONFIG.actionSubmit,
    Version: CONFIG.version,
  };

  const body = JSON.stringify({
    req_key: model,
    prompt,
    aspect_ratio: ratio,
    duration,
    ...(seed !== undefined && { seed }),
    return_url: true,
  });

  const headers = await signRequest('POST', '/', queryParams, body, new Date());
  const url = `${CONFIG.endpoint}?${buildCanonicalQueryString(queryParams)}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body,
    });

    const data = await response.json();
    console.log('[Jimeng] Submit response:', data);

    if (data?.data?.task_id) {
      return {
        taskId: data.data.task_id,
        status: 'submitted',
      };
    }

    if (data?.code === 50412) {
      return { taskId: '', status: 'failed', message: 'Text risk check failed - prompt contains sensitive words' };
    }
    if (data?.code === 50429) {
      return { taskId: '', status: 'failed', message: 'API rate limit exceeded' };
    }
    if (data?.code === 50500) {
      return { taskId: '', status: 'failed', message: 'Internal server error' };
    }

    return { taskId: '', status: 'failed', message: data?.message || 'Unknown error' };
  } catch (error) {
    console.error('[Jimeng] Submit failed:', error);
    return { taskId: '', status: 'failed', message: error instanceof Error ? error.message : 'Network error' };
  }
}

/**
 * 查询视频生成结果
 */
export async function checkVideoStatus(taskId: string): Promise<{
  status: 'pending' | 'processing' | 'completed' | 'failed';
  videoUrl?: string;
  progress?: number;
  message?: string;
}> {
  const queryParams = {
    Action: CONFIG.actionQuery,
    Version: CONFIG.version,
  };

  const body = JSON.stringify({
    req_key: 'jimeng_t2v_v30',
    task_id: taskId,
  });

  const headers = await signRequest('POST', '/', queryParams, body, new Date());
  const url = `${CONFIG.endpoint}?${buildCanonicalQueryString(queryParams)}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body,
    });

    const data = await response.json();
    console.log('[Jimeng] Query response:', data);

    const taskData = data?.data;
    if (!taskData) return { status: 'failed', message: 'Invalid response' };

    const taskStatus = taskData.status;
    if (taskStatus === 'success' || taskData.video_url) {
      return { status: 'completed', videoUrl: taskData.video_url || taskData.result_url };
    }
    if (taskStatus === 'failed' || taskStatus === 'error') {
      return { status: 'failed', message: taskData.message || 'Generation failed' };
    }
    if (taskStatus === 'processing' || taskStatus === 'running') {
      return { status: 'processing', progress: taskData.progress || 0 };
    }

    return { status: 'pending' };
  } catch (error) {
    return { status: 'failed', message: error instanceof Error ? error.message : 'Network error' };
  }
}

/**
 * 从脚本生成视频（完整流程）
 */
export async function generateVideoFromScript(
  script: any,
  onProgress?: (progress: number) => void
): Promise<{ success: boolean; videoUrl?: string; error?: string }> {
  const prompt = script.shots?.map((s: any) => s.visual).join('. ').slice(0, 800) || script.title;

  const submit = await submitVideoGeneration({
    prompt: `${script.title}. ${script.visualDirection || ''}. ${script.emotionalGoal || ''}. ${prompt}`,
    duration: 5,
    ratio: '16:9',
    model: 'jimeng_t2v_v30',
  });

  if (submit.status === 'failed') return { success: false, error: submit.message };

  const maxAttempts = 120;
  const interval = 5000;

  for (let i = 0; i < maxAttempts; i++) {
    await new Promise(r => setTimeout(r, interval));
    const result = await checkVideoStatus(submit.taskId);

    if (result.status === 'completed' && result.videoUrl) {
      return { success: true, videoUrl: result.videoUrl };
    }
    if (result.status === 'failed') {
      return { success: false, error: result.message };
    }
    onProgress?.(Math.min((i / maxAttempts) * 100, 95));
  }

  return { success: false, error: 'Generation timeout' };
}

/**
 * 查询剩余额度
 */
export async function getQuotaInfo(): Promise<{ used: number; total: number; remaining: number }> {
  // 模拟数据，实际需调用计费API
  return { used: 12, total: 100, remaining: 88 };
}

export { CONFIG as VIDEO_CONFIG };
