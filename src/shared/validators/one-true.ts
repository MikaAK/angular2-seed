import {isNil} from 'ramda'

import {ValidatorFn, AbstractControl} from '@angular/forms'

/* tslint:disable */
const checkSome = (value: any) => {
  if (isNil(value))
    return false
  else if (Array.isArray(value))
    return isArrayAnyTrue(value)
  else if (typeof value === 'object')
    return isObjectAnyTrue(value)
  else
    return !!value
}

const isArrayAnyTrue = (array: any[]) => array
  .some(checkSome)

const isObjectAnyTrue = (obj) => Object.entries(obj)
  .some(([, value]) => checkSome(value))
/* tslint:enable */

export const oneTrue: ValidatorFn = function(control: AbstractControl) {
  const isValid = checkSome(control.value)

  if (isValid)
    return null
  else
    return {required: true}
}
