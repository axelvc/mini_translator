import browser from 'webextension-polyfill'
import { useI18n } from '@/shared/composables/useI18n'

const { t } = useI18n()

const enum DefaultLangs {
  Main = 'en',
  Second = 'es',
}

export const LANGUAGES_ENTRIES = [
  ['af', t('lang_af')],
  ['sq', t('lang_sq')],
  ['am', t('lang_am')],
  ['ar', t('lang_ar')],
  ['hy', t('lang_hy')],
  ['az', t('lang_az')],
  ['eu', t('lang_eu')],
  ['be', t('lang_be')],
  ['bn', t('lang_bn')],
  ['bs', t('lang_bs')],
  ['bg', t('lang_bg')],
  ['ca', t('lang_ca')],
  ['ceb', t('lang_ceb')],
  ['ny', t('lang_ny')],
  ['zh-CN', t('lang_zh_CN')],
  ['zh-TW', t('lang_zh_TW')],
  ['co', t('lang_co')],
  ['hr', t('lang_hr')],
  ['cs', t('lang_cs')],
  ['da', t('lang_da')],
  ['nl', t('lang_nl')],
  ['en', t('lang_en')],
  ['eo', t('lang_eo')],
  ['et', t('lang_et')],
  ['tl', t('lang_tl')],
  ['fi', t('lang_fi')],
  ['fr', t('lang_fr')],
  ['fy', t('lang_fy')],
  ['gl', t('lang_gl')],
  ['ka', t('lang_ka')],
  ['de', t('lang_de')],
  ['el', t('lang_el')],
  ['gu', t('lang_gu')],
  ['ht', t('lang_ht')],
  ['ha', t('lang_ha')],
  ['haw', t('lang_haw')],
  ['iw', t('lang_iw')],
  ['hi', t('lang_hi')],
  ['hmn', t('lang_hmn')],
  ['hu', t('lang_hu')],
  ['is', t('lang_is')],
  ['ig', t('lang_ig')],
  ['id', t('lang_id')],
  ['ga', t('lang_ga')],
  ['it', t('lang_it')],
  ['ja', t('lang_ja')],
  ['jw', t('lang_jw')],
  ['kn', t('lang_kn')],
  ['kk', t('lang_kk')],
  ['km', t('lang_km')],
  ['rw', t('lang_rw')],
  ['ko', t('lang_ko')],
  ['ku', t('lang_ku')],
  ['ky', t('lang_ky')],
  ['lo', t('lang_lo')],
  ['la', t('lang_la')],
  ['lv', t('lang_lv')],
  ['lt', t('lang_lt')],
  ['lb', t('lang_lb')],
  ['mk', t('lang_mk')],
  ['mg', t('lang_mg')],
  ['ms', t('lang_ms')],
  ['ml', t('lang_ml')],
  ['mt', t('lang_mt')],
  ['mi', t('lang_mi')],
  ['mr', t('lang_mr')],
  ['mn', t('lang_mn')],
  ['my', t('lang_my')],
  ['ne', t('lang_ne')],
  ['no', t('lang_no')],
  ['or', t('lang_or')],
  ['ps', t('lang_ps')],
  ['fa', t('lang_fa')],
  ['pl', t('lang_pl')],
  ['pt', t('lang_pt')],
  ['pa', t('lang_pa')],
  ['ro', t('lang_ro')],
  ['ru', t('lang_ru')],
  ['sm', t('lang_sm')],
  ['gd', t('lang_gd')],
  ['sr', t('lang_sr')],
  ['st', t('lang_st')],
  ['sn', t('lang_sn')],
  ['sd', t('lang_sd')],
  ['si', t('lang_si')],
  ['sk', t('lang_sk')],
  ['sl', t('lang_sl')],
  ['so', t('lang_so')],
  ['es', t('lang_es')],
  ['su', t('lang_su')],
  ['sw', t('lang_sw')],
  ['sv', t('lang_sv')],
  ['tg', t('lang_tg')],
  ['ta', t('lang_ta')],
  ['tt', t('lang_tt')],
  ['te', t('lang_te')],
  ['th', t('lang_th')],
  ['tr', t('lang_tr')],
  ['tk', t('lang_tk')],
  ['uk', t('lang_uk')],
  ['ur', t('lang_ur')],
  ['ug', t('lang_ug')],
  ['uz', t('lang_uz')],
  ['vi', t('lang_vi')],
  ['cy', t('lang_cy')],
  ['xh', t('lang_xh')],
  ['yi', t('lang_yi')],
  ['yo', t('lang_yo')],
  ['zu', t('lang_zu')],
].sort((a, b) => a[1].localeCompare(b[1]))

const LANGUAGES = new Map(LANGUAGES_ENTRIES as [string, string][])

export function getMainLang(): string {
  const lang = browser.i18n.getUILanguage()
  if (LANGUAGES.has(lang)) return lang

  // remove second part of language (e.g. en-US -> en)
  const half = lang.split('-')[0]
  if (LANGUAGES.has(half)) return half

  return DefaultLangs.Main
}

export function getSecondLang(): string {
  if (getMainLang() === DefaultLangs.Second) {
    return DefaultLangs.Main
  }

  return DefaultLangs.Second
}
