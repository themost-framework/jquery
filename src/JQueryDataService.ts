import { ResponseError, ClientDataContextOptions, ClientDataService, DataServiceExecuteOptions, EdmSchema } from '@themost/client';
import * as jQuery from 'jquery';

const DateTimeRegex = /^\d{4}-([0]\d|1[0-2])-([0-2]\d|3[01])(?:[T ](\d+):(\d+)(?::(\d+)(?:\.(\d+))?)?)?(?:Z(-?\d*))?$/g;

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
function jsonReviver(key: string, value: string) {
    if (DateTimeRegex.test(value)) {
        return new Date(value);
    }
    return value;
}

class JQueryDataService extends ClientDataService {
    constructor(base: string, options?: ClientDataContextOptions) {
        super(base, options);
    }
    execute(options: DataServiceExecuteOptions): Promise<any> {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const headers: { [name: string]: string } = { ...this.getHeaders(),
            ...{
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            ...options.headers};
        const reviver = this.getOptions().useJsonReviver || jsonReviver;
        return new Promise<EdmSchema>((resolve, reject) => {
            void jQuery.ajax({
                url: this.resolve(options.url),
                headers,
                method: options.method,
                crossDomain: true,
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                data: options.data,
                dataType: 'text',
                xhrFields: {
                    withCredentials: true
                }
            }).done((data: string, textStatus, jqXHR) => {
                if (jqXHR.status === 204) {
                    return resolve(null);
                } else {
                    // safely handle empty body
                    if ((typeof data === 'string' && data.length === 0)) {
                        return resolve(null);
                    }
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                    return resolve(JSON.parse(data, reviver));
                }
            }).fail((jqXHR, textStatus, errorThrown) => {
                return reject(new ResponseError(errorThrown, jqXHR.status));
            })
        });
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
                crossDomain: true,
                dataType: 'text',
                xhrFields: {
                    withCredentials: true
                }
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
                return reject(new ResponseError(errorThrown, jqXHR.status));
            });
        });
    }

}

export {
    JQueryDataService
}
