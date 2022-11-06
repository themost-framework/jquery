import {ClientDataContext, ClientDataContextOptions} from '@themost/client';
import {JQueryDataService} from './JQueryDataService';
import * as jQuery from 'jquery';
import {type} from "jquery";

interface ClientDataContextConfig {
    base: string;
    options: ClientDataContextOptions;
}

class JQueryDataContext extends ClientDataContext {
    constructor(config: ClientDataContextConfig) {
        super(new JQueryDataService(config.base, config.options), config.options);
    }
}

declare global {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface JQuery {
        dataContext(config: ClientDataContextConfig): JQuery<HTMLElement>;
        dataContext(method: 'getContext'): JQueryDataContext;
    }
}
jQuery.fn.extend({
    dataContext: (config: ClientDataContextConfig | 'getContext') => {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const element: JQuery<HTMLElement> = this;
        if (element != null) {
            if (config === 'getContext') {
                return element.data('JQueryDataContext') as JQueryDataContext;
            }
            let context = element.data('JQueryDataContext') as JQueryDataContext;
            if (context == null) {
                context = new JQueryDataContext(config);
            }
            element.data('JQueryDataContext', context);
        }
        return element;
    }
});


export {
    JQueryDataContext,
    ClientDataContextConfig
}
