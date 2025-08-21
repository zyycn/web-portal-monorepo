import type { AxiosPluginType } from '../core'

/**
 * 业务状态码处理插件，确保此插件作为最后一个使用
 */
export default (callback?: (message: string) => void): AxiosPluginType => {
  return {
    response(response) {
      const { data } = response

      if (data.code !== '0000') {
        const message = data.msg || '服务异常，请稍后重试'
        callback?.(message)

        // 拒绝时返回自定义错误对象
        return Promise.reject({
          code: data.code,
          message,
          raw: response
        })
      }

      return data.body
    }
  }
}
