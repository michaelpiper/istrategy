import { type RJSFSchema } from '@rjsf/utils'
import validator from '@rjsf/validator-ajv8'
import React from 'react'
import Form from '@rjsf/mui'
import { Box, Label, TextArea } from '@adminjs/design-system'
import { type FormProps } from '@rjsf/core'
import { type EditPropertyProps, flat } from 'adminjs'
import _ from 'lodash'
const log = (type: any) => console.log.bind(console, type)
const Fa: React.FC<FormProps<any, RJSFSchema, any>> = Form as any

const getDef = (definitions: any) => {
  if (typeof definitions === 'object' && definitions != null) {
    const newDef = Object.entries(definitions as Record<string, any>).map(([key, definition]) => {
      return [key, _.omit(definition, ['$src'])]
    })
    return Object.fromEntries(newDef)
  }
}
const SchemaPlayground: React.FC<EditPropertyProps> = (props) => {
  const { record } = props
  const { definitions, ...form } = flat.get(record.params, 'service_schema_form') ?? {}
  const [uiSchema, setUiSchema] = React.useState(flat.get(record.params, 'service_schema_ui'))
  const [schema, setSchema] = React.useState({ ...form, definitions: getDef(definitions) })
  const [data, setData] = React.useState(flat.get(record.params, 'service_schema_formdata'))
  // const [formData] = React.useState(flat.get(record.params, 'service_schema_formdata'))
  React.useEffect(() => {
    if (typeof definitions === 'object' && definitions != null) {
      void Promise.all(Object.entries(definitions as Record<string, any>).map(async ([key, definition]) => [key, typeof definition === 'object' && definition?.$src != null ? await fetch(definition.$src).then(async (r) => await r.json()).catch(() => _.omit(definition, ['$src'])) : definition]))
        .then((newDef) => {
          setSchema((schema: any) => ({ ...schema, definitions: Object.fromEntries(newDef) }))
        })
    }
  }, [])
  return (<Box display={'flex'} height={'100%'} padding={'2rem'} flex={'1'}>
    <Box display={'flex'} width={'100%'} paddingRight={'1rem'} flexDirection={'column'}>
    <Box display={'flex'} width={'100%'} height={'50%'} flexDirection={'column'}>
      <Label paddingTop={'0.2rem'}>Form Schema</Label>
      <TextArea style={{ resize: 'none' }} readOnly disabled height={'50%'} onChange={(e) => { setSchema(JSON.parse(e.target.value)) }} value={JSON.stringify(schema, null, 2)}></TextArea>
     </Box>
      <Box display={'flex'} width={'100%'} height={'50%'} paddingTop={'0.4rem'}>
        <Box display={'flex'} width={'100%'} flexDirection={'column'} paddingRight={'0.1rem'}>
          <Label>UI Schema</Label>
          <TextArea style={{ resize: 'none' }} readOnly disabled height={'100%'} onChange={(e) => { setUiSchema(JSON.parse(e.target.value)) }} value={JSON.stringify(uiSchema, null, 2)}></TextArea>
        </Box>
        <Box display={'flex'} width={'100%'} flexDirection={'column'} paddingLeft={'0.1rem'}>
          <Label>Form Data</Label>
          <TextArea style={{ resize: 'none' }} readOnly disabled height={'100%'} onChange={(e) => { setData(JSON.parse(e.target.value)) }} value={JSON.stringify(data, null, 2)}></TextArea>
        </Box>
      </Box>
    </Box>
    <Box display={'flex'} width={'100%'}>
      <Fa
        schema={schema}
        uiSchema={uiSchema}
        formData={data}
        validator={validator as any}
        onChange={(form) => {
          log('changed').call(form.formData)
          setData(form.formData)
        }}
        onSubmit={log('submitted')}
        onError={log('errors')}
      />
    </Box>
  </Box>)
}

export default SchemaPlayground
