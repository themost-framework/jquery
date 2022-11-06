import { ClientDataContextOptions, ClientDataService, DataServiceExecuteOptions, EdmSchema } from '@themost/client';
import * as jQuery from 'jquery';
class JQueryDataService extends ClientDataService {
    constructor(base: string, options?: ClientDataContextOptions) {
        super(base, options);
    }
    execute(options: DataServiceExecuteOptions): Promise<any> {
        throw new Error('Not Implemented');
    }

    getMetadata(): Promise<EdmSchema> {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const headers: any = { ...this.getHeaders(), ...{
                'Accept': 'application/xml'
            }};
        return new Promise<EdmSchema>((resolve, reject) => {
            void jQuery.get({
                url: this.resolve('$metadata'),
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                headers,
                dataType: 'text'
            }).done((data: string, textStatus, jqXHR) => {
                if (jqXHR.status === 204) {
                    return resolve(null);
                } else {
                    // safely handle empty body
                    if ((typeof data === 'string' && data.length === 0)) {
                        return resolve(null);
                    }
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                    return resolve(EdmSchema.loadXML(data));
                }
            }).fail(( jqXHR, textStatus, errorThrown) => {
                return reject(new Error(errorThrown));
            });
        });
    }

}

export {
    JQueryDataService
}
