import type { InternalAxiosRequestConfig } from 'axios'

import axios from 'axios'

import type { AxiosPluginType } from '../core'

interface AxiosRequestConfig extends InternalAxiosRequestConfig {
  skipLimit?: boolean
}

class LimitPromise {
  private _count: number
  private _max: number
  private _taskQueue: any[]

  constructor(max: number) {
    this._max = max || 5 // 当前正在执行的任务数量，默认留一个余量
    this._count = 0 // 等待执行的任务队列
    this._taskQueue = [] // 任务队列
  }

  _createTask(caller: (...arg: any[]) => any, resolve: (value: any | PromiseLike<any>) => void, reject: (reason?: any) => void) {
    return () => {
      caller()
        .then(resolve)
        .catch(reject)
        .finally(() => {
          // 任务队列的消费区，利用Promise的finally方法，在异步任务结束后，取出下一个任务执行
          this._count--
          if (this._taskQueue.length) {
            const task = this._taskQueue.shift()
            task()
          }
        })
      this._count++
    }
  }

  call<T = any>(caller: () => Promise<T>, immediate = false): Promise<T> {
    return new Promise((resolve, reject) => {
      const task = this._createTask(caller, resolve, reject)
      if (this._count < this._max || immediate) {
        task()
      } else {
        this._taskQueue.push(task)
      }
    })
  }
}

export default (max: number = 5): AxiosPluginType => {
  const limit = new LimitPromise(max)

  return {
    request(config: AxiosRequestConfig, instance) {
      instance.request = function (config: AxiosRequestConfig) {
        return limit.call(() => axios(config), config.skipLimit)
      }
      return config
    },
    responseError(error) {
      return error
    }
  }
}
