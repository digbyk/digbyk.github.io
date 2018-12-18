window.onload = function () {
    Coveo.SearchEndpoint.endpoints['default'] = new Coveo.SearchEndpoint({
        restUri: 'https://platform.cloud.coveo.com/rest/search',
        accessToken: 'xxc0743789-8066-4b9a-ba0e-8b9b137da051'
    });
    var root = document.querySelector('#results');
    Coveo.init(root);
    Coveo.$$(root).on('buildingQuery', function (e, args) {
        var product = document.querySelector("select[name='data[product]']").value;
        // Add these back in when we have product facets
        //args.queryBuilder.addContextValue("product", product);
        var description = document.querySelector("textarea[name='data[description]']").value;
        args.queryBuilder.longQueryExpression.add(description);
        args.queryBuilder.expression.add(product);
        args.queryBuilder.advancedExpression.addFieldExpression('@sophossourcetype', '==', ['Knowledge Base']);
    })
    let typingTimer;
    const typingTimerInterval = 300;
    var buttonElement = document.querySelector('#button');
    var textarea = document.querySelector("textarea[name='data[description]']");
    buttonElement.addEventListener('click', function () {
        clearTimeout(typingTimer);
        typingTimer = setTimeout(() => {
            Coveo.executeQuery(root);
        }, typingTimerInterval);
    });
    var htmlForms = Array.from(document.getElementsByClassName('sophosform'));
    htmlForms.forEach(function (htmlForm) {
        //console.info('Creating form for ' + htmlForm.dataset.formid);
        Formio.createForm(htmlForm, 'https://fbhnfygzyfwuxxv.form.io/' + htmlForm.dataset.formid, {
            buttonSettings: {
                showCancel: false
            },
            breadcrumbSettings: {
                clickable: false
            }
        }).then(function (form) {
            form.on('change', function (event) {
                if (event.changed && event.changed.component.key === 'product' && event.changed.value) {
                    console.log(event);
                }
            });
            form.on('render', function (event) {
                console.log('Render');
            });
            form.on('load', function (event) {
                console.log('Load');
                console.log(event);
            });
            form.on('submit', function (event) {
                console.log(event);
            });
            form.on('nextPage', function (event) {
                console.log(event);
            });
        });
    });
};
