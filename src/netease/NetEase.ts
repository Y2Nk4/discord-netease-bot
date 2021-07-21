import { login, playlist_detail } from 'NeteaseCloudMusicApi'
import * as crypto from 'crypto'

interface IConstructorConfig{
  email: string|undefined
  password: string|undefined
  cookie?: string
  proxy?: string
}

export default class NetEase{
  cookie: string
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
      let result = await login({
        email: this.credential.email,
        md5_password: NetEase.md5(this.credential.password)
      })

      if (result.status === 200 && result.body.code === 200){
        this.cookie = result.body.cookie
        console.log('result', result)
        // @ts-ignore
        console.log('Login Succeeded:', result.body.profile.nickname)
      } else {
        console.error('Failed to Login:', result.body.msg)
      }
    }
  }

  async getPlayListInfo(playListId: string) {
    let result = await playlist_detail({
      id: playListId,
      cookie: this.cookie
    })

    console.log(result)
  }

  static md5(text: string|undefined) {
    return crypto.createHash('md5').update(text || '').digest('hex')
  }
}
