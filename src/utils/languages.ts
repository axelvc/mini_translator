import * as browser from 'webextension-polyfill'

const enum DefaultLangs {
  Main = 'en',
  Second = 'es',
}

const languages = new Map([
  ['af', 'Afrikaans'],
  ['sq', 'Albanian'],
  ['am', 'Amharic'],
  ['ar', 'Arabic'],
  ['hy', 'Armenian'],
  ['az', 'Azerbaijani'],
  ['eu', 'Basque'],
  ['be', 'Belarusian'],
  ['bn', 'Bengali'],
  ['bs', 'Bosnian'],
  ['bg', 'Bulgarian'],
  ['ca', 'Catalan'],
  ['ceb', 'Cebuano'],
  ['ny', 'Chichewa'],
  ['zh-CN', 'Chinese (Simplified)'],
  ['zh-TW', 'Chinese (Traditional)'],
  ['co', 'Corsican'],
  ['hr', 'Croatian'],
  ['cs', 'Czech'],
  ['da', 'Danish'],
  ['nl', 'Dutch'],
  ['en', 'English'],
  ['eo', 'Esperanto'],
  ['et', 'Estonian'],
  ['tl', 'Filipino'],
  ['fi', 'Finnish'],
  ['fr', 'French'],
  ['fy', 'Frisian'],
  ['gl', 'Galician'],
  ['ka', 'Georgian'],
  ['de', 'German'],
  ['el', 'Greek'],
  ['gu', 'Gujarati'],
  ['ht', 'Haitian Creole'],
  ['ha', 'Hausa'],
  ['haw', 'Hawaiian'],
  ['iw', 'Hebrew'],
  ['hi', 'Hindi'],
  ['hmn', 'Hmong'],
  ['hu', 'Hungarian'],
  ['is', 'Icelandic'],
  ['ig', 'Igbo'],
  ['id', 'Indonesian'],
  ['ga', 'Irish'],
  ['it', 'Italian'],
  ['ja', 'Japanese'],
  ['jw', 'Javanese'],
  ['kn', 'Kannada'],
  ['kk', 'Kazakh'],
  ['km', 'Khmer'],
  ['rw', 'Kinyarwanda'],
  ['ko', 'Korean'],
  ['ku', 'Kurdish (Kurmanji)'],
  ['ky', 'Kyrgyz'],
  ['lo', 'Lao'],
  ['la', 'Latin'],
  ['lv', 'Latvian'],
  ['lt', 'Lithuanian'],
  ['lb', 'Luxembourgish'],
  ['mk', 'Macedonian'],
  ['mg', 'Malagasy'],
  ['ms', 'Malay'],
  ['ml', 'Malayalam'],
  ['mt', 'Maltese'],
  ['mi', 'Maori'],
  ['mr', 'Marathi'],
  ['mn', 'Mongolian'],
  ['my', 'Myanmar (Burmese)'],
  ['ne', 'Nepali'],
  ['no', 'Norwegian'],
  ['or', 'Odia (Oriya)'],
  ['ps', 'Pashto'],
  ['fa', 'Persian'],
  ['pl', 'Polish'],
  ['pt', 'Portuguese'],
  ['pa', 'Punjabi'],
  ['ro', 'Romanian'],
  ['ru', 'Russian'],
  ['sm', 'Samoan'],
  ['gd', 'Scots Gaelic'],
  ['sr', 'Serbian'],
  ['st', 'Sesotho'],
  ['sn', 'Shona'],
  ['sd', 'Sindhi'],
  ['si', 'Sinhala'],
  ['sk', 'Slovak'],
  ['sl', 'Slovenian'],
  ['so', 'Somali'],
  ['es', 'Spanish'],
  ['su', 'Sundanese'],
  ['sw', 'Swahili'],
  ['sv', 'Swedish'],
  ['tg', 'Tajik'],
  ['ta', 'Tamil'],
  ['tt', 'Tatar'],
  ['te', 'Telugu'],
  ['th', 'Thai'],
  ['tr', 'Turkish'],
  ['tk', 'Turkmen'],
  ['uk', 'Ukrainian'],
  ['ur', 'Urdu'],
  ['ug', 'Uyghur'],
  ['uz', 'Uzbek'],
  ['vi', 'Vietnamese'],
  ['cy', 'Welsh'],
  ['xh', 'Xhosa'],
  ['yi', 'Yiddish'],
  ['yo', 'Yoruba'],
  ['zu', 'Zulu'],
])

export function getMainLang(): string {
  const lang = browser.i18n.getUILanguage()
  if (languages.has(lang)) return lang

  // remove second part of language (e.g. en-US -> en)
  const half = lang.substring(0, 2)
  if (languages.has(half)) return half

  return DefaultLangs.Main
}

export function getSecondLang(): string {
  if (getMainLang() === DefaultLangs.Second) {
    return DefaultLangs.Main
  }

  return DefaultLangs.Second
}

export function getLanguages() {
  return [...languages.entries()]
}
