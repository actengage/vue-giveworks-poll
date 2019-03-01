<template>

    <div class="poll" :class="{'loading': loading}">
        <activity-indicator v-if="loading" label="Loading..." type="spinner" center />
        <div v-else>
            <poll-form v-if="currentPoll" :api-key="apiKey" :poll="currentPoll" @next="onNext" />
        </div>
    </div>

</template>

<script>
import Poll from '@/Models/Poll';
import PollForm from '@/Components/Polls/PollForm';
import HttpRequestOptions from '@/Mixins/HttpRequestOptions';
import ActivityIndicator from 'vue-interface/src/Components/ActivityIndicator';

export default {

    name: 'Poll',

    mixins: [
        HttpRequestOptions
    ],

    components: {
        PollForm,
        ActivityIndicator
    },

    watch: {

        '$route.params.id': function(value) {
            this.load(value);
        },

        loading(value) {
            this.$emit('toggle-loading', value);
            this.$emit(value ? 'start-loading' : 'stop-loading');
        },

        poll(value) {
            this.currentPoll = value;
        }

    },

    props: {

        id: [Number, String],

        slug: [Number, String],

        poll: Object,

        model: Object,

        apiKey: {
            type: String,
            required: true
        }

    },

    methods: {

        onNext(poll) {
            this.$router.push({name: 'poll', params: {
                id: poll.id,
                poll: poll
            }});
        },

        load(id) {
            this.loading = true;

            return Poll.find(id, this.httpRequestOptions)
                .then(model => {
                    this.loading = false;
                    this.currentPoll = model.toJSON();
                });
        }

    },

    mounted() {
        if(this.startingPoll) {
            this.loading = false;
            this.currentPoll = this.startingPoll;
        }
        else if(!this.currentPoll) {
            this.load(this.id || this.slug).then(model => {
                this.$emit('load', model);
            }, err => {
                this.$emit('error', err);
            });
        }
    },

    data() {
        let poll = this.poll;

        if(this.model) {
            poll = this.model instanceof Poll ? this.model.toJSON() : this.model;
        }
        
        return {
            loading: !poll,
            currentPoll: null,
            startingPoll: poll
        };
    }

}
</script>

<style lang="scss">
.poll {
    &:not(.loading) {
        position: relative;
        margin: 0 auto;
        max-width: 520px;
    }

    .fade-enter-active, .fade-leave-active {
        transition: opacity .75s;
    }
    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
        opacity: 0;
    }
}
</style>
