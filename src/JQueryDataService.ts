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
        const headers = { ...this.getHeaders(), ...{
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }};
        return new Promise<any>((resolve, reject) => {
            jQuery.get(this.resolve('$metadata'), {
                headers: headers,
                dataType: 'text',
                withCredentials: true
            }).done((data, textStatus, jqXHR) => {
                if (data.status === 204) {
                    return resolve(null);
                } else {
                    // safely handle empty body
                    if ((data.body == null) || (typeof data.body === 'string' && data.body.length === 0)) {
                        return resolve(null);
                    }
                    return resolve(EdmSchema.loadXML(data.body));
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