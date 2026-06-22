import rawLanguageData from '@/../../resources/lang/language.json';

export type VCardLanguage = {
  code: string;
  name: string;
  countryCode: string;
  enabled?: boolean;
};

export const enabledLanguageData: VCardLanguage[] = (rawLanguageData as VCardLanguage[]).filter(
  (language) => language.enabled !== false,
);
