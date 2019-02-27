<script>
export default {

    props: {

        apiKey: {
            type: String,
            required: true
        }

    },

    computed: {

        httpRequestOptions() {
            return {
                headers: {
                    Authorization: `Bearer ${this.apiKey}`
                }
            };
        }

    }
}
</script>
