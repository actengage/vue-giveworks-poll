<template>

    <div v-if="poll" class="poll-embed" :class="`poll-embed-${align}`">
        <component
            v-if="poll.options.strategy"
            v-bind="poll.options.strategy.embed.props"
            :image="poll.embed ? poll.embed.url : null"
            :is="poll.options.strategy.embed.component"
            @loaded="$emit('loaded')"
        />
    </div>

</template>

<script>
import Twitter from '@/Components/Embeds/Twitter';
import Youtube from '@/Components/Embeds/Youtube';
import Facebook from '@/Components/Embeds/Facebook';

export default {

    name: 'poll-embed',

    components: {
        Twitter,
        Youtube,
        Facebook
    },

    props: {

        align: {
            type: String,
            default: 'center',
            validate(value) {
                return ['left', 'right', 'center'].indexOf(value) !== -1;
            }
        },

        poll: {
            type: Object,
            required: true
        }

    }

}
</script>

<style lang="scss">
.poll-embed {
    width: 100%;
    display: flex;
    align-items: center;

    &.poll-embed-left {
        justify-content: start;
    }

    &.poll-embed-center {
        justify-content: center;
    }

    &.poll-embed-right {
        justify-content: end;
    }
}
</style>
