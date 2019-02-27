import Model from 'vue-interface/src/Http/Model';

export default class Poll extends Model {

    /**
     * Define the API endpoint.
     *
     * @return string
     */
    endpoint() {
        return '/api/public/v1/polls';
    }

    /**
     * Define the corresponding uri schema.
     *
     * @return string
     */
    uri() {
        return [
            this.endpoint(),
            this.id()
        ].concat([].slice.call(arguments))
        .join('/')
        .replace(/\/\//, '/');
    }

    /**
     * Save the model to the database
     *
     * @param data object
     * @return bool
     */
    save(data = {}, config = {}) {
        return this.create(data, config);
    }

}
