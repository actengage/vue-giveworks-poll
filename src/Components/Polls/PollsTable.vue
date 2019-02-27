<template>
    <table-view
        card
        ref="table"
        order="id"
        sort="desc"
        heading="Polls"
        class="polls-table"
        url="/api/admin/v1/polls"
        :min-height="196"
        :columns="[
            {id: 'title', name: 'Title'},
            {name: '# Responses'},
            {id: 'published_at', name: 'Published At'},
            {id: 'expired_at', name: 'Expired At'},
            {width: 100}
        ]">

        <template slot="buttons">
            <btn :to="{name: 'create-poll', params: {step: 'title'}}" icon="plus">New Poll</btn>
        </template>

        <template slot-scope="props">
            <tr v-for="(row, i) in props.data" :key="i">
                <td>
                    <div class="d-flex align-items-center">
                        <dounut-chart v-if="row.statistics.total_responses" :data="row.statistics.breakdown" :width="60" :height="60" :labels="false" class="mr-4" />
                        <router-link :to="{name: 'poll-details', params: {id: row.id}}">{{ row.title }}</router-link>
                    </div>
                </td>
                <td>{{ row.statistics.total_responses }}</td>
                <td>{{ row.published_at || row.created_at }}</td>
                <td>{{ row.expired_at || 'N/A' }}</td>
                <td>
                    <btn-activity :activity="activity[i]" variant="danger" size="sm" @click="onClickDelete(row, i)">
                        <icon icon="trash-alt" /> Delete
                    </btn-activity>
                </td>
            </tr>
        </template>
    </table-view>
</template>

<script>
import Poll from '@/Models/Admin/Poll';
import Breadcrumbing from '@/Mixins/Breadcrumbing';
import Btn from 'vue-interface/src/Components/Btn';
import DounutChart from '@/Components/Charts/DounutChart';
import TableView from 'vue-interface/src/Components/TableView';
import BtnActivity from 'vue-interface/src/Components/BtnActivity';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons/faTrashAlt';

library.add(faPlus);
library.add(faTrashAlt);

export default {

    name: 'polls-table',

    mixins: [
        Breadcrumbing
    ],

    components: {
        Btn,
        TableView,
        BtnActivity,
        DounutChart
    },

    methods: {
        onClickDelete(row, i) {
            this.$prompt('Confirm Delete', `Are you sure want to delete "${row.title}"?`, (model, succeed, fail) => {
                model.activity = true;

                new Poll(row).delete().then(succeed, fail);
            }).then(response => {
                this.$refs.table.fetch();
            });
        }
    },

    data() {
        return {
            activity: {}
        }
    }

}
</script>

<style lang="scss">
.polls-table tbody td {
    vertical-align: middle;
}
</style>
