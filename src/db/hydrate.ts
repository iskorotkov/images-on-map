type ConstructorReturn<T> = T extends new () => infer U ? U : never

export function hydrate<T extends new () => U, U>(constructor: T, value: Object): ConstructorReturn<T> {
  return Object.assign(Object.create(constructor.prototype), value)
}

export function dehydrate<T>(value: T): T {
  const json = JSON.stringify(value)
  console.debug('dehydrated', json)
  return JSON.parse(json) as unknown as T
}
