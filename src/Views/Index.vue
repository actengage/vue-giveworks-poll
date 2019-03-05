<template>
    <div v-if="error">
        <div class="position-absolute d-flex justify-content-center align-items-center w-100 h-100">
            <alert variant="danger" style="min-width: 50%">
                <h3 class="font-weight-light">{{ error.exception }}</h3>
                <p>Line: {{error.line}} {{error.message}}</p>
            </alert>
        </div>
    </div>

    <poll
        v-else
        :id="id"
        max-width="520px"
        api-key="$2y$10$GPHLvsJj4Ad3gxm/eJlvZO2MyrEClWZyjx4hwl5R686Y0.S8QNfbe"
        @toggle-loading="onToggleLoading"
        @error="onError" />
</template>

<script>
import Poll from '@/Components/Polls/Poll';
import Alert from 'vue-interface/src/Components/Alert'

export default {

    name: 'Index',

    components: {
        Poll,
        Alert
    },

    watch: {

        '$route.params.id': function(value) {
            this.error = null;
            this.id = value;
        }

    },

    methods: {

        onToggleLoading(value) {
            this.$emit('toggle-loading', value)
        },

        onError(response) {
            this.error = response.data;
        }

    },

    data() {
        return {
            error: null,
            id: this.$route.params.id
        }
    }

};
</script>