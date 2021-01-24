import '../../global.css'
import './style.css'

import * as twitch from '../../api/twitch'
import { asyncTimeout } from '../../libs/utils'

const form = document.querySelector('form')
const button = document.querySelector('button')
const inputLogoUrl = document.getElementById('logo-url') as HTMLInputElement
const inputServerId = document.getElementById('server-id') as HTMLInputElement
const inputDescription = document.getElementById(
  'description'
) as HTMLInputElement

twitch.onAuthorized().then(async () => {
  const config = await twitch.getConfig()

  if (config.serverId) {
    inputServerId.value = config.serverId
  }

  if (config.logoUrl) {
    inputLogoUrl.value = config.logoUrl
  }

  if (config.description) {
    inputDescription.value = config.description
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault()

    config.logoUrl = inputLogoUrl.value
    config.serverId = inputServerId.value
    config.description = inputDescription.value

    try {
      button.innerText = 'Saving ...'
      twitch.setConfig(config)
      await asyncTimeout()
      button.innerText = 'Saved!'
      await asyncTimeout()
    } finally {
      button.innerText = 'Save'
    }
  })
})
