import browser from 'webextension-polyfill'
import type Lang from '@/assets/_locales/en/messages.json'
type Key = keyof typeof Lang

const memo = new Map<Key, string>()

export function useI18n() {
  function t(key: Key, substitutions?: string[] | string): string {
    if (!memo.has(key)) {
      memo.set(key, browser.i18n.getMessage(key, substitutions))
    }

    return memo.get(key)!
  }

  return {
    t,
  }
}
