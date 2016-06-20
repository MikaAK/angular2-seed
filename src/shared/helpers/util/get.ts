import {path, split, useWith, identity} from 'ramda'

export const get = useWith(path, [split('.'), identity])
