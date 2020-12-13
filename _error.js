const Sentry = require('@sentry/node')

module.exports = async function HandleError(context, props) {
  console.error(props.error)

  Sentry.init({
    dsn: process.env.SENTRY_DSN
  })

  await context.sendText(`Ups, terjadi kesalahan ${String.fromCodePoint(0x10007C)}. Mohon maaf atas ketidak nyamanannya, silahkan dicoba beberapa saat lagi. Kirimkan perintah "BANTUAN" untuk mendapatkan bantuan ${String.fromCodePoint(0x10008A)}.`)

  if (process.env.NODE_ENV === 'production') {
    Sentry.captureException(props.error)
  }
  if (process.env.NODE_ENV === 'development') {
    await context.sendText(props.error.stack)
  }
}