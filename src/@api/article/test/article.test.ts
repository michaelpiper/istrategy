import * as request from 'supertest'
import {describe, it} from 'node:test'
import {equal} from 'node:assert'
import { HttpServer } from '../../../common/servers/http.server.js';
import { app } from '../../../app.js'
describe('Article API Endpoints', async () => {
    let article_no :number|null =null
     it('should create a new article', async () => {
        const mock =  request.default(app.getServer(HttpServer).callback());
        const response = await mock.post('/api/articles/create')
        .send({
            article: 'USD',
            provider: 'flutterwave',
            price: 1000
        });
        equal(response.statusCode, 201);
        article_no= response.body.data.article_no
    });
   
     it('should update an article', async () => {
        if(article_no ==null) {
            return
        }
        const mock =  request.default(app.getServer(HttpServer).callback());
        const response = await mock.put('/api/articles/'+ article_no)
        .send({
            article: 'GBP',
            provider: 'flutterwave',
            price: 1000
        });
        equal(response.statusCode, 200);
    });
     it('should findOne an article', async () => {
        if(article_no ==null) {
            return
        }
        const mock =  request.default(app.getServer(HttpServer).callback());

        const response = await mock .get('/api/articles/'+ article_no);
        equal(response.statusCode, 200);
    });
     it('should findMany an article', async () => {
        const mock =  request.default(app.getServer(HttpServer).callback());
        const response = await mock .get('/api/articles/');
        equal(response.statusCode, 200);
    });
    it('should delete an article', async () => {
        if(article_no ==null) {
            return
        }
        const mock =  request.default(app.getServer(HttpServer).callback());
        const response = await mock
        .delete('/api/articles/'+ article_no);
        equal(response.statusCode, 200, 'expected status 200')
    });
});