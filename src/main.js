import Vue from 'vue';
import axios from 'axios';
import App from '@/App.vue';
import bugsnag from '@bugsnag/js';
import bugsnagVue from '@bugsnag/plugin-vue';
import { DateFilter } from 'vue-interface/src/Filters/Date';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

Vue.filter('date', DateFilter);
Vue.config.productionTip = false;
Vue.component('icon', FontAwesomeIcon);

bugsnag({
    apiKey: '06c52a8df4f52e47e3133deb7d313a98',
    notifyReleaseStages: ['production', 'staging']
}).use(bugsnagVue, Vue);

axios.defaults.baseURL = process.env.NODE_ENV === 'development' ?
    'https://giveworks.test/api/v1' : 'https://secure.giveworks.net/api/v1';

export default new Vue({
    render: h => h(App)
}).$mount('#app');
