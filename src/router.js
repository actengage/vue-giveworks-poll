import Vue from 'vue';
import Router from 'vue-router';
import Index from '@/Views/Index';

Vue.use(Router);

const router = new Router({
    base: process.env.BASE_URL,
    routes: [
        {
            name: 'polls',
            path: '/',
            alias: '/:short/polls/:slug?',
            component: Index
        }
    ]
});

export default router;
