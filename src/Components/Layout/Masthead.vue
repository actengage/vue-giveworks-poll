<template>
    <header class="masthead">
        <div class="masthead-content container">
            <div ref="heading" id="todays-poll" class="masthead-heading text-uppercase" v-intersection-observer="() => ({rootMargin: `-175px 0px 0px 0px`, threshold: 1})" @intersect="$emit('intersect', $event)">Today's Poll</div>
            <div class="today-poll">
                <card class="position-relative d-flex justify-content-center align-items-center">
                    <activity-indicator v-if="loading" label="Loading Poll..." type="spinner" center/>
                    <poll-form v-else-if="poll" ref="form" :poll="poll" :apiKey="apiKey" @slide-enter="onSlideEnter"/>
                    <div v-else class="w-100">
                        <icon icon="exclamation-triangle" size="3x" />
                        <h2 class="mt-3">There are no polls for this site.</h2>
                    </div>
                </card>
            </div>
        </div>
    </header>
</template>

<script>
import Poll from '@/Models/Poll';
import PollForm from '@/Components/Polls/PollForm';
import Card from 'vue-interface/src/Components/Card';
import scrollTo from 'vue-interface/src/Helpers/ScrollTo';
import HttpRequestOptions from '@/Mixins/HttpRequestOptions';
import IntersectionObserver from '@/Directives/IntersectionObserver';
import ActivityIndicator from 'vue-interface/src/Components/ActivityIndicator';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons/faExclamationTriangle';

library.add(faExclamationTriangle);

export default {

    name: 'poll-masthead',

    mixins: [
        HttpRequestOptions
    ],

    components: {
        Card,
        PollForm,
        ActivityIndicator
    },

    directives: {
        IntersectionObserver
    },

    props: {

        apiKey: {
            type: String,
            require: true
        },

        slug: String

    },

    watch: {
        slug(value) {
            scrollTo(this.$refs.heading, 100).then(() => this.load(value));
        }
    },

    methods: {

        load(slug) {
            this.poll = null;
            this.loading = true;

            const loaded = response => {
                const json = (response.data ? response.data[0] : response);

                this.loading = false;
                this.poll = json ? json.toJson() : null;
            };

            return (
                slug ? Poll.find(slug, this.httpRequestOptions) : Poll.search({limit: 1}, this.httpRequestOptions)
            ).then(loaded);
        },

        onSlideEnter() {
            scrollTo(this.$refs.heading, 100);
        }

    },

    mounted() {
        this.load(this.slug);
    },

    data() {
        return {
            poll: null,
            loading: true
        }
    }

}
</script>

<style lang="scss">
@import '@/assets/scss/_variables.scss';
@import '@/assets/scss/_mixins.scss';

// Styling for the masthead

.masthead {
    min-height: 400px;
    text-align: center;
    color: white;

    .slide-deck-content {
        overflow: hidden;
        padding: 1rem;
    }

    .masthead-heading {
        color: white;
        font-size: 3rem;
        font-weight: 700;
        line-height: 3rem;
        margin-bottom: 2rem;
        @include heading-font;
    }

    .masthead-content {
        color: black;
        padding-top: 15rem;

        .poll-date {
            @include body-font;
            background-color: transparent;
            color: $primary-red;
            font-size: 15px;
            text-transform: uppercase;
            text-align: center;
            font-weight: 700;
            letter-spacing: 1px;
        }

        .poll-question {
            @include body-font;
            font-size: 25px;
            margin-bottom: 25px;
        }

        .btn-group,
        .btn-group-vertical {
            .btn {
                font-size: 1.5rem;
                @include body-font;
                padding: 2rem 4rem;
            }
        }

        .btn-group {
            display: inline-grid;
        }

        .btn-group-vertical {
            display: flex;

            .btn {
                white-space: normal;
            }
        }

        .btn-primary {
            color: white;
            border: 1px solid $primary-red;
            background-color: $primary-red;

            &:hover,
            &:active,
            .active {
                border: 1px solid $primary-red;
                background-color: $primary-red;
            }

            &:focus:not(:disabled),
            &:active:not(:disabled),
            .active:not(:disabled) {
                box-shadow: 0 0 0 .2rem rgba($primary-red, .5);
            }
        }

        .btn-outline-primary {
            @include body-font;
            color: $primary-red;
            border: 1px solid $primary-red;

            &:hover,
            &:active,
            .active {
                outline: none;
                color: white;
                background-color: $primary-red;
                border: 1px solid $primary-red;
            }

            &:focus:not(:disabled),
            &:active:not(:disabled),
            .active:not(:disabled) {
                box-shadow: 0 0 0 .2rem rgba($primary-red, .5);
            }
        }

        & > .today-poll > .card {
            border-radius: 0;
            border-color: rgba(0, 0, 0, 0.05);
            box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.04), 0 6px 20px 0 rgba(0, 0, 0, 0.04);
            min-height: 400px;
            padding: 20px;

            .card-header,
            .card-footer {
                border: none;
                background-color: white;
            }

            .card {
                text-align: left;
            }
        }

        .icon {
            i {
                font-size: 20px;
                left: 9px;
                top: 10px;
                color: $primary-blue;
            }

            &.social {
                margin: 0 5px 8px 0;
                cursor: pointer;
                color: $primary-blue;
                transition: 0.25s;
                margin-right: 15px;

                &.share {
                    text-transform: uppercase;
                    font-weight: 700;
                    letter-spacing: 1px;
                }
            }
        }
    }
}

@media(min-width:768px) {
    .masthead {
        .masthead-content {
            .masthead-heading {
                font-size: 75px;
                font-weight: 700;
                line-height: 75px;
                margin-bottom: 3rem;
                @include heading-font;
            }
        }
    }
}
</style>
