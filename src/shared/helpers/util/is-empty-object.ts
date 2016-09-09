import {isEmpty, compose} from 'ramda'

export const isEmptyObject = compose(isEmpty, Object.keys)
