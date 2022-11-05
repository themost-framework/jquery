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
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }};
        console.log(headers);
        return new Promise<EdmSchema>((resolve, reject) => {
            void jQuery.get(this.resolve('$metadata'), {
                headers,
                dataType: 'text',
                withCredentials: true
            }).done((data: { status: number, body?: any }, textStatus, jqXHR) => {
                if (data.status === 204) {
                    return resolve(null);
                } else {
                    // safely handle empty body
                    if ((data.body == null) || (typeof data.body === 'string' && data.body.length === 0)) {
                        return resolve(null);
                    }
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
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
