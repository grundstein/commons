export function ip(a: any): boolean
export namespace ip {
  /**
   * Checks if value is a valid IPv4 address
   * @param {any} a - Value to check
   * @returns {boolean}
   */
  function v4(a: any): boolean
  /**
   * Checks if value is a valid IPv6 address
   * @param {any} a - Value to check
   * @returns {boolean}
   */
  function v6(a: any): boolean
}
export const is: {
  ip: {
    (a: any): boolean
    v4(a: any): boolean
    v6(a: any): boolean
  }
  isDeepEqual: {
    (a: unknown, b: unknown): boolean
    (a: unknown): (c: unknown) => boolean
  }
  deepEqual: {
    (a: unknown, b: unknown): boolean
    (a: unknown): (c: unknown) => boolean
  }
  deepEq: {
    (a: unknown, b: unknown): boolean
    (a: unknown): (c: unknown) => boolean
  }
  isDeepDifferent: {
    (a: unknown, b: unknown): boolean
    (a: unknown): (c: unknown) => boolean
  }
  deepDifferent: {
    (a: unknown, b: unknown): boolean
    (a: unknown): (c: unknown) => boolean
  }
  deepDiff: {
    (a: unknown, b: unknown): boolean
    (a: unknown): (c: unknown) => boolean
  }
  deep: {
    isDifferent: {
      (a: unknown, b: unknown): boolean
      (a: unknown): (c: unknown) => boolean
    }
    different: {
      (a: unknown, b: unknown): boolean
      (a: unknown): (c: unknown) => boolean
    }
    diff: {
      (a: unknown, b: unknown): boolean
      (a: unknown): (c: unknown) => boolean
    }
    isEqual: {
      (a: unknown, b: unknown): boolean
      (a: unknown): (c: unknown) => boolean
    }
    equal: {
      (a: unknown, b: unknown): boolean
      (a: unknown): (c: unknown) => boolean
    }
    eq: {
      (a: unknown, b: unknown): boolean
      (a: unknown): (c: unknown) => boolean
    }
  }
  count: import('@magic/types/types/lib.js').EnhancedLengthFunction
  length: import('@magic/types/types/lib.js').EnhancedLengthFunction
  len: import('@magic/types/types/lib.js').EnhancedLengthFunction
  ln: import('@magic/types/types/lib.js').EnhancedLengthFunction
  isError: (e: unknown) => e is Error
  error: (e: unknown) => e is Error
  err: (e: unknown) => e is Error
  isIterable: (e: unknown) => e is Iterable<unknown>
  isIter: (e: unknown) => e is Iterable<unknown>
  iterable: (e: unknown) => e is Iterable<unknown>
  iter: (e: unknown) => e is Iterable<unknown>
  isEmail: (e: unknown) => e is string
  isMail: (e: unknown) => e is string
  email: (e: unknown) => e is string
  mail: (e: unknown) => e is string
  isNull: (e: unknown) => e is null
  isNil: (e: unknown) => e is null
  null: (e: unknown) => e is null
  nil: (e: unknown) => e is null
  isUndefinedOrNull: (e: unknown) => e is null | undefined
  undefinedOrNull: (e: unknown) => e is null | undefined
  undefinedOrNil: (e: unknown) => e is null | undefined
  undefOrNull: (e: unknown) => e is null | undefined
  undefOrNil: (e: unknown) => e is null | undefined
  isBuffer: (e: unknown) => e is Buffer
  buffer: (e: unknown) => e is Buffer
  buff: (e: unknown) => e is Buffer
  isPromise: (e: unknown) => e is Promise<unknown>
  promise: (e: unknown) => e is Promise<unknown>
  isThenable: (e: unknown) => e is Promise<unknown>
  isThen: (e: unknown) => e is Promise<unknown>
  thenable: (e: unknown) => e is Promise<unknown>
  then: (e: unknown) => e is Promise<unknown>
  isArguments: (e: unknown) => e is IArguments
  isArgs: (e: unknown) => e is IArguments
  arguments: (e: unknown) => e is IArguments
  args: (e: unknown) => e is IArguments
  isUUID: (e: unknown) => boolean
  uuid: (e: unknown) => boolean
  isType: (e: unknown, ...types: string[]) => boolean
  testType: (e: unknown, ...types: string[]) => boolean
  type: (e: unknown, ...types: string[]) => boolean
  isTypes: (e: unknown, ...types: string[]) => boolean
  test: (e: unknown, ...types: string[]) => boolean
  types: (e: unknown, ...types: string[]) => boolean
  is: (e: unknown, ...types: string[]) => boolean
  isEmpty: (e: unknown) => boolean
  empty: (e: unknown) => boolean
  isNot: (e: unknown, ...types: string[]) => boolean
  not: (e: unknown, ...types: string[]) => boolean
  isNeq: (e: unknown, ...types: string[]) => boolean
  neq: (e: unknown, ...types: string[]) => boolean
  isArray: (e: unknown) => e is unknown[]
  isArr: (e: unknown) => e is unknown[]
  array: (e: unknown) => e is unknown[]
  arr: (e: unknown) => e is unknown[]
  isBoolean: (e: unknown) => e is boolean
  isBool: (e: unknown) => e is boolean
  boolean: (e: unknown) => e is boolean
  bool: (e: unknown) => e is boolean
  isDefined: (e: unknown) => e is NonNullable<unknown>
  isDef: (e: unknown) => e is NonNullable<unknown>
  defined: (e: unknown) => e is NonNullable<unknown>
  def: (e: unknown) => e is NonNullable<unknown>
  isUndefined: (e: unknown) => e is undefined
  isUndef: (e: unknown) => e is undefined
  undefined: (e: unknown) => e is undefined
  undef: (e: unknown) => e is undefined
  isFunction: (e: unknown) => e is Function
  isFunc: (e: unknown) => e is Function
  isFn: (e: unknown) => e is Function
  function: (e: unknown) => e is Function
  func: (e: unknown) => e is Function
  fn: (e: unknown) => e is Function
  isAsyncFunction: (e: unknown) => e is (...args: unknown[]) => Promise<unknown>
  isAsyncFunc: (e: unknown) => e is (...args: unknown[]) => Promise<unknown>
  isAsyncFn: (e: unknown) => e is (...args: unknown[]) => Promise<unknown>
  asyncFunction: (e: unknown) => e is (...args: unknown[]) => Promise<unknown>
  asyncFunc: (e: unknown) => e is (...args: unknown[]) => Promise<unknown>
  asyncFn: (e: unknown) => e is (...args: unknown[]) => Promise<unknown>
  isGeneratorFunction: (e: unknown) => e is GeneratorFunction
  isGeneratorFn: (e: unknown) => e is GeneratorFunction
  isGeneratorFunc: (e: unknown) => e is GeneratorFunction
  generator: (e: unknown) => e is GeneratorFunction
  isGenerator: (e: unknown) => e is GeneratorFunction
  generatorFn: (e: unknown) => e is GeneratorFunction
  generatorFunc: (e: unknown) => e is GeneratorFunction
  generatorFunction: (e: unknown) => e is GeneratorFunction
  isNumber: (e: unknown) => e is number
  isNum: (e: unknown) => e is number
  number: (e: unknown) => e is number
  num: (e: unknown) => e is number
  isInteger: (e: unknown) => e is number
  isInt: (e: unknown) => e is number
  integer: (e: unknown) => e is number
  int: (e: unknown) => e is number
  isFloat: (e: unknown) => e is number
  float: (e: unknown) => e is number
  isObject: (e: unknown) => e is object
  isObj: (e: unknown) => e is object
  object: (e: unknown) => e is object
  obj: (e: unknown) => e is object
  isObjectNative: (e: unknown) => e is Record<string, unknown>
  objectNative: (e: unknown) => e is Record<string, unknown>
  isMergeableObject: (e: unknown) => e is Record<string, unknown>
  mergeableObject: (e: unknown) => e is Record<string, unknown>
  isMergeable: (e: unknown) => e is Record<string, unknown>
  mergeable: (e: unknown) => e is Record<string, unknown>
  isString: (e: unknown) => e is string
  isStr: (e: unknown) => e is string
  string: (e: unknown) => e is string
  str: (e: unknown) => e is string
  isRGBAObject: (e: unknown) => e is {
    r: number
    g: number
    b: number
    a: number
  }
  isRGBA: (e: unknown) => e is {
    r: number
    g: number
    b: number
    a: number
  }
  rgbaObject: (e: unknown) => e is {
    r: number
    g: number
    b: number
    a: number
  }
  rgba: (e: unknown) => e is {
    r: number
    g: number
    b: number
    a: number
  }
  isRGBObject: (e: unknown) => e is {
    r: number
    g: number
    b: number
  }
  isRGB: (e: unknown) => e is {
    r: number
    g: number
    b: number
  }
  rgbObject: (e: unknown) => e is {
    r: number
    g: number
    b: number
  }
  rgb: (e: unknown) => e is {
    r: number
    g: number
    b: number
  }
  isHexColor: (e: unknown) => boolean
  isHex: (e: unknown) => boolean
  hexColor: (e: unknown) => boolean
  hex: (e: unknown) => boolean
  isHexColor3: (e: unknown) => boolean
  isHex3: (e: unknown) => boolean
  hexColor3: (e: unknown) => boolean
  hex3: (e: unknown) => boolean
  isHexColor4: (e: unknown) => boolean
  isHex4: (e: unknown) => boolean
  hexColor4: (e: unknown) => boolean
  hex4: (e: unknown) => boolean
  isHexColor6: (e: unknown) => boolean
  isHex6: (e: unknown) => boolean
  hexColor6: (e: unknown) => boolean
  hex6: (e: unknown) => boolean
  isHexColor8: (e: unknown) => boolean
  isHex8: (e: unknown) => boolean
  hexColor8: (e: unknown) => boolean
  hex8: (e: unknown) => boolean
  isHexAlphaColor: (e: unknown) => boolean
  isHexa: (e: unknown) => boolean
  hexAlphaColor: (e: unknown) => boolean
  hexa: (e: unknown) => boolean
  isHexAlphaColor4: (e: unknown) => boolean
  isHexa4: (e: unknown) => boolean
  hexAlphaColor4: (e: unknown) => boolean
  hexa4: (e: unknown) => boolean
  isHexAlphaColor8: (e: unknown) => boolean
  isHexa8: (e: unknown) => boolean
  hexAlphaColor8: (e: unknown) => boolean
  hexa8: (e: unknown) => boolean
  isColor: (e: unknown) => boolean
  isCol: (e: unknown) => boolean
  color: (e: unknown) => boolean
  col: (e: unknown) => boolean
  isComparable: (a: unknown) => a is string | number | boolean
  Comparable: (a: unknown) => a is string | number | boolean
  comparable: (a: unknown) => a is string | number | boolean
  isDate: (e: unknown) => e is Date
  isTime: (e: unknown) => e is Date
  date: (e: unknown) => e is Date
  time: (e: unknown) => e is Date
  isRegExp: (e: unknown) => e is RegExp
  isRegex: (e: unknown) => e is RegExp
  regExp: (e: unknown) => e is RegExp
  regexp: (e: unknown) => e is RegExp
  regex: (e: unknown) => e is RegExp
  isTruthy: (e: unknown) => boolean
  truthy: (e: unknown) => boolean
  isFalsy: (e: unknown) => boolean
  falsy: (e: unknown) => boolean
  isLengthGreater: {
    (a: unknown, b: unknown): boolean
    (a: unknown): (c: unknown) => boolean
  }
  isLengthGreaterOrEqual: {
    (a: unknown, b: unknown): boolean
    (a: unknown): (c: unknown) => boolean
  }
  isLengthSmaller: {
    (a: unknown, b: unknown): boolean
    (a: unknown): (c: unknown) => boolean
  }
  isLengthSmallerOrEqual: {
    (a: unknown, b: unknown): boolean
    (a: unknown): (c: unknown) => boolean
  }
  isLengthEqual: {
    (a: unknown, b: unknown): boolean
    (a: unknown): (c: unknown) => boolean
  }
  isMap: (a: unknown) => a is Map<unknown, unknown>
  map: (a: unknown) => a is Map<unknown, unknown>
  isSet: (a: unknown) => a is Set<unknown>
  set: (a: unknown) => a is Set<unknown>
  isWeakMap: (a: unknown) => a is WeakMap<any, unknown>
  weakMap: (a: unknown) => a is WeakMap<any, unknown>
  isWeakSet: (a: unknown) => a is WeakSet<any>
  weakSet: (a: unknown) => a is WeakSet<any>
  every: <T>(arr: T | T[], t: ((v: T) => boolean) | string) => boolean
  all: <T>(arr: T | T[], t: ((v: T) => boolean) | string) => boolean
  some: <T>(arr: T | T[], t: ((v: T) => boolean) | string) => boolean
  none: <T>(arr: T | T[], t: ((v: T) => boolean) | string) => boolean
  instance: (e: unknown, t: new (...args: any[]) => any) => boolean
  instanceof: (e: unknown, t: new (...args: any[]) => any) => boolean
  instanceOf: (e: unknown, t: new (...args: any[]) => any) => boolean
  isCase: ((s: unknown, c?: 'up' | 'down') => boolean) & {
    upper: (s: unknown) => boolean
    lower: (s: unknown) => boolean
  }
  case: ((s: unknown, c?: 'up' | 'down') => boolean) & {
    upper: (s: unknown) => boolean
    lower: (s: unknown) => boolean
  }
  isUpperCase: (s: unknown) => s is string
  upperCase: (s: unknown) => s is string
  isLowerCase: (s: unknown) => s is string
  lowerCase: (s: unknown) => s is string
  same: (a: unknown, b: unknown) => boolean
  sameType: (a: unknown, b: unknown) => boolean
  isSameType: (a: unknown, b: unknown) => boolean
  isSame: (a: unknown, b: unknown) => boolean
  ownProp: <K extends string | number | symbol>(o: unknown, k: K) => o is Record<K, unknown>
  prop: <K extends string | number | symbol>(o: unknown, k: K) => o is Record<K, unknown>
  ownProperty: <K extends string | number | symbol>(o: unknown, k: K) => o is Record<K, unknown>
  isOwnProp: <K extends string | number | symbol>(o: unknown, k: K) => o is Record<K, unknown>
  isOwnProperty: <K extends string | number | symbol>(o: unknown, k: K) => o is Record<K, unknown>
  isModule: (s: unknown) => s is object & {
    [Symbol.toStringTag]: 'Module'
  }
  module: (s: unknown) => s is object & {
    [Symbol.toStringTag]: 'Module'
  }
}
