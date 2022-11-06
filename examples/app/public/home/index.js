$(document).ready(function () {
    // set context
    $(document).dataContext({
        base: '/api/',
        options: {
            useMediaTypeExtensions: false,
            useResponseConversion: true
        }
    });
    const urlParams = new URLSearchParams(window.location.search);
    const access_token = urlParams.get('access_token');
    if (access_token) {
        const context = $(document).dataContext('getContext');
        context.setBearerAuthorization(access_token);
        $('#table1').DataTable({
            "columns": [
                {
                    data: 'id',
                    title: 'id',
                    sortable: false,
                    visible: true,
                    name: 'id',
                },
                {
                    data: 'orderedItem.name',
                    title: 'orderedItem',
                    sortable: true,
                    visible: true,
                    name: 'orderedItemName',
                },
                {
                    data: 'orderedItem.price',
                    title: 'price',
                    sortable: true,
                    visible: true,
                    name: 'price',
                },
                {
                    data: 'customer.description',
                    title: 'customer',
                    sortable: true,
                    visible: true,
                    name: 'customerName',
                },
                {
                    data: 'orderDate',
                    title: 'orderDate',
                    sortable: true,
                    visible: true,
                    name: 'orderDate',
                    render: function (data, type, row) {
                        return data.toDateString();
                    }
                },
                {
                    data: 'paymentMethod.name',
                    title: 'paymentMethod',
                    sortable: false,
                    visible: true,
                    name: 'paymentMethod',
                }
            ],
            "processing": true,
            "serverSide": true,
            "fnServerData": function (sSource, aoData, fnCallback) {
                const columns = aoData[1].value;
                const order = aoData[2].value[0];
                let orderColumn;
                let orderDirection;
                if (order) {
                    orderColumn = columns[order.column];
                    orderDirection = order.dir;
                }
                const skip = aoData[3].value;
                const take = aoData[4].value;
                let filter = aoData[5].value.value;
                if (filter && filter.length === 0) {
                    filter = null;
                }
                const query = context.model('Orders').asQueryable().expand('customer').skip(skip).take(take);
                if (orderColumn) {
                    if (orderDirection === 'desc') {
                        query.orderByDescending(orderColumn.data.replace('.', '/'));
                    } else {
                        query.orderBy(orderColumn.data.replace('.', '/'));
                    }
                }
                if (filter) {
                    query.where('customer/description').indexOf(filter).greaterOrEqual(0)
                        .or('orderedItem/name').indexOf(filter).greaterOrEqual(0)
                        .or('paymentMethod/name').indexOf(filter).greaterOrEqual(0);
                }
                query.getList().then(function (items) {
                    const dataSet = {
                        recordsTotal: items.total,
                        recordsFiltered: items.total,
                        data: items.value,
                    };
                    return fnCallback(dataSet);
                });
            }
        });
        // get last 5 orders

    } else {
        $('#table1').DataTable();
    }



});