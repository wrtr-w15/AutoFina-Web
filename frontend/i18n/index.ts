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
