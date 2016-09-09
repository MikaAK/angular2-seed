import {complement, isEmpty} from 'ramda'

import {isEmptyObject} from './isEmptyObject'

export const isNotEmpty = complement(isEmpty)
export const isNotEmptyObject = complement(isEmptyObject)
