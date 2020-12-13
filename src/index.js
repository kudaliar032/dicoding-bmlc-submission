const {getVideoList, downloadVideo} = require('./yt-downloader')
const {router, text, line} = require('bottender/router')

const helpAction = async ctx => {
  await ctx.sendSticker({packageId: 11537, stickerId: 52002769})
  await ctx.sendText('Untuk mendownload video youtube, kamu tinggal kirimkan tautan video yang kamu mau, seperti contoh: "https://www.youtube.com/watch?v=xcFG9qT2kW0" atau "https://youtu.be/xcFG9qT2kW0"')
}

const getVideoListAction = async ctx => {
  const url = ctx.event.text
  const videoList = await getVideoList(url)
  const select10 = videoList.slice(0, 10)
  const template = select10.map(({format_id, format_note, format}) => ({
    title: `Resolusi video ${format_note}`,
    text: `${format}`,
    actions: [
      {
        type: 'postback',
        label: 'Unduh',
        data: `downloadvideo ${url} ${format_id}`,
      }
    ],
  }))
  await ctx.sendText(`Pilih resolusi video yang ingin kamu download ${String.fromCodePoint(0x10007A)}`)
  const altText = "Pilih resolusi video"
  await ctx.sendCarouselTemplate(altText, template)
}

const downloadVideoAction = async ctx => {
  const data = ctx.event.payload.split(" ");
  if (data[0] === 'downloadvideo') {
    await ctx.sendText(`Tadaaa, ini video yang kamu mau ${String.fromCodePoint(0x10008A)}`)
    const videoData = await downloadVideo(data[1], data[2])
    await ctx.sendVideo(videoData)
  }
}

const unknownAction = async ctx => {
  await ctx.sendSticker({packageId: 11537, stickerId: 52002758})
  await ctx.sendText(`Tautan atau perintah yang anda kirimkan belum tepat, kirimkan perintah "BANTUAN" untuk mendapatkan bantuan lebih lanjut${String.fromCodePoint(0x100094)}`)
}

const handleFollowAction = async ctx => {
  await ctx.sendSticker({packageId: 11537, stickerId: 52002734})
  await ctx.sendText(`Hallo, saya YouTube Downloader${String.fromCodePoint(0x100078)}.\nJika anda ingin mendownload video dari youtube anda dapat menggunakan saya, untuk menggunakannya cukup mudah. Anda tinggal kirimkan tautan video yang ingin anda download, pilih resolusi video, dan tada.\nKirimkan perintah "BANTUAN" apabila anda ingin mendapatkan bantuan.`)
}

module.exports = async function App(ctx) {
  // Handle payload message
  if (ctx.event.isPayload) {
    await downloadVideoAction(ctx)
  }

  // Handle text message
  if (ctx.event.isText) {
    return router([
      // Help command
      text(/^bantuan$/i, helpAction),

      // Process youtube url
      text(/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/i, getVideoListAction),

      // Fallback command
      text('*', unknownAction)
    ])
  }

  return router([
    line.follow(handleFollowAction)
  ])
}