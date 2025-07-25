import { useI18n } from '@/shared/composables/useI18n'
import { Settings } from '@/shared/composables/useSettings'
import { LANGUAGES_ENTRIES } from '@/shared/utils/languages'

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
        id: 'start_with_selection',
        type: 'boolean',
        label: t('config_settings_start_with_selection'),
        description: t('config_settings_start_with_selection_description'),
      },
      {
        id: 'theme',
        type: 'select',
        label: t('config_settings_theme'),
        options: [
          ['system', t('config_settings_theme_option_system')],
          ['dark', t('config_settings_theme_option_dark')],
          ['light', t('config_settings_theme_option_light')],
          ['custom', t('config_settings_theme_option_custom')],
        ],
      },
      {
        id: 'custom_theme',
        type: 'multi-text',
        label: t('config_settings_custom_theme'),
        description: t('config_settings_custom_theme_description'),
        condition: ({ theme }: Settings) => theme === 'custom',
        defaultValue: [
          '--c-fg: #f4f7fa;',
          '--c-fg-alt: #8f96ac;',
          '--c-bg: #171923;',
          '--c-bg-alt: #20222c;',
          '--c-input: #4d5266;',
          '--c-input-alt: #2b2e3b;',
          '--c-accent: #4488ff;',
          '--c-error: #be0e23;',
        ].join('\n'),
      },
    ],
  },
] as const
