export function getCookie(name: string) {
  const matches = document.cookie.match(
    new RegExp(
      '(?:^|; )' + name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1') + '=([^;]*)'
    )
  )
  return matches ? decodeURIComponent(matches[1]) : undefined
}

export function setCookie(name: string, value: string, options = {} as any) {
  options = {
    path: '/',
    // при необходимости добавьте другие значения по умолчанию
    ...options,
  }

  if (options.expires instanceof Date) {
    options.expires = options.expires.toUTCString()
  }

  let updatedCookie = encodeURIComponent(name) + '=' + encodeURIComponent(value)

  for (const optionKey in options) {
    updatedCookie += '; ' + optionKey
    const optionValue = options[optionKey]
    if (optionValue !== true) {
      updatedCookie += '=' + optionValue
    }
  }

  document.cookie = updatedCookie
}

export function deleteCookie(name: string) {
  setCookie(name, '', {
    'max-age': -1,
  })
}

export function parseLrc(lrc_s: string) {
  if (lrc_s) {
    lrc_s = lrc_s.replace(/([^\]^\n])\[/g, (match, p1) => p1 + '\n[')
    const lyric = lrc_s.split('\n')
    const lrc = []
    const lyricLen = lyric.length
    for (let i = 0; i < lyricLen; i++) {
      // match lrc time
      const lrcTimes = lyric[i].match(/\[(\d{2}):(\d{2})(\.(\d{2,3}))?]/g)
      // match lrc text
      const lrcText = lyric[i]
        .replace(/.*\[(\d{2}):(\d{2})(\.(\d{2,3}))?]/g, '')
        .replace(/<(\d{2}):(\d{2})(\.(\d{2,3}))?>/g, '')
        .replace(/^\s+|\s+$/g, '')

      if (lrcTimes) {
        // handle multiple time tag
        const timeLen = lrcTimes.length
        for (let j = 0; j < timeLen; j++) {
          const oneTime = /\[(\d{2}):(\d{2})(\.(\d{2,3}))?]/.exec(
            lrcTimes[j]
          ) as any
          const min2sec = oneTime[1] * 60
          const sec2sec = parseInt(oneTime[2])
          const msec2sec = oneTime[4]
            ? parseInt(oneTime[4]) /
              ((oneTime[4] + '').length === 2 ? 100 : 1000)
            : 0
          const lrcTime = min2sec + sec2sec + msec2sec
          lrc.push([lrcTime, lrcText])
        }
      }
    }
    // sort by time
    lrc.sort((a: any, b: any) => a[0] - b[0])
    return lrc
  } else {
    return []
  }
}

export function getElementViewLeft(element: HTMLElement) {
  let actualLeft: number = element.offsetLeft
  let current: any = element.offsetParent
  let elementScrollLeft = 0
  while (current !== null) {
    actualLeft += current.offsetLeft
    current = current.offsetParent
  }
  elementScrollLeft =
    document.body.scrollLeft + document.documentElement.scrollLeft
  return actualLeft - elementScrollLeft
}

export function calculateLineHeadPosition(event: MouseEvent, element: Element) {
  const progressWidth = element.getBoundingClientRect().width
  const leftPosition = element.getBoundingClientRect().left
  let pos = (event.clientX - leftPosition) / progressWidth
  pos = pos < 0 ? 0 : pos
  pos = pos > 1 ? 1 : pos
  return pos
}

export function isEmpty(obj: object) {
  return Object.keys(obj).length === 0 && obj.constructor === Object
}

let downloadUrl = ''

export async function downloadSong(src: string, name: string) {
  try {
    const response = await fetch(src)
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    downloadUrl = url

    const link = document.createElement('a')
    link.href = url
    link.download = `${name}.mp3`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (error) {
    console.error(error)
  }
}
