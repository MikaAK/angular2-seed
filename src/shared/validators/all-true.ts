import {isNil} from 'ramda'

import {ValidatorFn, AbstractControl} from '@angular/forms'

/* tslint:disable */
const checkEvery = (value: any) => {
  if (isNil(value))
    return false
  else if (Array.isArray(value))
    return isArrayAllTrue(value)
  else if (typeof value === 'object')
    return isObjectAllTrue(value)
  else
    return !!value
}

const isArrayAllTrue = (array: any[]) => array
  .every(checkEvery)

const isObjectAllTrue = (obj) => Object.entries(obj)
  .every(([, value]) => checkEvery(value))
/* tslint:enable */

export const allTrue: ValidatorFn = function(control: AbstractControl) {
  const isValid = checkEvery(control.value)

  if (isValid)
    return null
  else
    return {required: true}
}
