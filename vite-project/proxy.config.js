/**
 * @format
 * @Author: wqsong2
 * @Date: 2023/7/12 18:02
 * @Desciption:本地请求转发代理配置
 */
/* eslint-disable */
const proxyArr = [
  {
    context: 'bx_xtpt',
    options: {
      target: 'http://172.30.93.230:8899',
      //target:'http://10.1.203.5:7766',
      // target:'http://36.140.107.198:28080',
      ws: true,
      changeOrigin: true,
      pathRewrite: {
        '^/bx_xtpt': ''
      }
    }
  },
]

module.exports = proxyArr.reduce((acc, cur, idx) => {
  // eslint-disable-next-line no-useless-escape
  acc[`^\/${cur.context}\/[^\.]*((\.do)|(\.html)|(\.woff2)|(\.woff)|(\.ttf)|(\.(.*?)\.*css)|(\.(.*?)\.*js)|(\.(.*?)\.*png)|(\.(.*?)\.*gif)|(\.(.*?)\.*jpg))?$`] = {
    ...cur.options,
    onProxyReq: (proxyReq) => {
      cur.cookie &&
      proxyReq.setHeader('Cookie', `${cur.cookie};Path=/${cur.context}`)
    },
    bypass (req, res, proxyOptions) {
      if (req.method === 'OPTIONS') {
        res.statusCode = 200
        return 'a'
      }
    }
  }
  return acc
}, {})
/* eslint-disable no-new */
