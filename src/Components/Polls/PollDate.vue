<template>

   <div class="poll-date mt-2 pt-1 mb-3 pb-1">
       {{ poll.published_at | date('MMMM D, YYYY') }}
    </div>

</template>

<script>
export default {

    name: 'PollDate',

    props: {

        poll: {
            type: Object,
            required: true
        }

    }

}
</script>

<style lang="scss">
@import '@/assets/scss/_variables.scss';
@import '@/assets/scss/_mixins.scss';

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
</style>