import { JQueryDataService } from '../src/JQueryDataService';
describe('JQueryClient', () => {
    it('should create instance', () => {
        const service = new JQueryDataService('/');
        expect(service).toBeTruthy();
    });
});
