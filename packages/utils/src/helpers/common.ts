/**
 * 复制文本到剪切板
 * @param text
 */
export function copyText(text: string) {
  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.style.position = 'fixed'
  document.body.appendChild(textarea)
  textarea.select()

  try {
    // 尝试现代 API
    if (!navigator.clipboard.writeText(text)) {
      throw new Error('Clipboard API failed')
    }
  } catch {
    // 降级方案
    document.execCommand('copy')
  } finally {
    document.body.removeChild(textarea)
  }
}

/**
 * 生成随机ID
 */
export function generateRandomId(): string {
  const buffer = new Uint8Array(8)
  window.crypto.getRandomValues(buffer)
  return Array.from(buffer, byte => byte.toString(16).padStart(2, '0')).join('')
}

/**
 * 适配文字大小，动态设置html的font-size值
 */
export function setRootFontSize(minClientWidth: number, maxClientWidth: number) {
  const resize = () => {
    let rootWidth: number
    const rootHtml = document.documentElement
    if (rootHtml.clientWidth < minClientWidth) {
      rootWidth = minClientWidth
    } else if (rootHtml.clientWidth > maxClientWidth) {
      rootWidth = maxClientWidth
    } else {
      rootWidth = rootHtml.clientWidth
    }

    const rem = rootWidth / 12 / 10
    rootHtml.style.fontSize = `${rem}px`
  }

  resize()
  window.onresize = resize
}
