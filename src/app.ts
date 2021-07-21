import * as dotenv from 'dotenv'
import NetEase from './netease/NetEase'
import { assertEnvironment } from './lib/assertion'

dotenv.config({ path: '.env' })

assertEnvironment()

;(async () => {
  let netease = new NetEase({
    email: process.env.NETEASE_ACCOUNT_EMAIL,
    password: process.env.NETEASE_ACCOUNT_PASSWORD,
    cookie: process.env.NETEASE_ACCOUNT_COOKIE
  })
  await netease.setCredentials()

  await netease.getPlayListInfo('3151612344')
})()
