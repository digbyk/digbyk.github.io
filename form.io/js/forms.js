window.onload = function () {
    var htmlForms = Array.from(document.getElementsByClassName('sophosform'));
    htmlForms.forEach(function (htmlForm) {
        console.info('Creating form for ' + htmlForm.dataset.formid);
        Formio.createForm(document.getElementsByClassName('sophosform')[0], 'https://fbhnfygzyfwuxxv.form.io/' + htmlForm.dataset.formid)
            .then(function (form) {
                fetch('http://ip-api.com/json/')
                    .then(function (response) {
                        return response.json();
                    })
                    .then(function (json) {
                        form.submission = {
                            data: {
                                formType: htmlForm.dataset.formtype,
                                product: htmlForm.dataset.product,
                                countryCode: json.countryCode,
                                country: json.country,
                                geoCheckStatus: "true"
                            }
                        };
                    });
                form.on('change', function (event) {
                    console.log(event);
                    // Clearbit integration
                    // if (event.changed && event.changed.component.key === 'email' && event.changed.value && event.changed.value.match(/.+\@.+\..+/g)) {
                    //     let headers = new Headers();
                    //     headers.append('Authorization', 'Bearer sk_36e06412b0541f186157d5b03fa64689');
                    //     fetch('https://person.clearbit.com/v2/combined/find?email=' + event.changed.value, {
                    //         headers: headers
                    //     })
                    //         .then(function (response) {
                    //             return response.json();
                    //         })
                    //         .then(function (json) {
                    //             var submission = { data: event.data };
                    //             submission.data.firstName = json.person.name.givenName;
                    //             submission.data.lastName = json.person.name.familyName;
                    //             submission.data.jobRole = json.person.employment.title;
                    //             submission.data.company = json.company.name;
                    //             submission.data.industry = json.company.category.sector;
                    //             submission.data.companySize = json.company.metrics.employeesRange;
                    //             form.submission = submission;
                    //         })
                    //         .catch(function (error) {
                    //             console.log(error);
                    //         });
                    // }
                    if (event.changed && event.changed.component.key === 'email' && event.changed.value && event.isValid == 1) {
                        var submission = { data: event.data };
                        if (event.changed.value.match(/.+\@sophos\.com/g)) {
                            submission.data.nameCheckStatus = "true";
                            submission.data.companyCheckStatus = "true";
                            submission.data.company = "Sophos";
                        } else {
                            submission.data.nameCheckStatus = "false";
                            submission.data.companyCheckStatus = "false";
                        }
                        form.submission = submission;
                    }
                });
                form.on('submit', function (event) {
                    console.log(event);
                });
            });
    });
};
