<template>

    <base-form :data="form" :model="model" :headers="headers" class="poll-form" @submit="onSubmit" @submit:failed="onSubmitFailed" @submit:complete="onSubmitComplete" @submit:success="onSubmitSuccess">
    
        <div class="poll-date mt-2 pt-1 mb-3 pb-1">{{ poll.published_at | date('MMMM D, YYYY') }}</div>

        <h2 v-if="poll.question" class="poll-question mx-md-5" v-html="poll.question"/>

        <slide-deck :active="active" @enter="onSlideEnter">

            <div key="question">

                <div v-if="poll.html" v-html="poll.html"/>

                <transition v-if="poll.options.include_embed" name="fade" mode="out-in">
                    <poll-embed :key="poll.id" :poll="poll" class="mb-5"/>
                </transition>

                <div v-if="poll.image" class="d-flex justify-content-center mb-5">
                    <img class="poll-img img-fluid mb-2" :src="poll.image.url">
                </div>

                <div class="mb-5 px-lg-5">
                    <div class="w-100">
                        <btn-group v-responsive-blocks="{selector: 'span'}" :vertical="vertical" :style="{'grid-template-columns': `repeat(${poll.answers.length}, minmax(${100 / poll.answers.length}%, 1fr)`}" toggle class="poll-buttons" @resize.native="onResize">
                            <btn v-for="answer in poll.answers" :key="answer" :active="form.answer === answer" type="button" size="lg" variant="primary" outline @click="onClickAnswer(answer)">
                                <span v-html="answer"/>
                            </btn>
                        </btn-group>
                    </div>
                </div>
            
                <a href="#" class="d-flex justify-content-center">
                    <div class="icon social fb">
                        <icon :icon="['fab', 'facebook']" />
                    </div>
                    <div class="icon social tw">
                        <icon :icon="['fab', 'twitter']" />
                    </div>
                    <div class="icon social em">
                        <icon icon="envelope" />
                    </div>
                    <div class="icon social share">Share this poll</div>
                </a>

            </div>

            <div key="contact">

                <div>
                    <h3 v-html="form.answer" class="display-4 mb-0"/>
                    <btn type="button" variant="primary" class="mt-4 mb-0" @click="onClickCancel">
                        <icon icon="times-circle"/> Cancel
                    </btn>
                </div>

                <div class="row justify-content-center align-items-center">
                    <div class="col-lg-7">
                        <card class="mt-xs-3 mt-lg-5">
                            <card-body>
                                <card-title>Tell us who you are</card-title>
                                <card-subtitle><p><em>* Indicates the required fields.</em></p></card-subtitle>
                                <input-field v-model="form.first" name="first" label="First Name*" :errors="errors"/>
                                <input-field v-model="form.last" name="last" label="Last Name*" :errors="errors"/>
                                <input-field v-model="form.email" name="email" label="Email*" placeholder="you@example.com" help-text="Either an email or a phone is required." :errors="errors" @blur="shouldShowAddress = form.first && form.last && (form.email || form.email)"/>
                                <input-field v-model="form.phone" name="phone" label="Phone Number*" class="mb-0" :errors="errors" @blur="shouldShowAddress = form.first && form.last && (form.email || form.email)"/>
                            </card-body>
                        </card>

                        <transition name="fade">
                            <card key="address" v-show="shouldShowAddress" class="mt-xs-3 mt-lg-4">
                                <card-body>
                                    <card-title>Mailing Address</card-title>
                                    <card-subtitle><p><em>Your mailing address is optional.</em></p></card-subtitle>
                                    <div class="row">
                                        <div class="col-sm-8">
                                            <input-field v-model="form.street" name="street" label="Street Address" :errors="errors" placeholder="123 Some Street Goes Here"/>
                                        </div>
                                        <div class="col-sm-4">
                                            <input-field v-model="form.addr2" name="addr2" label="Unit #" :errors="errors"/>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-sm-7">
                                            <input-field v-model="form.city" name="city" label="City" :errors="errors"/>
                                        </div>
                                        <div class="col-sm-2">
                                            <input-field v-model="form.state" name="state" label="State" maxlength="2" :errors="errors"/>
                                        </div>
                                        <div class="col-sm-3">
                                            <input-field v-model="form.zip" name="zip" label="Zipcode" class="mb-0" maxlength="5" :errors="errors"/>
                                        </div>
                                    </div>
                                </card-body>
                            </card>
                        </transition>

                        <alert v-if="!poll.active" variant="danger">
                            <icon icon="exclamation-triangle"/> This poll is not active and cannot be submitted.
                        </alert>

                        <btn-activity variant="primary" size="lg" class="my-xs-3 my-lg-4" block :activity="activity" :disabled="!poll.active || !shouldShowAddress">
                            Submit Poll
                        </btn-activity>
                    </div>
                </div>
            </div>

            <div key="results">
                <dounut-chart :data="poll.statistics.breakdown" :height="300"/>

                <div class="text-center mt-3">
                    <btn v-if="!success" type="button" size="lg" @click="active = 'question'">
                        <icon icon="long-arrow-left"/> Back to Question
                    </btn>
                    <div v-else-if="poll.next_poll" class="mt-5 mb-3 row justify-content-center">
                        <div class="col-md-7" :style="{maxWidth: '500px'}">
                            <h2 class="mb-4">Next Up...</h2>

                            <div class="text-left mb-2 pb-2">
                                <transition v-if="poll.options.include_embed" name="fade" mode="out-in">
                                    <poll-embed :key="poll.id" :poll="poll" class="py-4"/>
                                </transition>

                                <div v-else-if="poll.image" class="d-flex justify-content-center">
                                    <img class="poll-img img-fluid mb-2" :src="poll.image.url">
                                </div>

                                <blockquote class="blockquote" v-html="poll.next_poll.question"/>
                            </div>

                            <btn :to="{name: 'polls', params: {slug: poll.next_poll.slug}}" type="button" size="lg" @click="active = 'question'" class="d-inline-flex align-items-center">
                                <icon icon="poll" size="2x" class="mr-3" /> Take Next Poll <icon icon="long-arrow-right" class="ml-3" size="2x" />
                            </btn>
                        </div>
                    </div>
                </div>
            </div>

        </slide-deck>

    </base-form>

