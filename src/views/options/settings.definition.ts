import { LANGUAGES_ENTRIES } from '@/utils'

export const settingsDefinition = [
  {
    id: 'general',
    label: 'General',
    settings: [
      {
        id: 'target_language',
        type: 'select',
        label: 'Target language',
        options: LANGUAGES_ENTRIES,
        description: 'Language used to all translations',
      },
      {
        id: 'second_language',
        type: 'select',
        label: 'Second language',
        options: LANGUAGES_ENTRIES,
        description: 'Language used if the input is same as the target language',
      },
      {
        id: 'theme',
        type: 'select',
        label: 'Theme',
        options: ['light', 'dark', 'system'],
      },
    ],
  },
  {
    id: 'toolbar',
    label: 'Toolbar translation',
    settings: [
      {
        id: 'toolbar_delay',
        type: 'number',
        label: 'Waiting time to translate',
        min: 0,
        description: 'Time to wait before translating the text (in milliseconds)',
      },
    ],
  },
  {
    id: 'floating',
    label: 'Floating translation',
    settings: [
      {
        id: 'floating_enabled',
        type: 'boolean',
        label: 'Enabled',
      },
      {
        id: 'floating_omit_main',
        type: 'boolean',
        label: 'Omit in target language',
        description: 'Ignore pages with same language as target language',
      },
      {
        id: 'floating_position',
        type: 'select',
        label: 'Position',
        options: ['top', 'bottom', 'left', 'right'],
      },
      {
        id: 'floating_max_width',
        type: 'number',
        label: 'Max Width (px)',
        description: 'Set to "0" to disable',
        min: 0,
      },
      {
        id: 'floating_max_height',
        type: 'number',
        label: 'Max Height (px)',
        description: 'Set to "0" to disable',
        min: 0,
      },
    ],
  },
] as const
