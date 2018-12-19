window.onload = function () {
    var htmlForms = Array.from(document.getElementsByClassName('sophosform'));
    htmlForms.forEach(function (htmlForm) {
        //console.info('Creating form for ' + htmlForm.dataset.formid);
        Formio.createForm(document.getElementsByClassName('sophosform')[0], 'https://fbhnfygzyfwuxxv.form.io/' + htmlForm.dataset.formid)
            .then(function (form) {
                var data = {
                    formType: htmlForm.dataset.formtype,
                    product: htmlForm.dataset.product
                };
                form.submission = {
                    data: data
                };
                fetch('http://ip-api.com/json/')
                    .then(function (response) {
                        return response.json();
                    })
                    .then(function (json1) {
                        data.countryCode = json1.countryCode;
                        data.country = json1.country;
                        data.geoCheckStatus = 'true';
                        if (form._form.properties.lookupService == 'Demandbase') {
                            var url = `https://api.company-target.com/api/v2/ip.json?key=${form._form.properties.demandbaseKey}&page=${document.location.href}&page_title=${document.title}&referrer=${document.referrer}`;
                            fetch(url)
                                .then(function (response) {
                                    return response.json();
                                })
                                .then(function (json2) {
                                    console.log(json2);
                                    // data.countryCode = json.country ? json.country : json.registry_country_code;
                                    // data.country = json.country_name ? json.country_name : json.registry_country;
                                    // data.geoCheckStatus = 'true';
                                    data.company = json2.marketing_alias;
                                    data.industry = json2.industry;
                                    data.companySize = json2.employee_count;
                                    data.companyCheckStatus = json2.information_level == 'Detailed' ? 'true' : 'false';
                                    form.submission = {
                                        data: data
                                    };
                                })
                                .catch(function (error) {
                                    console.log(error);
                                });
                        }
                                form.submission = {
                            data: data
                        };
                    });
                form.on('change', function (event) {
                    // Demandbase integration
                    if (event.changed && event.changed.component.key === 'email' && event.changed.value && event.changed.value.match(/.+\@.+\..+/g)) {
                        var url = `https://api.company-target.com/api/v2/ip.json?key=${form._form.properties.demandbaseKey}&page=${document.location.href}&page_title=${document.title}&referrer=${document.referrer}`;
                        fetch(url)
                            .then(function (response) {
                                return response.json();
                            })
                            .then(function (json) {
                                console.log(json);
                                var submission = { data: event.data };
                                //submission.data.firstName = json.person.name.givenName;
                                //submission.data.lastName = json.person.name.familyName;
                                //submission.data.jobRole = json.person.employment.title;
                                submission.data.company = json.marketing_alias;
                                submission.data.industry = json.industry;
                                submission.data.companySize = json.employee_count;
                                form.submission = submission;
                            })
                            .catch(function (error) {
                                console.log(error);
                            });
                    }
                    // if (event.changed && event.changed.component.key === 'email' && event.changed.value && event.isValid == 1) {
                    //     var submission = { data: event.data };
                    //     if (event.changed.value.match(/.+\@sophos\.com/g)) {
                    //         submission.data.nameCheckStatus = "true";
                    //         submission.data.companyCheckStatus = "true";
                    //         submission.data.company = "Sophos";
                    //     } else {
                    //         submission.data.nameCheckStatus = "false";
                    //         submission.data.companyCheckStatus = "false";
                    //     }
                    //     form.submission = submission;
                    // }
                });
                form.on('submit', function (event) {
                    console.log(event);
                });
            });
    });
};
