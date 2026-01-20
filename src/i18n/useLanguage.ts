import { useTranslation } from 'react-i18next';

import { i18nConfig, languages } from './i18nConfig';

export function useLanguage() {
  const { i18n } = useTranslation();
  const current = i18n.language?.split('-')[0] || i18nConfig.defaultLocale;

  const changeLanguage = (locale: string) => {
    void i18n.changeLanguage(locale);
  };

  return {
    current,
    languages,
    changeLanguage,
  };
}
