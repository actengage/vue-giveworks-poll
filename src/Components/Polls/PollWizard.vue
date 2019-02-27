<template>
    <div class="poll-wizard">
        <activity-indicator v-if="loading" size="md" type="spinner" label="Loading Poll..." center/>
        <wizard v-else ref="wizard" completed="options" :activity="saving" :active="step" :header="`${!form.id ? 'Create' : 'Update'} Poll`" @enter="onEnter">

            <wizard-success slot="success">
                <div class="py-3">
                    <btn @click="onClickNew" size="lg" variant="success" class="mr-2">
                        <icon icon="plus"/> Create New Poll
                    </btn>
                    <btn :to="{name: 'view-polls'}" size="lg">
                        Back to Index <icon icon="long-arrow-alt-right"/>
                    </btn>
                </div>
            </wizard-success>

            <wizard-step key="title" label="Title & Slug" :validate="() => { return !!form.title && !!form.slug }">
                <div>
                    <div class="row justify-content-center">
                        <div class="col-sm-7">
                            <form @submit.prevent="onSubmit">
                                <div class="p-sm-4">
                                    <h2 class="mb-0">Title</h2>
                                    <p>The title will be used for SEO and used to referrence the poll later.</p>
                                    <input-field v-model="form.title" label="Title" name="title" :errors="errors" help-text="This is a common name of the poll. It will also be used as the page title." />
                                    <input-field v-slug="form.title" v-model="form.slug" label="Slug" name="slug" :errors="errors" help-text="The unique string of text used in the poll's URL." />
                                    <button type="submit" class="d-none"/>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </wizard-step>
            <wizard-step key="content" label="Content" :validate="() => { return !!form.url || !!form.content; }">
                <div>
                    <div class="row">
                        <div class="col-sm-3">
                            <vertical-navigation>
                                <navigation-link :to="{name: routeName, params: {step: step, tab: null}}" :error="errors ? errors.question : null" :class="{'has-errors': errors && errors.question ? errors.question.length : null}">
                                    <icon icon="question"/> Question
                                </navigation-link>
                                <navigation-link :to="{name: routeName, params: {step: step, tab: 'url'}}" :error="errors ? errors.url : null" :class="{'has-errors': errors && errors.url ? errors.url.length : null}">
                                    <icon icon="link"/> Url
                                </navigation-link>
                                <navigation-link :to="{name: routeName, params: {step: step, tab: 'image'}}" :error="errors ? errors.image : null" :class="{'has-errors': errors && errors.image ? errors.image.length : null}">
                                    <icon icon="image"/> Image
                                </navigation-link>
                                <navigation-link :to="{name: routeName, params: {step: step, tab: 'page'}}" :error="errors ? errors.content : null" :class="{'has-errors': errors && errors.content ? errors.content.length : null}">
                                    <icon icon="file-alt"/> Page Content
                                </navigation-link>
                                <navigation-link :to="{name: routeName, params: {step: step, tab: 'answers'}}" :error="errors ? errors.answers : null" :class="{'has-errors': errors && errors.answers ? errors.answers.length : null}">
                                    <icon icon="list-alt"/> Poll Answers
                                </navigation-link>
                            </vertical-navigation>
                        </div>
                        <div class="col-sm-9">
                            <slide-deck :active="tab || 'question'">
                                <div key="question">
                                    <textarea-field v-autogrow v-model="form.question" name="question" :errors="errors" placeholder="What question are you polling to the audience?" help-text="If no question given, then you can give the poll some context by using the content field." />
                                </div>
                                <div key="url">
                                    <input-field v-model="form.url" ref="url" name="url" :errors="errors" :activity="activity" class="mb-0" placeholder="https://example.com" help-text="Links to Tweets, Facebook, and YouTube will be automatically embedded." @paste="onPasteUrl" @blur="onBlurUrl" />
                                    <div class="poll-preview d-flex justify-content-center align-items-center pt-4">
                                        <transition name="fade" mode="out-in">
                                            <component
                                                v-if="form.options.strategy && form.options.strategy.embed"
                                                :key="form.options.strategy.url"
                                                :is="form.options.strategy.embed.component"
                                                class="my-3 mb-4"
                                                v-bind="form.options.strategy.embed.props"
                                                @loaded="activity = false"
                                            />
                                        </transition>
                                    </div>
                                </div>
                                <div key="image">
                                    <dropzone class="d-flex justify-content-center align-items-center" :style="{minHeight: '265px'}">
                                        <file-preview v-if="file" :class="progress ? 'uploading' : null" :hideClose="!!progress" :file="file" @close="form.file = file = null" :progress="progress"/>
                                        <btn-file v-else v-model="file" size="lg" :multiple="false" class="mb-5" @change="onFileChange">
                                            <icon icon="cloud-upload"/> Select Image
                                        </btn-file>
                                    </dropzone>
                                </div>
                                <div key="page">
                                    <textarea-field v-autogrow v-model="form.content" ref="content" name="content" :errors="errors" rows="7" placeholder="Additional page content goes here..."/>
                                </div>
                                <div key="answers">
                                    <alert class="d-flex align-items-center">
                                        <icon icon="info-circle" size="2x" class="mr-3"/> Every poll must have at a minimum of answers. Tab for a new line.
                                    </alert>
                                    <input-field ref="answers" v-for="(answer, i) in form.answers" :key="i" v-model="form.answers[i]" @keydown.tab="onTabAnswer($event, i)" @blur="onBlurAnswer($event, i)" />
                                    <input-field ref="answer" placeholder="Type your answer..." name="answers" :errors="errors" @keydown.tab="onAddAnswer" @blur="onAddAnswer" />
                                </div>
                            </slide-deck>
                        </div>
                    </div>
                </div>
            </wizard-step>
            <wizard-step key="options" label="Options" @finish="onClickFinish">
                <div>
                    <div class="row justify-content-center">
                        <div class="col-sm-7">
                            <h2 class="mb-3">Options</h2>
                            <input-field v-datepicker="datepickerOptions" v-model="form.published_at" label="Published At" help-text="Polls will not be visible until the specified date. If no date is specified, polls will be visible immediately." />
                            <input-field v-datepicker="datepickerOptions" v-model="form.expired_at" label="Expired At" help-text="Polls will visible after the specified date. If no date is specified, poll will never expire." />
                            <light-switch-field v-model="form.options.open_results" label="Open Poll Results" help-text="Can users to see poll results before voting?"/>
                            <light-switch-field v-model="form.options.edit_answer" label="Can Edit Answer" help-text="If a user submit the poll twice the previous answer is replaced with the new answer?"/>
                            <light-switch-field v-model="form.options.include_embed" label="Include Embed" help-text="Do you want to include the Facebook, Twitter, or YouTube embed?"/>
                        </div>
                    </div>
                </div>
            </wizard-step>
        </wizard>
    </div>
