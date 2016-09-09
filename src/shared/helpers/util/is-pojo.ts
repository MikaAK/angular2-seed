import {both, is} from 'ramda'

import {isNotArray} from './is-not-array'

export const isPOJO = both(isNotArray, is(Object))
