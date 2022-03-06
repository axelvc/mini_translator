export type OptionId =
  | 'main_language'
  | 'second_language'
  | 'theme'
  | 'toolbar_delay'
  | 'floating_enabled'
  | 'floating_omit_main'
  | 'floating_position'
  | 'floating_max_width'
  | 'floating_max_height'
  | 'context_enabled'

interface OptionBase<T, K = string> {
  id: OptionId
  type: K
  label: string
  defaultValue: T
  description?: string
}

interface OptionBoolean extends OptionBase<boolean, 'boolean'> {}

interface OptionNumber extends OptionBase<number, 'number'> {
  min?: number
  max?: number
}

interface OptionSelect extends OptionBase<string, 'select'> {
  options: string[]
}

interface OptionText extends OptionBase<string, 'text'> {
  multiline?: boolean
}

interface Category {
  id: string
  name: string
  children: (OptionBoolean | OptionNumber | OptionSelect | OptionText)[]
}

// TODO: use real list
const langs = ['en', 'es', 'fr', 'it', 'ja', 'ko', 'pt', 'ru', 'zh']

const schema: Category[] = [
  {
    id: 'general',
    name: 'General',
    children: [
      {
        id: 'main_language',
        type: 'select',
        label: 'Main language',
        defaultValue: 'en',
        options: langs,
        description: 'Language used to all translations',
      },
      {
        id: 'second_language',
        type: 'select',
        label: 'Second language',
        defaultValue: 'es',
        options: langs,
        description: 'Language used if the input is same as main language',
      },
      {
        id: 'theme',
        type: 'select',
        label: 'Theme',
        defaultValue: 'system',
        options: ['light', 'dark', 'system'],
      },
    ],
  },
  {
    id: 'toolbar_translation',
    name: 'Toolbar translation',
    children: [
      {
        id: 'toolbar_delay',
        type: 'number',
        label: 'Waiting time to translate (ms)',
        defaultValue: 500,
        min: 0,
      },
    ],
  },
  {
    id: 'floating',
    name: 'Floating translation',
    children: [
      {
        id: 'floating_enabled',
        type: 'boolean',
        label: 'Enabled',
        defaultValue: true,
      },
      {
        id: 'floating_omit_main',
        type: 'boolean',
        label: 'Omit in main language',
        defaultValue: true,
      },
      {
        id: 'floating_position',
        type: 'select',
        label: 'Position',
        defaultValue: 'bottom',
        options: ['top', 'bottom', 'left', 'right'],
      },
      {
        id: 'floating_max_width',
        type: 'number',
        label: 'Max Width (px)',
        defaultValue: 300,
        min: 0,
      },
      {
        id: 'floating_max_height',
        type: 'number',
        label: 'Max Height (px)',
        defaultValue: 300,
        min: 0,
      },
    ],
  },
  {
    id: 'context_menu',
    name: 'Context menu',
    children: [
      {
        id: 'context_enabled',
        type: 'boolean',
        label: 'Enabled',
        defaultValue: true,
      },
    ],
  },
]

export default schema
