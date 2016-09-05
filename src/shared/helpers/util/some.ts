import {isEmpty, cond, T, F} from 'ramda'

import {isPOJO} from './isPOJO'
import {isNotEmpty, isNotEmptyObject} from './isNotEmpty'

export const some = cond([
  [Array.isArray, isNotEmpty],
  [isPOJO, isNotEmptyObject],
  [T, F]
])
