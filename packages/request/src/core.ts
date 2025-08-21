import type { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios'

export interface AxiosPluginType {
  // 请求前置处理
  request?: (config: InternalAxiosRequestConfig, instance: AxiosInstance) => InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>
  // 请求错误处理
  requestError?: (error: any, instance: AxiosInstance) => any
  // 响应前置处理
  response?: (response: AxiosResponse, instance: AxiosInstance) => AxiosResponse | Promise<AxiosResponse>
  // 响应错误处理
  responseError?: (error: any, instance: AxiosInstance) => any
}

export class AxiosPlugin {
  private plugins: AxiosPluginType[] = []

  // 挂载插件到 Axios 实例
  install(axiosInstance: AxiosInstance) {
    // 请求拦截器：按插件注册顺序执行前置逻辑，倒序执行错误逻辑
    axiosInstance.interceptors.request.use(
      async config => {
        for (const plugin of this.plugins) {
          if (plugin.request) config = await plugin.request(config, axiosInstance)
        }
        return config
      },
      async error => {
        for (const plugin of this.plugins) {
          if (plugin.requestError) error = await plugin.requestError(error, axiosInstance)
        }
        return Promise.reject(error)
      }
    )

    // 响应拦截器：按插件注册顺序执行前置逻辑
    axiosInstance.interceptors.response.use(
      async response => {
        for (const plugin of this.plugins) {
          if (plugin.response) response = await plugin.response(response, axiosInstance)
        }
        return response
      },
      async error => {
        for (const plugin of this.plugins) {
          if (plugin.responseError) error = await plugin.responseError(error, axiosInstance)
        }
        return Promise.reject(error)
      }
    )
  }

  // 注册插件（支持链式调用）
  use(plugin: AxiosPluginType): this {
    this.plugins.push(plugin)
    return this
  }
}
