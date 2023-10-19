/* eslint-disable @typescript-eslint/strict-boolean-expressions */

import { type AdminConfig } from 'common/config/admin.config.js'
import { type ActionRequest, NotFoundError, type PropertyOptions, type ResourceWithOptions, paramConverter, populator, type ActionContext, type BaseRecord } from 'adminjs'
import { getModelByName } from '@adminjs/prisma'
import { type DBPlugin } from 'common/plugins/db.plugin.js'

export const makeNewHandler = (fields: string[]) =>/**
* Responsible for creating new record.
*
* To invoke this action use {@link ApiClient#resourceAction}
*
* @implements Action#handler
* @memberof module:NewAction
* @return {Promise<RecordActionResponse>} populated records
*/
  async (request: ActionRequest, response: any, context: ActionContext) => {
    const { resource, h, currentAdmin } = context
    if (request.method === 'post') {
      if (![null, undefined].includes(request?.payload as any)) {
        fields.forEach((field) => {
          if (typeof request.payload![field] === 'string') {
            request.payload![field] = JSON.parse(request.payload![field])
          }
        })
      }
      const params = paramConverter.prepareParams(request.payload ?? {}, resource)

      let record = await (resource.build(params) as any as Promise<BaseRecord>)

      record = await record.create(context)
      const [populatedRecord] = await populator([record], context)

      // eslint-disable-next-line no-param-reassign
      context.record = populatedRecord

      if (record.isValid()) {
        return {
          redirectUrl: h.resourceUrl({ resourceId: resource._decorated?.id() || resource.id() }),
          notice: {
            message: 'successfullyCreated',
            type: 'success'
          },
          record: record.toJSON(currentAdmin)
        }
      }
      const baseMessage = populatedRecord.baseError?.message ||
     'thereWereValidationErrors'
      return {
        record: record.toJSON(currentAdmin),
        notice: {
          message: baseMessage,
          type: 'error'
        }
      }
    }
    // TODO: add wrong implementation error
    throw new Error('new action can be invoked only via `post` http method')
  }
export const makeEditHandler = (fields: string[]) => async (request: ActionRequest, response: any, context: ActionContext) => {
  if (![null, undefined].includes(request?.payload as any)) {
    fields.forEach((field) => {
      if (typeof request.payload![field] === 'string') {
        request.payload![field] = JSON.parse(request.payload![field])
      }
    })
  }
  const {
    record,
    resource,
    currentAdmin,
    h
  } = context
  if (record == null) {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    throw new NotFoundError([`Record of given id ("${request.params.recordId}") could not be found`].join('\n'), 'Action#handler')
  }
  if (request.method === 'get') {
    return {
      record: record.toJSON(currentAdmin)
    }
  }
  const params = paramConverter.prepareParams(request.payload ?? {}, resource)
  const newRecord = await record.update(params, context)
  const [populatedRecord] = await populator([newRecord], context)

  // eslint-disable-next-line no-param-reassign
  context.record = populatedRecord
  if (record.isValid()) {
    return {
      redirectUrl: h.resourceUrl({
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        resourceId: resource._decorated?.id() || resource.id()
      }),
      notice: {
        message: 'successfullyUpdated',
        type: 'success'
      },
      record: populatedRecord.toJSON(currentAdmin)
    }
  }
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  const baseMessage = populatedRecord.baseError?.message || 'thereWereValidationErrors'
  return {
    record: populatedRecord.toJSON(currentAdmin),
    notice: {
      message: baseMessage,
      type: 'error'
    }
  }
}

export const makeResource = (config: AdminConfig, db: DBPlugin) => (name: string, { title, parent, actions, parentName, parentIcon, fields = {}, showFields = [], editFields = [], listFields = [], filterFields = [] } = {} as any): ResourceWithOptions => {
  const properties: Record<string, PropertyOptions> = {}
  if (Object.keys(fields).length > 0) {
    Object.keys(fields).forEach((field) => {
      properties[field] = {
        type: typeof fields[field]?.type === 'string' ? fields[field].type : undefined,
        isTitle: typeof title === 'string' ? field === title : undefined,
        components: typeof fields[field]?.components === 'object' ? fields[field]?.components : undefined,
        props: typeof fields[field]?.props === 'object' ? fields[field]?.props : undefined,
        isVisible: {
          show: showFields.includes(field),
          edit: editFields.includes(field),
          filter: filterFields.includes(field),
          list: listFields.includes(field)
        }
      }
    })
  }
  return {
    resource: {
      model: getModelByName(name),
      client: db.repositories
    },
    options: parent ?? {
      parent: {
        name: parentName ?? '',
        icon: parentIcon ?? ''
      },
      actions,
      properties
    }
  }
}
