const twitch = window.Twitch ? window.Twitch.ext : null

interface Config {
  link?: string
  logoUrl?: string
  serverId?: string
  description?: string
}

export const onAuthorized = async (): Promise<Twitch.ext.Authorized> =>
  new Promise((r) => twitch.onAuthorized(r))

export const getConfig = async (): Promise<Config> => {
  if (!twitch) return

  try {
    return JSON.parse(twitch.configuration.broadcaster?.content)
  } catch {
    return {}
  }
}

export const setConfig = (config: Config = {}) => {
  if (!twitch) return

  if (config) {
    twitch.configuration.set('broadcaster', '', JSON.stringify(config))
  }
}
