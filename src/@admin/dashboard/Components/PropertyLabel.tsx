/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { Label } from '@adminjs/design-system'
import React from 'react'
import { type PropertyLabelProps, useTranslation, PropertyDescription } from 'adminjs'

export const PropertyLabel: React.FC<PropertyLabelProps> = (props) => {
  const { property, props: labelProps, filter = false } = props
  const { translateProperty } = useTranslation()

  const PropertyDescription_ = PropertyDescription as any
  if (property.hideLabel) { return null }

  return (
      <Label
        htmlFor={filter ? ['filter', property.path].join('-') : property.path}
        required={!filter && property.isRequired}
        {...labelProps}
      >
        {translateProperty(property.label, property.resourceId)}
        {property.description && <PropertyDescription_ property={property} />}
      </Label>
  )
}
export default PropertyLabel
