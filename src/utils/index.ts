export * from './listen'
export * from './translate'
export * from './languages'

export const sleep = (ms = 0) => new Promise(resolve => setTimeout(resolve, ms))
