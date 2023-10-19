import React from 'react'
import { flat, type EditPropertyProps } from 'adminjs'
import { FormGroup, FormMessage } from '@adminjs/design-system'
import { PropertyLabel } from '../../Components/PropertyLabel.js'
import { type JSONInputEvent, ReactJsonM } from '../../Components/ReactJsonM.js'

export const SchemaEditor: React.FC<EditPropertyProps> = ({ filter, property, onChange, record, resource }) => {
  const [error, setError] = React.useState(record?.errors[property.path])
  const [value, setValue] = React.useState()
  // const ref = React.useRef<HTMLTextAreaElement>(null)
  const validate = (value: any, valid: boolean) => {
    if (!valid) {
      setError({ type: 'invalid', message: 'Invalid JSON Document' })
      return
    }

    setValue(value)
    setError(null as any)
  }
  React.useEffect(() => {
    setError(record?.errors[property.path])
  }, [record?.errors[property.path]])
  React.useEffect(() => {
    const json = flat.get(record?.params, property.path) ?? {}
    setValue(json)
  }, [])
  React.useEffect(() => {
    const json = JSON.stringify(value)
    onChange(property.path, json)
  }, [value])
  const onEdit = (event: JSONInputEvent) => {
    const updatedSrc = event?.jsObject
    validate(updatedSrc, !event.error)
  }
  const onBlur = (event: JSONInputEvent) => {
    const updatedSrc = event?.jsObject
    validate(updatedSrc, !event.error)
  }
  return <FormGroup error={Boolean(error)}>
  <PropertyLabel property={property} filter={filter}/>
   <ReactJsonM width= '100%' placeholder={value} onBlur={onBlur} onChange ={onEdit}
        height='200px'
        theme='light_mitsuketa_tribute'></ReactJsonM>
   <FormMessage>{error?.message}</FormMessage>
  </FormGroup>
}

export default SchemaEditor
