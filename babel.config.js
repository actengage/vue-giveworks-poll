module.exports = {
    presets: [
        ['@vue/app', {
            targets: {
                node: "current"
            }
        }]
    ],
    plugins: [
        "lodash"
    ],
    ignore: [
        "node_modules",
    ]
}
