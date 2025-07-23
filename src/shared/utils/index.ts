export * from './messages'
export * from './languages'

export const sleep = (ms = 0) => new Promise((resolve) => setTimeout(resolve, ms))
