const youtubeDownloader = require('youtube-dl')

exports.getVideoList = async url => new Promise((resolve, reject) => {
  try {
    youtubeDownloader.getInfo(url, [], (err, info) => {
      if (err) throw err
      const mp4Video = info.formats.filter(video => {
        return video.ext === 'mp4' && video.acodec !== 'none'
      })
      resolve(mp4Video.map(value => ({...value})))
    })
  } catch (e) {
    reject(e)
  }
})

exports.downloadVideo = async (url, format_id) => new Promise((resolve, reject) => {
  try {
    youtubeDownloader.getInfo(url, [], (err, info) => {
      if (err) throw err
      const videoData = info.formats.filter(video => {
        return video.format_id === format_id
      })
      resolve({
        originalContentUrl: videoData[0].url,
        previewImageUrl: info.thumbnail
      })
    })
  } catch (e) {
    reject(e)
  }
})