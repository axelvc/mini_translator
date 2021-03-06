import { getLanguages, getMainLang, getSecondLang } from '@/utils'

export type OptionId =
  | 'target_language'
  | 'second_language'
  | 'theme'
  | 'toolbar_delay'
  | 'floating_enabled'
  | 'floating_omit_main'
  | 'floating_position'
  | 'floating_max_width'
  | 'floating_max_height'
  | 'context_enabled'

interface OptionBase<T, K extends string> {
  id: OptionId
  type: K
  label: string
  defaultValue: T
  description?: string
}

interface OptionBoolean extends OptionBase<boolean, 'boolean'> {}

export interface OptionNumber extends OptionBase<number, 'number'> {
  min?: number
  max?: number
}

interface OptionSelect extends OptionBase<string, 'select'> {
  options: string[] | [string, string][]
}

interface OptionText extends OptionBase<string, 'text'> {
  multiline?: boolean
}

interface Category {
  id: string
  name: string
  children: (OptionBoolean | OptionNumber | OptionSelect | OptionText)[]
}

const schema: Category[] = [
  {
    id: 'general',
    name: 'General',
    children: [
      {
        id: 'target_language',
        type: 'select',
        label: 'Target language',
        defaultValue: getMainLang(),
        options: getLanguages(),
        description: 'Language used to all translations',
      },
      {
        id: 'second_language',
        type: 'select',
        label: 'Second language',
        defaultValue: getSecondLang(),
        options: getLanguages(),
        description: 'Language used if the input is same as the target language',
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
        label: 'Waiting time to translate',
        defaultValue: 500,
        min: 0,
        description: 'Time to wait before translating the text (in milliseconds)',
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
        label: 'Omit in target language',
        description: 'Ignore pages with same language as target language',
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
        description: 'Set to "0" to disable',
        defaultValue: 300,
        min: 0,
      },
      {
        id: 'floating_max_height',
        type: 'number',
        label: 'Max Height (px)',
        description: 'Set to "0" to disable',
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
        description:
          'If enabled, you will see in the context menu an option to translate the current page',
        defaultValue: true,
      },
    ],
  },
]

export default schema
