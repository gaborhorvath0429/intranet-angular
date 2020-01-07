export function FormSubmit(form: string) {
  return function(target: object, key: string | symbol, descriptor: PropertyDescriptor) {
    const original = descriptor.value
    descriptor.value = function(...args: any[]) {
      let formGroup = this[form]
      if (!formGroup.valid) {
        Object.keys(formGroup.controls).forEach(field => {
          formGroup.get(field).markAsTouched({ onlySelf: true })
        })
      } else {
        original.apply(this, args)
      }
    }
  }
}
