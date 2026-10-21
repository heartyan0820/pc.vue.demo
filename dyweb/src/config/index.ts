export default {
  baseUrl: 'https://dy.ttentau.top/imgs/',
  imgPath: '/imgs/',
  filePreview: 'http://192.168.0.103/static/uploads/'
}
// 站点可能部署在子路径下（GitHub Pages 是 /pc.vue.demo/，Gitee 是 /douyin）。
// 以前这里写死空串，运行时会去请求 /data/users.md → 打到域名根目录 → 404。
// 所以前缀统一从「实际部署路径」推导：
//   1. vite 的 base 是绝对路径时（如 /pc.vue.demo/），直接用；
//   2. base 是 ./ 或 / 时（本项目就是 ./），用当前文档路径推导；
//   3. 其它环境（本地 dev / 根域名部署）推导结果为空串，行为与以前一致。
const pageBase = (() => {
  const fromEnv = import.meta.env.BASE_URL
  if (fromEnv && fromEnv !== './' && fromEnv !== '/') return fromEnv.replace(/\/$/, '')
  if (typeof document !== 'undefined') {
    return new URL('.', document.baseURI).pathname.replace(/\/$/, '')
  }
  return ''
})()

const BASE_URL_MAP = {
  DEV: pageBase,
  PROD: pageBase,
  // GP_PAGES: '/dist',
  GP_PAGES: pageBase,
  GITEE_PAGES: '/douyin',
  UNI: 'https://dy.ttentau.top'
}

export const IS_SUB_DOMAIN = ['GITEE_PAGES', 'GP_PAGES'].includes(import.meta.env.VITE_ENV)
export const IS_GITEE_PAGES = ['GITEE_PAGES'].includes(import.meta.env.VITE_ENV)
export const BASE_URL = BASE_URL_MAP[import.meta.env.VITE_ENV]
export const IMG_URL = BASE_URL + '/images/'
export const FILE_URL = BASE_URL + '/data/'
export const IS_DEV = process.env.NODE_ENV !== 'production'