</template>

<script>
import ActivityIndicator from 'vue-interface/src/Components/ActivityIndicator';
import Alert from 'vue-interface/src/Components/Alert';
import Autogrow from 'vue-interface/src/Directives/Autogrow';
import Btn from 'vue-interface/src/Components/Btn';
import BtnFile from 'vue-interface/src/Components/BtnFile';
import Dropzone from 'vue-interface/src/Components/Dropzone';
import FilePreview from 'vue-interface/src/Components/FilePreview';
import InputField from 'vue-interface/src/Components/InputField';
import LightSwitchField from 'vue-interface/src/Components/LightSwitchField';
import NavigationLink from 'vue-interface/src/Components/Navigation/NavigationLink';
import SlideDeck from 'vue-interface/src/Components/SlideDeck';
import Slug from 'vue-interface/src/Directives/Slug';
import TextareaField from 'vue-interface/src/Components/TextareaField';
import Wizard from 'vue-interface/src/Components/Wizard';
import WizardStep from 'vue-interface/src/Components/Wizard/WizardStep';
import WizardSuccess from 'vue-interface/src/Components/Wizard/WizardSuccess';

import Poll from '@/Models/Admin/Poll';
import Media from '@/Models/Admin/Media';
import Datepicker from '@/Directives/Datepicker';
import Twitter from '@/Components/Embeds/Twitter';
import Youtube from '@/Components/Embeds/Youtube';
import Breadcrumbing from '@/Mixins/Breadcrumbing';
import Facebook from '@/Components/Embeds/Facebook';
import match from '@/Components/Polls/Helpers/Match';
import VerticalNavigation from '@/Components/Navigation/VerticalNavigation';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { faLink } from '@fortawesome/free-solid-svg-icons/faQuestion';
import { faImage } from '@fortawesome/free-solid-svg-icons/faQuestion';
import { faFileAlt } from '@fortawesome/free-solid-svg-icons/faFileAlt';
import { faListList } from '@fortawesome/free-solid-svg-icons/faListList';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons/faTrashAlt';
import { faQuestion } from '@fortawesome/free-solid-svg-icons/faQuestion';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons/faInfoCircle';
import { faCloudUpload } from '@fortawesome/free-solid-svg-icons/faCloudUpload';
import { faLongArrowAltRight } from '@fortawesome/free-solid-svg-icons/faLongArrowAltRight';

