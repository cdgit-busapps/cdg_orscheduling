import Vue from "vue";
import moment from "moment";
Vue.filter("shortDate", function (value) {
    return moment(value).format("L");
});
Vue.filter("shortDateandTime", function (value) {
    return moment(value).format("L LT");
});

Vue.filter("LongDateandTime", function (value) {
    return moment(value).format("LLLL");
});
var numeral = require("numeral");

Vue.filter("formatNumber", function (value) {
    return Number(value).toLocaleString(); // displaying other groupings/separators is possible, look at the docs
});
export default {
    methods: {
        can(val) {
            return this.$auth.user.details.role.permissions.some(permission => permission.key == val)
        },
        role_permission_can(val) {
            if (this.$store.state.permissions){
                return this.$store.state.permissions.some(permission => permission.key == val)
            }
        },
        _date_format(date){
            return moment(date).format("YYYY-MM-DD");
        },
        _createParams(params, old_params) {
            let param = "";
            let sortby;
            let sorttype;
            // let sortby = params.sortBy[0];
            // let sorttype = params.sortDesc[0];
            if (params.sortBy && params.sortBy[0]) sortby = params.sortBy[0];
            if (params.sortDesc && params.sortDesc[0]) sorttype = params.sortDesc[0];
            let page = params.page;
            let perpage = params.itemsPerPage;
            param += `page=${page}&per_page=${perpage}`;
            if (sortby) {
                param += `&sortBy=${sortby}/${sorttype ? "asc" : "desc"}`;
            }
            if (old_params) param += `&${old_params}`;
            return param;
        },
        _createFilterParams(filters, old_params = true) {
            let params = "";
            for (const item in filters) {
                // if(filters[item])
                if (filters[item] != null) {
                    params = params + "&" + item + "=" + filters[item];
                }
            }
            if (old_params) return params;
            else return params.substring(1);
        },
    }
}