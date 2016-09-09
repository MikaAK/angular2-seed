import {isEmpty, cond, T, F} from 'ramda'

import {isPOJO} from './is-pojo'
import {isNotEmpty, isNotEmptyObject} from './is-not-empty'

export const some = cond([
  [Array.isArray, isNotEmpty],
  [isPOJO, isNotEmptyObject],
  [T, F]
])
