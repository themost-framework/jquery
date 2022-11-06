import {JQueryDataContext, JQueryDataService} from "../src";
import * as jQuery from 'jquery';

/**
 * get test token
 *
 * @param username
 * @param password
 */
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
function authorize(username: string, password: string): Promise<{ access_token: string }> {
    return new Promise((resolve, reject) => {
        void jQuery.post({
            url: '/auth/token',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: {
                client_id: '9165351833584149',
                client_secret: 'hTgqFBUhCfHs/quf/wnoB+UpDSfUusKA',
                username,
                password,
                grant_type: 'password',
                scope: 'profile'
            },
            dataType: 'json'
        }).done((data: any) => {
            return resolve(data as { access_token: string });
        }).fail((jqXHR, errorStatus, errorThrown) => {
            return reject(new Error(errorThrown));
        });
    })

}

describe('JQueryClient', () => {
    it('should create instance', () => {
        const service = new JQueryDataService('/api/');
        expect(service).toBeTruthy();
    });
    it('should get metadata', async () => {
        const token: { access_token: string } = await authorize('alexis.rees@example.com', 'secret')
        const service = new JQueryDataService('/api/');
        service.setHeader('Authorization', `Bearer ${token.access_token}`);
        const schema = await service.getMetadata();
        expect(schema).toBeTruthy();
        expect(schema.EntityType).toBeInstanceOf(Array);
    });

    it('should get data', async () => {
        const token: { access_token: string } = await authorize('alexis.rees@example.com', 'secret')
        const context = new JQueryDataContext({
            base: '/api/',
            options: {
                useMediaTypeExtensions: false,
                useResponseConversion: true
            }
        });
        context.setBearerAuthorization(token.access_token);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const items = await context.model('Orders').asQueryable()
                .orderByDescending('orderDate').getItems();
        expect(items).toBeInstanceOf(Array);
    });
});
