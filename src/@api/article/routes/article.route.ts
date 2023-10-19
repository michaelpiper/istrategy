/* eslint-disable @typescript-eslint/no-misused-promises */
import validationHandler from 'responses/validationHandler.js'
import { ArticleApiController } from '../controllers/article.controller.js'
import { ArticlePermissions } from '../permissions/article.permission.js'
import { PolicyMiddleWare } from '@idp/account/middlewares/policy.middleware.js'
import { ChildRouter } from 'common/implementations/child.route.js'
import { storeValidation, updateValidation } from '../validations/article.validation.js'
const router = new ChildRouter({
  prefix: '/articles'
})
const permissions = new ArticlePermissions()
const controller = new ArticleApiController()
const policies = new PolicyMiddleWare(permissions)
router.get('/list', controller.list)
router.get('/', controller.list)
router.get('/:articleId', controller.retrieve)
router.delete('/:articleId', controller.delete)
router.put('/:articleId/update', validationHandler(updateValidation,{sources:['body']}), controller.update)
router.put('/:articleId', validationHandler(updateValidation,{sources:['body']}), controller.update)
router.post('/create', validationHandler(storeValidation,{sources:['body']}), controller.store)
router.post('/', validationHandler(storeValidation,{sources:['body']}), controller.store)
export default router