library.add(faLink);
library.add(faPlus);
library.add(faImage);
library.add(faFileAlt);
library.add(faListList);
library.add(faTrashAlt);
library.add(faQuestion);
library.add(faInfoCircle);
library.add(faCloudUpload);
library.add(faLongArrowAltRight);

export default {

    name: 'poll-wizard',

    mixins: [
        Breadcrumbing
    ],

    components: {
        ActivityIndicator,
        Alert,
        Btn,
        BtnFile,
        Datepicker,
        Dropzone,
        Facebook,
        FilePreview,
        InputField,
        LightSwitchField,
        NavigationLink,
        SlideDeck,
        TextareaField,
        Twitter,
        VerticalNavigation,
        Wizard,
        WizardStep,
        WizardSuccess,
        Youtube,
    },

    directives: {
        Autogrow,
        Datepicker,
        Slug
    },

    watch: {
        '$route': function(to, from ) {
            this.tab = to.params.tab;
            this.step = to.params.step;
            this.$refs.wizard.isFinished = false;

            if(to.name !== from.name) {
                this.routeChanged(to, from);
            }
            else if(to.params.id && to.params.id !== from.params.id) {
                this.routeChanged(to, from);
            }
        },
        'form.url': function(value) {
            if(!value) {
                this.form.options.strategy = null;
            }
            else {
                this.setStrategy(value);
            }
        },
        step(value) {
            if(value) {
                this.$router.push({
                    name: this.routeName,
                    params: {
                        step: value
                    }
                });
            }
        }
    },

    computed: {
        datepickerOptions() {
            return {
                minDate: new Date,
                defaultHour: 0,
                defaultMinute: 0,
                minuteIncrement: 1,
                enableSeconds: true,
                enableTime: true,
                time_24hr: true
            };
        },
        routeName() {
            return this.$route.params.id ? 'update-poll' : 'create-poll';
        }
    },

    methods: {
        load(id) {
            this.model = null;
            this.loading = true;

            Poll.find(id || this.$route.params.id).then(model => {
                this.model = model;
                this.file = model.get('image');
                this.form = model.toJson();
                this.loading = false;
            });
        },
        defaultFormValue() {
            return {
                answers: ['Yes', 'No'],
                options: {
                    include_embed: 1,
                    strategy: null
                }
            }
        },
        routeChanged(to, from) {
            this.model = new Poll;
            this.form = this.defaultFormValue();

            if(to.params.id && to.params.id !== from.params.id) {
                this.load(to.params.id);
            }
        },
        setStrategy(strategy) {
            strategy = match(strategy);
            
            this.activity = strategy && (!this.form.options.strategy || this.form.options.strategy.url !== strategy.url);
            this.form.options.strategy = strategy;
        },
        onFileChange(file) {
            const model = new Media;

            model.save({
                file: file
            }, {
                onUploadProgress: event => {
                    this.progress = event.loaded / event.total * 100;
                }
            }).then(response => {
                this.progress = null;
                this.form.file = model.get('id');
            }, response => {
                console.log('error', response);
            });
        },
        onAddAnswer(event) {
            if(!this.form.answers) {
                this.$set(this.form, 'answers', []);
            }

            if(event.target.value) {
                this.form.answers.push(event.target.value);
                event.target.value = '';
            }

            if(!event.shiftKey) {
                event.preventDefault();
            }
        },
        onTabAnswer(event, index) {
            if(!event.target.value) {
                this.form.answers.splice(index, 1);

                if(!event.shiftKey && this.form.answers.length) {
                    event.preventDefault();
                    this.$nextTick(() => event.target.select());
                }
            }
        },
        onBlurAnswer(event, index) {
            if(!event.target.value) {
                this.form.answers.splice(index, 1);
            }
        },
        onEnter(slide) {
            this.step = slide.key;
        },
        onBlurUrl(event) {
            this.setStrategy(event.target.value);
        },
        onPasteUrl(event) {
            this.setStrategy(event.clipboardData.getData('text/plain'));
        },
        onSubmit() {
            if(!this.$refs.wizard.$refs.buttons.$refs.next.$el.classList.contains('disabled')) {
                this.$refs.wizard.$refs.buttons.$refs.next.$el.click();
            }
            else if(!this.$refs.wizard.$refs.buttons.$refs.finish.$el.classList.contains('disabled')) {
                this.$refs.wizard.$refs.buttons.$refs.finish.$el.click();
            }
        },
        onClickNew(event) {
            this.model = new Poll;
            this.form = this.defaultFormValue();
            this.$router.push({name: 'create-poll', params: {step: 'title'}});
        },
        onClickFinish(event) {
            this.errors = null;
            this.saving = true;
            this.$refs.wizard.disableBackButton();
            this.model.save(this.form).then(response => {
                this.errors = null;
                this.saving = false;
                this.$refs.wizard.finish();
            }, response => {
                this.errors = response.data;
                this.saving = false;
                this.$refs.wizard.finish(false, this.errors);
            });

            event.preventDefault();
        }
    },


    mounted() {
        if(this.$route.params.id) {
            this.load();
        }
    },

    data() {
        return {
            model: new Poll,
            file: null,
            errors: null,
            saving: false,
            strategy: null,
            activity: false,
            loading: false,
            progress: null,
            form: this.defaultFormValue(),
            step: this.$route.params.step,
            tab: this.$route.params.tab
        }
    }

}
</script>

<style lang="scss">
@import '~bootstrap/scss/_functions.scss';
@import '~bootstrap/scss/_variables.scss';

.poll-wizard {

    .fade-enter-active, .fade-leave-active {
        transition: opacity .333s;
    }

    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
        opacity: 0;
    }

    .poll-preview {
        .form-group {
            margin: 0;

            & + * {
                margin-top: 1rem;
            }
        }

        .form-control,
        .form-control textarea:focus {
            border: 0;
            margin: 0;
            padding: 0;
            resize: none;
            box-shadow: none;
        }
    }

    .dropzone {
        text-align: center;
        padding: 1rem;

        .uploading .file-preview-image {
            opacity: .33333;
        }

        .fa-picture-o {
            display: block;
            margin: 2rem;
            font-size: 5rem;
        }
    }
}
</style>
