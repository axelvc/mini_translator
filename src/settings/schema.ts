interface OptionBase<T, K = string> {
  id: string
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

type Settings = Category[]

// TODO: use real list
const langs = ['en', 'es', 'fr', 'it', 'ja', 'ko', 'pt', 'ru', 'zh']

const schema: Readonly<Settings> = [
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
        description: 'Langauge who wil be used to any translation',
      },
      {
        id: 'second_language',
        type: 'select',
        label: 'Second language',
        defaultValue: 'es',
        options: langs,
        description: 'Language who will be used if the input is same as main language',
      },
    ],
  },
  {
    id: 'appearence',
    name: 'Appearence',
    children: [
      {
        id: 'theme',
        type: 'select',
        label: 'Theme',
        defaultValue: 'system',
        options: ['light', 'dark', 'system'],
      },
      {
        id: 'font_size',
        type: 'select',
        label: 'Font size',
        defaultValue: 'normal',
        options: ['small', 'normal', 'large'],
      },
    ],
  },
  {
    id: 'toolbar_translation',
    name: 'Toolbar translation',
    children: [
      {
        id: 'delay',
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
        id: 'enabled',
        type: 'boolean',
        label: 'Enable',
        defaultValue: true,
      },
      {
        id: 'omit_main',
        type: 'boolean',
        label: 'Omit to translate main language',
        defaultValue: true,
      },
      {
        id: 'position',
        type: 'select',
        label: 'Position',
        defaultValue: 'bottom',
        options: ['top', 'bottom', 'left', 'right'],
      },
      {
        id: 'max_width',
        type: 'number',
        label: 'Max Width (px)',
        defaultValue: 300,
        min: 0,
      },
      {
        id: 'max_height',
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
        id: 'translate_page',
        type: 'boolean',
        label: 'Translate this page',
        defaultValue: true,
      },
      {
        id: 'translate_selection',
        type: 'boolean',
        label: 'Translate selection',
        defaultValue: true,
      },
    ],
  },
  {
    id: 'disable',
    name: 'Disable',
    children: [
      {
        id: 'languages',
        type: 'text',
        label: 'Disable languages',
        defaultValue: '',
      },
      {
        id: 'pages',
        type: 'text',
        label: 'Disable Pages',
        defaultValue: '',
        multiline: true,
      },
    ],
  },
]

export default schema
