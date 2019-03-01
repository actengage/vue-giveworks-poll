<template>

    <base-form
        :data="form"
        :model="model"
        :headers="headers"
        class="poll-form"
        @submit="onSubmit"
        @submit-failed="onSubmitFailed"
        @submit-complete="onSubmitComplete"
        @submit-success="onSubmitSuccess">
    
        <poll-date :poll="poll" />

        <h2 v-if="poll.question" class="text-center" v-html="poll.question" />

        <slide-deck :active="active" @enter="onSlideEnter">

            <div key="question">
                <poll-question v-model="form.answer" :poll="poll" :value="form.active" @input="active = 'contact'" />
            </div>

            <div key="contact">
                <poll-form-fields :activity="activity" :errors="errors" :form="form" :poll="poll" @cancel="onClickCancel" />
            </div>

            <div key="results">
                <poll-results :poll="poll" :api-key="apiKey" @back="onClickBack" @next="poll => $emit('next', poll)" />
            </div>

        </slide-deck>

    </base-form>

</template>

<script>
import BaseForm from 'vue-interface/src/Components/BaseForm';
import SlideDeck from 'vue-interface/src/Components/SlideDeck';

import Poll from '@/Models/Poll';
import PollDate from '@/Components/Polls/PollDate';
import PollResults from '@/Components/Polls/PollResults';
import PollQuestion from '@/Components/Polls/PollQuestion';
import PollFormFields from '@/Components/Polls/PollFormFields';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faPoll } from '@fortawesome/free-solid-svg-icons/faPoll';
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons/faTimesCircle';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons/faExclamationTriangle';

library.add(faPoll);
library.add(faTimesCircle);
library.add(faExclamationTriangle);

export default {

    name: 'poll-form',

    components: {
        BaseForm,
        PollDate,
        SlideDeck,
        PollResults,
        PollQuestion,
        PollFormFields,
    },

    watch: {

        poll(value) {
            this.errors = null;
            this.activity = false;
            this.model = new Poll(value);
            this.active = 'question';
            this.form = this.model.toJSON();
        }

    },

    computed: {

        headers() {
            return {
                Authorization: 'Bearer ' + this.apiKey
            };
        }

    },

    props: {

        apiKey: {
            type: String,
            required: true
        },

        poll: {
            type: Object,
            required: true
        }

    },

    methods: {

        onClickBack() {
            this.form.answer = null;
            this.active = 'question';
        },

        onClickCancel() {
            this.onClickBack();
        },

        onSlideEnter(slide) {
            this.$emit('slide-enter', slide);
        },

        onSubmit() {
            this.activity = true;
        },

        onSubmitSuccess(event, response) {
            window.localStorage.__poll__ = JSON.stringify(this.form);

            this.poll.statistics = response.get('statistics');
            this.active = 'results';
            this.form.answer = null;
        },

        onSubmitComplete(event, success, response) {
            this.activity = false;
        },

        onSubmitFailed(event, response) {
            this.errors = response.data;
        }

    },

    mounted() {
        if(window.localStorage.__poll__) {
            this.form = Object.assign(
                JSON.parse(window.localStorage.__poll__), {
                    answer: null
                }
            );
        }
    },

    data() {
        return {
            model: new Poll({
                id: this.poll.id
            }),
            form: {
                answer: null
            },
            errors: null,
            loading: true,
            activity: false,
            active: 'question'
        }
    }

}
</script>
