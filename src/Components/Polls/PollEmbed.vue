<template>

    <div class="poll-embed" :class="`poll-embed-${align}`">
        <component
            v-if="strategy"
            v-bind="strategy.embed.props"
            :image="poll.embed ? poll.embed.url : null"
            :is="strategy.embed.component"
            @loaded="$emit('loaded')"
        />
    </div>

</template>

<script>
import Twitter from '../Embeds/Twitter';
import Youtube from '../Embeds/Youtube';
import Facebook from '../Embeds/Facebook';
import HasStrategy from '../../Mixins/HasStrategy';

export default {

    name: 'PollEmbed',

    mixins: [
        HasStrategy
    ],

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
