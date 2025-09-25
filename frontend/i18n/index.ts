import en from './en.json'
import ru from './ru.json'
import uk from './uk.json'

export type Locale = 'en' | 'ru' | 'uk'
export type Dictionary = typeof en

const dictionaries: Record<Locale, Dictionary> = { en, ru, uk }

export function getDictionary(locale: string | undefined): Dictionary {
  if (locale === 'ru') return dictionaries.ru
  if (locale === 'uk') return dictionaries.uk
  return dictionaries.en
}

// Simple translator with dot-path lookup
export function useTranslation() {
  const stored = typeof window !== 'undefined' ? window.localStorage.getItem('locale') : null
  const browser = typeof navigator !== 'undefined' ? navigator.language?.slice(0, 2) : 'ru'
  const locale = (stored as Locale) || (['ru','uk','en'].includes(browser) ? (browser as Locale) : 'ru')
  const dict = getDictionary(locale)

  const t = (path: string): any => {
    const parts = path.split('.')
    let cur: any = dict
    for (const p of parts) {
      if (cur && typeof cur === 'object' && p in cur) {
        cur = cur[p]
      } else {
        return path
      }
    }
    return cur
  }

  const setLocale = (next: Locale) => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('locale', next)
      window.location.reload()
    }
  }

  return { t, locale, setLocale }
}
