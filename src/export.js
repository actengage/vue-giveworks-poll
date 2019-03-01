import Vue from 'vue';
import bugsnag from '@bugsnag/js';
import bugsnagVue from '@bugsnag/plugin-vue';
import Poll from './Components/Polls/Poll';

if(process.env.NODE_ENV !== 'development') {
    bugsnag({
        apiKey: '06c52a8df4f52e47e3133deb7d313a98',
        notifyReleaseStages: ['production', 'staging']
    }).use(bugsnagVue, Vue);
}

Vue.config.productionTip = false;
Vue.component('giveworks-poll', Poll);
