<template>

   <div class="poll-question">
       <div class="poll-content" v-if="poll.html" v-html="poll.html" />

        <img v-if="poll.embed" class="poll-img img-fluid mb-5" :src="poll.embed.url">

        <transition v-else-if="poll.options.include_embed" name="fade" mode="out-in">
            <poll-embed :key="poll.id" :poll="poll" class="mb-5" />
        </transition>


        <div class="d-flex mb-5">
            <btn-group
                v-responsive-blocks="{selector: 'span'}"
                toggle
                :vertical="vertical"
                :style="{'grid-template-columns': `repeat(${poll.answers.length}, minmax(${100 / poll.answers.length}%, 1fr)`}"
                class="mx-auto"
                @resize.native="onResize">
                <btn
                    v-for="answer in poll.answers"
                    :key="answer"
                    :active="answer === value"
                    size="lg"
                    type="button"
                    variant="primary"
                    outline
                    @click="onClickAnswer(answer)">
                    <span v-html="answer" />
                </btn>
            </btn-group>
        </div>
    
        <!--
        <a href="#" class="d-flex justify-content-center">
            <div class="mr-2">
                <icon :icon="['fab', 'facebook']" />
            </div>
            <div class="mr-2">
                <icon :icon="['fab', 'twitter']" />
            </div>
            <div class="mr-2">
                <icon icon="envelope" />
            </div>
            <div>
                <icon icon="share" /> Share this poll
            </div>
        </a>
        -->

    </div>

</template>

<script>
import Btn from 'vue-interface/src/Components/Btn';
import PollEmbed from '@/Components/Polls/PollEmbed';
import BtnGroup from 'vue-interface/src/Components/BtnGroup';
import ResponsiveBlocks from '@/Directives/ResponsiveBlocks';

import { library } from '@fortawesome/fontawesome-svg-core';
import { faShare } from '@fortawesome/free-solid-svg-icons/faShare';
import { faTwitter } from '@fortawesome/free-brands-svg-icons/faTwitter';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons/faEnvelope';
import { faFacebook } from '@fortawesome/free-brands-svg-icons/faFacebook';

library.add(faShare);
library.add(faTwitter);
library.add(faEnvelope);
library.add(faFacebook);

export default {

    name: 'PollQuestion',

    components: {
        Btn,
        BtnGroup,
        PollEmbed
    },

    directives: {
        ResponsiveBlocks
    },

    props: {

        value: [String, Number],

        poll: {
            type: Object,
            required: true
        }

    },

    watch: {

        answer(value) {
            this.$emit('input', value);
        }

    },

    methods: {

        onClickAnswer(answer) {
            this.answer = answer;
        },

        onResize(event) {
            this.vertical = (
                event.doesTextOverflow ||
                event.doesHaveLineBreaks ||
                event.doesCalculatedWidthExceedContainer
            );
        }

    },

    data() {
        return {
            answer: null,
            vertical: false
        }
    }

}
</script>

<style lang="scss">
@import '@/assets/scss/_variables.scss';
@import '@/assets/scss/_mixins.scss';

.poll-question {
    @include body-font;

    .poll-content {
        font-size: 18px;
    }
}
</style>