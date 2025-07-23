import { LANGUAGES_ENTRIES } from '@/shared/utils'

export const settingsDefinition = [
  {
    id: 'general',
    label: 'General',
    settings: [
      {
        id: 'target_language',
        type: 'select',
        label: 'Main language',
        options: LANGUAGES_ENTRIES,
        description: 'Language used for the translations',
      },
      {
        id: 'second_language',
        type: 'select',
        label: 'Second language',
        options: LANGUAGES_ENTRIES,
        description: 'Alternative language used for main language',
      },
      {
        id: 'toolbar_delay',
        type: 'number',
        label: 'Waiting time to translate',
        min: 0,
        description: 'Milliseconds to wait before translating input text',
      },
      {
        id: 'theme',
        type: 'select',
        label: 'Theme',
        options: ['light', 'dark', 'system'],
      },
      {
        id: 'start_with_selection',
        type: 'boolean',
        label: 'Start with selection',
        description: 'When opening the translator in the toolbar, start with the selected text if there is any',
      },
    ],
  },
] as const
