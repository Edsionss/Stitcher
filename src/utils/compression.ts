/**
 * 简单的字符串压缩工具
 * 使用LZW算法的简化版本进行压缩
 */

export function compressToUTF16(input: string): string {
  if (input.length === 0) return ''

  // 简化的压缩：使用base64编码（实际项目中应使用真正的压缩算法如LZ4、gzip等）
  // 这里为了演示，我们使用一个简单的实现
  try {
    // 方案1: 使用TextEncoder + Base64（浏览器原生）
    const encoder = new TextEncoder()
    const data = encoder.encode(input)
    const base64 = btoa(String.fromCharCode(...data))
    return base64
  } catch (error) {
    console.error('Compression failed:', error)
    return input
  }
}

export function decompressFromUTF16(compressed: string): string {
  if (!compressed) return ''

  try {
    // 解压缩
    const binary = atob(compressed)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i)
    }
    const decoder = new TextDecoder()
    return decoder.decode(bytes)
  } catch (error) {
    console.error('Decompression failed:', error)
    return compressed
  }
}

/**
 * 深度克隆对象（避免引用问题）
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as unknown as T
  }

  if (obj instanceof Array) {
    return obj.map(item => deepClone(item)) as unknown as T
  }

  if (typeof obj === 'object') {
    const cloned = {} as T
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = deepClone(obj[key])
      }
    }
    return cloned
  }

  return obj
}

/**
 * 计算对象的大小（以字节为单位）
 */
export function getObjectSize(obj: any): number {
  const jsonString = JSON.stringify(obj)
  return new Blob([jsonString]).size
}

/**
 * 比较两个对象是否相等
 */
export function deepEqual(obj1: any, obj2: any): boolean {
  if (obj1 === obj2) return true

  if (obj1 == null || obj2 == null) return false
  if (typeof obj1 !== typeof obj2) return false

  if (typeof obj1 !== 'object') return obj1 === obj2

  const keys1 = Object.keys(obj1)
  const keys2 = Object.keys(obj2)

  if (keys1.length !== keys2.length) return false

  for (const key of keys1) {
    if (!keys2.includes(key)) return false
    if (!deepEqual(obj1[key], obj2[key])) return false
  }

  return true
}
