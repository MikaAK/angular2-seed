import {complement, isEmpty} from 'ramda'

import {isEmptyObject} from './is-empty-object'

export const isNotEmpty = complement(isEmpty)
export const isNotEmptyObject = complement(isEmptyObject)
