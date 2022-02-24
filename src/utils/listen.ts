export function listen(text: string, lang: string) {
  const AUDIO_URL = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(
    text,
  )}&tl=${lang}&total=1&idx=0&textlen=${text.length}&client=tw-ob`

  fetch(AUDIO_URL)
    .then(r => r.blob())
    .then(blob => {
      const audio = new Audio(URL.createObjectURL(blob))

      audio.play()
    })
}