</template>

<script>
import Btn from 'vue-interface/src/Components/Btn';
import Card from 'vue-interface/src/Components/Card';
import Alert from 'vue-interface/src/Components/Alert';
import Badge from 'vue-interface/src/Components/Badge';
import BtnGroup from 'vue-interface/src/Components/BtnGroup';
import BaseForm from 'vue-interface/src/Components/BaseForm';
import SlideDeck from 'vue-interface/src/Components/SlideDeck';
import InputField from 'vue-interface/src/Components/InputField';
import CardBody from 'vue-interface/src/Components/Card/CardBody';
import BtnActivity from 'vue-interface/src/Components/BtnActivity';
import CardTitle from 'vue-interface/src/Components/Card/CardTitle';
import CardSubtitle from 'vue-interface/src/Components/Card/CardSubtitle';

import Poll from '@/Models/Poll';
import PollEmbed from '@/Components/Polls/PollEmbed';
import DounutChart from '@/Components/Charts/DounutChart';
import ResponsiveBlocks from '@/Directives/ResponsiveBlocks';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faPoll } from '@fortawesome/free-solid-svg-icons/faPoll';
import { faTwitter } from '@fortawesome/free-brands-svg-icons/faTwitter';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons/faEnvelope';
import { faFacebook } from '@fortawesome/free-brands-svg-icons/faFacebook';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons/faExclamationTriangle';

library.add(faPoll);
library.add(faTwitter);
library.add(faEnvelope);
library.add(faFacebook);
library.add(faExclamationTriangle);

export default {

    name: 'poll-form',

    components: {
        Alert,
        Badge,
        Btn,
        Card,
        CardBody,
        CardTitle,
        CardSubtitle,
        DounutChart,
        BaseForm,
        BtnGroup,
        PollEmbed,
        SlideDeck,
        InputField,
        BtnActivity
    },

    filters: {
        ResponsiveBlocks
    },

    directives: {
        ResponsiveBlocks
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

        onResize(event) {
            this.vertical = (
                event.doesTextOverflow ||
                event.doesHaveLineBreaks ||
                event.doesCalculatedWidthExceedContainer
            );
        },

        onSlideEnter(slide) {
            this.$emit('slide-enter', slide);
        },

        onClickAnswer(answer) {
            this.form.answer = answer;
            this.active = 'contact';
        },

        onClickCancel() {
            this.form.answer = null;
            this.active = 'question';
        },

        onSubmit() {
            this.activity = true;
        },

        onSubmitSuccess(event, response) {
            window.localStorage.__poll__ = JSON.stringify(this.form);

            this.poll.statistics = response.get('statistics');
            this.active = 'results';
            this.success = true;
            this.form = {
                answer: null
            }
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

        this.shouldShowAddress = this.form.first && this.form.last && (
            this.form.email || this.form.phone
        );
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
            strategy: null,
            success: false,
            activity: false,
            vertical: false,
            active: 'question',
            shouldShowAddress: false
        }
    }

}
</script>
