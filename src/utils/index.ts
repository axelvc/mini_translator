export * from './listen'
export * from './translate'
export * from './languages'
export * from './updateTheme'

export const sleep = (ms = 0) => new Promise(resolve => setTimeout(resolve, ms))
