import * as discord from '../../api/discord'
import * as twitch from '../../api/twitch'
import { getRandomInt, calcAvatarPosition } from '../../libs/utils'

import '../../global.css'
import './style.css'

interface Avatar {
  src: string
  name: string
  index?: number
}

interface Circle {
  avatarCounts?: number
  avatarSize?: number
  avatars?: Avatar[]
  index?: number
  size?: number
  animation?: {
    duration: number
    reverse: boolean
  }
}

const getAvatarComponent = (avatar: Avatar, circle: Circle): HTMLDivElement => {
  const component = document.createElement('div')

  component.classList.add('avatar')

  component.style.backgroundImage = `url(${avatar.src})`
  component.style.height = `${circle.avatarSize}px`
  component.style.width = `${circle.avatarSize}px`

  const { top, left } = calcAvatarPosition(
    circle.size,
    circle.avatars.length,
    avatar.index,
    circle.avatarSize
  )

  component.style.left = `${left}px`
  component.style.top = `${top}px`

  component.style.animationDuration = `${circle.animation.duration}s`

  if (circle.animation.reverse) {
    component.style.animationDirection = 'reverse'
  }

  return component
}

const getCircleComponent = (circle: Circle): HTMLDivElement => {
  const component = document.createElement('div')

  component.classList.add('circle')

  component.style.border = `1px solid rgba(64, 66, 68, ${
    1 - (circle.index / 10) * 2
  })`
  component.style.height = `${circle.size}px`
  component.style.width = `${circle.size}px`

  component.style.marginLeft = `-${circle.size / 2}px`
  component.style.marginTop = `-${circle.size / 2}px`

  component.style.animationDuration = `${circle.animation.duration}s`

  if (circle.animation.reverse) {
    component.style.animationDirection = 'reverse'
  }

  if (circle.avatars) {
    for (const avatar of circle.avatars) {
      component.appendChild(getAvatarComponent(avatar, circle))
    }
  }

  return component
}

const getErrorComponent = (message: string): HTMLDivElement => {
  const component = document.createElement('div')
  component.classList.add('error')
  component.innerText = message
  return component
}

twitch.onAuthorized().then(async () => {
  const config = await twitch.getConfig()
  const footer = document.getElementById('footer')

  if (!config.serverId) {
    footer.appendChild(
      getErrorComponent('Please enter "Server ID" in widget settings')
    )

    return
  }

  const [error, guild] = await discord.getGuild(config.serverId)

  if (error) {
    let errorMessage = error.message

    if (error.code === 50004) {
      errorMessage = 'Widget Disabled. Please enable widget in server settings'
    }

    footer.append(getErrorComponent(errorMessage))

    return
  }

  if (config.link) {
    const links = document.getElementsByTagName('a')

    for (let i = 0; i < links.length; i++) {
      links[i].setAttribute('href', config.link)
    }
  }

  if (config.description) {
    document.getElementById('desc').innerHTML = config.description
  }

  if (config.logoUrl) {
    document.getElementById(
      'logo'
    ).style.backgroundImage = `url(${config.logoUrl})`
  }

  document.getElementById('name').innerHTML = guild.name
  document.getElementById(
    'online'
  ).innerHTML = `${guild.presence_count} members`

  /**
   * Set alt with channel name for all images
   */
  const images = document.querySelectorAll('[alt]')

  for (let i = 0; i < images.length; i++) {
    images[i].setAttribute('alt', guild.name)
  }

  const circles: Circle[] = [
    {
      avatarCounts: 4,
      avatarSize: 27,
    },
    {},
    {
      avatarCounts: 7,
      avatarSize: 36,
    },
    {
      avatarCounts: 9,
      avatarSize: 18,
    },
    {
      avatarCounts: 12,
      avatarSize: 22,
    },
    {},
  ]

  const content = document.getElementById('content')

  /**
   *
   */
  content.style.marginBottom = `${footer.offsetHeight * 0.4}px`

  const members = guild.members.filter((member) => member.avatar_url)

  let circleSize = 86
  let avatarCounter = 0

  for (let i = 0; i < circles.length; i++) {
    const circle = circles[i]

    circle.index = i
    circle.size = circleSize = circleSize + 50 + 10 * i
    circle.animation = {
      duration: getRandomInt(30, 120),
      reverse: Boolean(i % 3),
    }

    if (circle.avatarCounts && avatarCounter < members.length) {
      circle.avatars = []

      for (
        let k = avatarCounter;
        k < avatarCounter + circle.avatarCounts;
        k++
      ) {
        const member = members[k]

        if (member) {
          circle.avatars.push({
            src: member.avatar_url,
            name: member.username,
            index: k - avatarCounter,
          })
        }
      }

      avatarCounter += circle.avatars.length
    }

    content.appendChild(getCircleComponent(circle))
  }
})
