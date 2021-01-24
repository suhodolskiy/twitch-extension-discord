export const getRandomInt = (min: number, max: number): number => {
  min = Math.ceil(min)
  return Math.floor(Math.random() * (Math.floor(max) - min + 1)) + min
}

export const calcAvatarPosition = (
  radius: number,
  qty: number,
  idx: number,
  size: number
) => {
  const top = Math.sin((360 / qty) * idx * (Math.PI / 180)) * (radius / 2)
  const left = Math.cos((360 / qty) * idx * (Math.PI / 180)) * (radius / 2)
  const offset = radius / 2 - size / 2

  return {
    top: top + offset,
    left: left + offset,
  }
}

export const asyncTimeout = (ms = 1000) => new Promise((r) => setTimeout(r, ms))
