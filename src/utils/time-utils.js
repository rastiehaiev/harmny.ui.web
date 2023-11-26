const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function padTo2Digits(num) {
  return num.toString().padStart(2, '0')
}

export default {
  convertDurationMsToTime(milliseconds) {
    let seconds = Math.floor(milliseconds / 1000)
    let minutes = Math.floor(seconds / 60)
    let hours = Math.floor(minutes / 60)

    seconds = seconds % 60
    minutes = minutes % 60

    return `${padTo2Digits(hours)}:${padTo2Digits(minutes)}:${padTo2Digits(seconds)}`
  },
  toHumanReadableDate(string) {
    const dateObject = new Date(string)
    const month = monthNames[dateObject.getMonth()]
    const day = dateObject.getDate()
    const hours = dateObject.getHours()
    const minutes = dateObject.getMinutes()
    const seconds = dateObject.getSeconds()

    return `${month} ${day}, ${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  },
  toHumanReadableDuration(durationInMilliseconds) {
    const seconds = Math.floor((durationInMilliseconds / 1000) % 60)
    const minutes = Math.floor((durationInMilliseconds / (1000 * 60)) % 60)
    const hours = Math.floor((durationInMilliseconds / (1000 * 60 * 60)) % 24)
    const days = Math.floor(durationInMilliseconds / (1000 * 60 * 60 * 24))

    let result = ''
    if (days > 0) {
      result += `${days}d `
    }
    if (hours > 0) {
      result += `${hours}h `
    }
    if (minutes > 0) {
      result += `${minutes}m `
    }
    if (seconds > 0) {
      result += `${seconds}s`
    }
    return result.trim()
  },
}
