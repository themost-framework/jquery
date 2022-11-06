
# @themost/jquery
MOST Web Framework client for jQuery based on [@themost/client](https://github.com/themost-framework/client)

![MOST Web Framework Logo](https://github.com/themost-framework/common/raw/master/docs/img/themost_framework_v3_128.png)

# Usage

    npm i @themost/jquery

Initialize data context:

    $(document).dataContext({
        base: '/api/'
    });

and use it to get data:

    $(document).dataContext('getContext').model('Orders').getItems().then(function(items) {
        
    });
