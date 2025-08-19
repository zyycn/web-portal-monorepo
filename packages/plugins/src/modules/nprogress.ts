import type { App } from 'vue'
import type { Router } from 'vue-router'

import 'nprogress/nprogress.css'
import nprogress from 'nprogress'

nprogress.configure({
  easing: 'ease',
  showSpinner: false,
  speed: 500
})

nprogress.start()

const useWithRouter = (router: Router) => {
  router.beforeEach(async (to, from, next) => {
    nprogress.start()
    next()
  })

  router.afterEach(() => {
    nprogress.done()
  })
}

export default {
  install(_app: App, router: Router) {
    useWithRouter(router)
  }
}
