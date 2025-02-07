sap.ui.define([
    "sap/ui/model/Filter",
    "sap/ui/core/format/DateFormat"
], function (Filter, DateFormat) {
    "use strict";
    // controller for custom filter, navigation param, action(quick view and global filter), navigation target 
    // controller class name can be like app.ovp.ext.CustomFilter where app.ovp can be replaced with your application namespace
    return {
        getCustomFilters: function () {
            /* This method returns a filter object to the OVP library. If there are multiple filters, they should 
            be clubbed into single Filter object. */

            const formatter = DateFormat.getDateInstance({ pattern: 'yyyyMMdd' })

            var dateFrom = this.oView.byId("CustomPeriod").getDateValue();
            var dateTo = this.oView.byId("CustomPeriod").getSecondDateValue();
            var aFilters = [];
            if (dateFrom && dateTo) {
                aFilters.push(new Filter({
                    path: "Period",
                    operator: "GE",
                    value1: formatter.format(dateFrom)
                }));
                aFilters.push(new Filter({
                    path: "Period",
                    operator: "LE",
                    value1: formatter.format(dateTo)
                }));
            }
            if (aFilters && aFilters.length > 0) {
                return (new Filter(aFilters, true));
            }
        },

        getCustomAppStateDataExtension: function (oCustomData) {
            //the content of the custom field will be stored in the app state, so that it can be restored later, for example after a back navigation.
            //The developer has to ensure that the content of the field is stored in the object that is returned by this method.
            if (oCustomData) {
                var oCustomField1 = this.oView.byId("CustomPeriod");
                if (oCustomField1) {
                    oCustomData.CustomPeriod = oCustomField1.getValue();
                }
            }
        },

        restoreCustomAppStateDataExtension: function (oCustomData) {
            //in order to restore the content of the custom field in the filter bar, for example after a back navigation,
            //an object with the content is handed over to this method. Now the developer has to ensure that the content of the custom filter is set to the control
            if (oCustomData) {
                if (oCustomData.CustomPeriod) {
                    var oCustomField1 = this.oView.byId("CustomPeriod");
                    oCustomField1.setValue(oCustomData.CustomPeriod);
                }
            }
        },

        onCustomParams: function (sCustomParams) {
            // if (sCustomParams == 'Card06' || sCustomParams == 'Card02' || sCustomParams == 'Card08') {
            return this.paramCard.bind(this);
            // }
        },

        getBasicParams(oNavigateParams, oSelectionVariantParams) {

            const basicParams = []
            const params = []

            basicParams.forEach(b => {
                const selParam = oSelectionVariantParams.getSelectOption(b)

                if (oNavigateParams[b]) {
                    params.push({
                        path: b,
                        operator: 'EQ',
                        value1: oNavigateParams[b],
                        value2: '',
                        sign: 'I'
                    })

                } else {
                    if (selParam) {
                        selParam.forEach(p => {
                            params.push({
                                path: b,
                                operator: p.Option,
                                value1: p.Low,
                                value2: '',
                                sign: p.Sign
                            })
                        })
                    } else {
                        params.push({
                            path: b,
                            operator: 'EQ',
                            value1: '',
                            value2: '',
                            sign: 'I'
                        })
                    }
                }
            })

            return params
        },

        paramCard: function (oNavigateParams, oSelectionVariantParams) {
            const params = []

            const formatter = DateFormat.getDateInstance({ pattern: 'yyyyMMdd' })
            var dateFrom = this.oView.byId("CustomPeriod").getDateValue();
            var dateTo = this.oView.byId("CustomPeriod").getSecondDateValue();

            if (dateFrom && dateTo) {
                params.push({
                    path: 'Period',
                    operator: 'EQ',
                    value1: `${formatter.format(dateFrom)}-${formatter.format(dateTo)}`,
                    sign: 'I'
                })
            }

            return params
        }
    }
});