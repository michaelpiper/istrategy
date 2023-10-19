import * as React from 'react'
import { FormGroup } from '@adminjs/design-system'
// import ReactJson, { type ReactJsonViewProps } from 'react-json-editor'
import * as _ from 'lodash'
import { unflatten } from 'flat'
import { PropertyLabel } from '../Components/PropertyLabel.js'
import { ReactJsonM } from '../Components/ReactJsonM.js'

const getParameterObject = (object: any, property: { name: string }) => {
  if (typeof object?.[property.name] === 'string') {
    try {
      return JSON.parse(object?.[property.name])
    } catch (_) {
      return object?.[property.name]
    }
  } else {
    return object?.[property.name]
  }
}
const EditJSON = (props: any) => {
  const { property, record, onChange, filter } = props
  const matchingParams = _.chain(record.params)
    .omitBy(_.isNil)
    .pickBy((value, key) => key.startsWith(property.name))
    .value()

  const object: any = unflatten(matchingParams)

  const [paramObject] = React.useState(getParameterObject(object, property))

  const saveData = (data: any): void => {
    // console.log('saveData', data)
    onChange(property.name, data)
  }

  const onEdit = (event: any) => {
    const updatedSrc = event?.jsObject
    saveData(updatedSrc)
  }

  //   const onAdd = (event: any) => {
  //     const updatedSrc = event?.jsObject
  //     saveData(updatedSrc)
  //   }

  //   const onDelete = (event: any) => {
  //     const updatedSrc = event?.jsObject
  //     saveData(updatedSrc)
  //   }

  return (
    <FormGroup error={Boolean(record?.errors[property.path])}>
      <PropertyLabel property={property} filter={filter}/>
      <ReactJsonM
        // name={property.name}
        // collapsed={false}
        placeholder={paramObject}
        onChange={onEdit}
        width='100%'
        height='200px'
        theme='light_mitsuketa_tribute'
        // onAdd={onAdd}
        // onDelete={onDelete}
        // displayDataTypes ={true}
        // displayObjectSize = {true}
      />
    </FormGroup>
  )
}

export default EditJSON
