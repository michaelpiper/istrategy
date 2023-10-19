// import ReactJson, { type ReactJsonViewProps } from 'react-json-editor'
import JSONInput from 'react-json-editor-ajrm'
type jsObject = string | number | null
type json = jsObject | jsObject[]
export interface JSONInputEvent {
  jsObject?: json
  plainText?: string
  error: boolean
  json: string
  lines: number
  markupText: string
}
export interface JSONInputProperties {
  locale?: Record<string, any>
  id?: string | undefined
  placeholder?: any
  reset?: boolean | undefined
  viewOnly?: boolean | undefined
  onChange?: (event: JSONInputEvent) => void
  onBlur?: (event: JSONInputEvent) => void
  confirmGood?: boolean | undefined
  height?: string | undefined
  width?: string | undefined
  onKeyPressUpdate?: boolean | undefined
  waitAfterKeyPress?: number | undefined
  modifyErrorText?: ((errorReason: string) => string) | undefined
  error?: Record<string, any> | undefined
  colors?: Record<string, any> | undefined
  style?: Record<string, any> | undefined
  theme?: string | undefined
}
export const ReactJsonM: React.FC<JSONInputProperties> = JSONInput as any
