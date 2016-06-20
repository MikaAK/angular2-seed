import {lensProp, set as _set, identity, useWith} from 'ramda'

export const set = useWith(_set, [lensProp, identity, identity])
