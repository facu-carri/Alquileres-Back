export function getEnumValues<T>(enumObj: T): string[] {
    return Object.keys(enumObj).map(key => enumObj[key]).filter(value => typeof value === 'string') as string[]
}