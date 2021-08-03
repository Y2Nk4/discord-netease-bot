import { login, playlist_detail, user_account, cloudsearch } from 'NeteaseCloudMusicApi'
import * as crypto from 'crypto'
import { promises as fsp } from 'fs'

interface IConstructorConfig{
  email: string|undefined
  password: string|undefined
  cookie?: string
  proxy?: string
}

export default class NetEase{
  cookie: string
  loginStatus: boolean;
  credential: { email: string, password: string }

  constructor(config: IConstructorConfig) {
    this.credential = {
      email: config.email || '',
      password: config.password || ''
    }

    if(config.cookie) this.cookie = config.cookie
  }

  async setCredentials() {
    if(!this.cookie){
      if (await this.credentialRecover()) return true

      let result = await login({
        email: this.credential.email,
        md5_password: NetEase.md5(this.credential.password)
      })

      if (result.status === 200 && result.body.code === 200){
        this.cookie = result.body.cookie
        this.loginStatus = true
        console.log('result', result)
        // @ts-ignore
        console.log('Login Succeeded:', result.body.profile.nickname)
        await this.storeCredentialsCache(this.credential.email, this.cookie)
      } else {
        console.error('Failed to Login:', result.body.msg)
      }
    }
  }

  async credentialRecover() {
    let cachedCredentials = await this.readCredentialsCache()
    if (cachedCredentials[this.credential.email]) {
      let accountDetail = await user_account({
        cookie: cachedCredentials[this.credential.email]
      })
      if (accountDetail.body.account) {
        this.cookie = cachedCredentials[this.credential.email]
        return true
      }
    }

    return false
  }

  async getPlayListInfo(playListId: string) {
    let result = await playlist_detail({
      id: playListId,
      cookie: this.cookie
    })

    console.log(result)
  }

  // Helpers
  async storeCredentialsCache(account: string, cookie: string) {
    let data = await this.readCredentialsCache()
    data[account] = cookie
    await fsp.mkdir('../cache', { recursive: true })
    await fsp.writeFile('../cache/netease_credential.json', JSON.stringify(data), { encoding:'utf8',flag:'w' })
    console.log('stored data')
    return true
  }

  async readCredentialsCache() {
    try {
      let fileData = await fsp.readFile('../cache/netease_credential.json', 'utf-8')
      console.log('cache found')
      return JSON.parse(fileData)
    } catch (e) {
      return {}
    }
  }

  async resolveSong(content: string) {
    console.log(content)
    const res = await cloudsearch({
      keywords: content,
      cookie: this.cookie
    })
    console.log(res)
  }

  static md5(text: string|undefined) {
    return crypto.createHash('md5').update(text || '').digest('hex')
  }
}
