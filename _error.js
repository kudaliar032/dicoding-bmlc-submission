module.exports = async function HandleError(context, props) {
  console.error(props.error);
  await context.sendText(`Ups, terjadi kesalahan ${String.fromCodePoint(0x10007C)}. Mohon maaf atas ketidak nyamanannya, silahkan dicoba beberapa saat lagi. Kirimkan perintah "BANTUAN" untuk mendapatkan bantuan ${String.fromCodePoint(0x10008A)}.`);
  if (process.env.NODE_ENV === 'production') {
    // send your error to your error tracker, for example: Sentry
  }
  if (process.env.NODE_ENV === 'development') {
    await context.sendText(props.error.stack);
  }
};