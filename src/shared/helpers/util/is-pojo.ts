import {both, is} from 'ramda'

import {isNotArray} from './isNotArray'

export const isPOJO = both(isNotArray, is(Object))
