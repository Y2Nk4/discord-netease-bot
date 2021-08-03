import * as dotenv from 'dotenv'
import NetEase from './netease/NetEase'
import DiscordBot from './discordBot/DiscordBot'
import { assertEnvironment } from './lib/assertion'

dotenv.config({ path: '.env' })

assertEnvironment()

;(async () => {
  let netease = new NetEase({
    email: process.env.NETEASE_ACCOUNT_EMAIL,
    password: process.env.NETEASE_ACCOUNT_PASSWORD
  })
  await netease.setCredentials()

  if (!process.env.DISCORD_BOT_TOKEN) throw new Error('Discord bot token has not been set!')
  let discordClient = new DiscordBot(process.env.DISCORD_BOT_TOKEN, netease)
  if (discordClient) {}
})()
