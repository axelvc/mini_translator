import { useI18n } from '@/shared/composables/useI18n'
import { LANGUAGES_ENTRIES } from '@/shared/utils'

const { t } = useI18n()

export const settingsDefinition = [
  {
    id: 'general',
    label: t('config_label'),
    settings: [
      {
        id: 'target_language',
        type: 'select',
        label: t('config_settings_target_language'),
        options: LANGUAGES_ENTRIES,
        description: t('config_settings_target_language_description'),
      },
      {
        id: 'second_language',
        type: 'select',
        label: t('config_settings_second_language'),
        options: LANGUAGES_ENTRIES,
        description: t('config_settings_second_language_description'),
      },
      {
        id: 'toolbar_delay',
        type: 'number',
        label: t('config_settings_tooltip_delay'),
        min: 0,
        description: t('config_settings_tooltip_delay_description'),
      },
      {
        id: 'theme',
        type: 'select',
        label: t('config_settings_theme'),
        options: [
          ['system', t('config_settings_theme_option_system')],
          ['dark', t('config_settings_theme_option_dark')],
          ['light', t('config_settings_theme_option_light')],
        ],
      },
      {
        id: 'start_with_selection',
        type: 'boolean',
        label: t('config_settings_start_with_selection'),
        description: t('config_settings_start_with_selection_description'),
      },
    ],
  },
] as const
