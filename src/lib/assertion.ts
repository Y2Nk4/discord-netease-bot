import * as assert from 'assert'

export function assertEnvironment() {
  assert(process.env.NETEASE_ACCOUNT_EMAIL, 'Email is undefined')
}
