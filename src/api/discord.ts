interface Member {
  avatar_url: string
  username: string
}

interface Guild {
  id: string
  name: string
  members: Member[]
  instant_invite: string
  presence_count: number
}

interface Error {
  code: number
  message: string
}

export const getGuild = async (guildId: string): Promise<[Error?, Guild?]> => {
  try {
    const response = await fetch(
      `https://discord.com/api/guilds/${guildId}/widget.json`
    )

    const data = await response.json()

    if (response.status !== 200) {
      throw data
    }

    return [null, data]
  } catch (error) {
    return [error, null]
  }
}
