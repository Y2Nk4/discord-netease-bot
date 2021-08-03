import * as Discord from 'discord.js'
import { EventEmitter } from 'events'
import NetEase from '../netease/NetEase'

export default class DiscordBot extends EventEmitter{
  client: Discord.Client
  netease: NetEase
  connectedMap = new Map()

  constructor(token: string, netease) {
    super()
    this.netease = netease
    this.client = new Discord.Client()
    this.client.login(token)
    this.client.on('message', this.onMessage.bind(this))
  }

  async onMessage(message) {
    // Voice only works in guilds, if the message does not come from a guild,
    // we ignore it
    if (!message.guild) return;


    console.log(message)
    if (message.content === '#join') {
      await this.joinVoiceCmd(message)
    } else if (message.content === '#leave') {
      await this.disconnectCmd(message)
    } else if (message.content.indexOf('#play ') === 0) {
      await this.playCmd(message)
    }
  }

  async joinVoiceCmd(message) {
    if (!this.connectedMap.has(message.guild.id)) {
      // Only try to join the sender's voice channel if they are in one themselves
      if (message.member.voice.channel) {
        const connection = await message.member.voice.channel.join()
        this.connectedMap.set(message.guild.id, {
          guild: message.guild,
          connection
        })
        message.reply(`NetEase Music Bot Joint ${message.channel.guild.name}!`)
      } else {
        message.reply('You need to join a voice channel first!');
      }
    }
  }

  async disconnectCmd(message) {
    if (this.connectedMap.has(message.guild.id)) {
      const { connection } = this.connectedMap.get(message.guild.id)
      connection.disconnect()
      this.connectedMap.delete(message.guild.id)
    }
  }

  async playCmd(message) {
    if (!this.connectedMap.has(message.guild.id)){
      await this.joinVoiceCmd(message)
    }

    const cmd = message.content.split(' ')
    console.log(cmd)
    if (cmd.length <= 1) {
      message.reply(`You have to specify a song!`)
      return
    } else {
      cmd.shift()
      let keywords = cmd.join(' ')
      this.netease.resolveSong(keywords)
    }
  }
}
