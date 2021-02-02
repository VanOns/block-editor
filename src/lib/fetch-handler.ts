import apiFetch from '@wordpress/api-fetch'
import axios from 'axios'

export default class FetchHandler {
    requests

    constructor() {
        this.requests = {
            getEmbed: {
                method: 'GET',
                regex: /\/oembed\/1\.0\/proxy\?(.*)/g,
                run: this.getEmbed
            },
            getThemes: {
                method: 'GET',
                regex: /\/wp\/v2\/themes/g,
                run: this.getThemes
            },
        }

        this.fetch = this.fetch.bind(this)
        this.match = this.match.bind(this)
    }

    static register() {
        const fetchHandler = new FetchHandler()

        apiFetch.setFetchHandler(fetchHandler.fetch)
    }

    fetch(options) {
        const result = this.match(options)
        return result.then(res => {
            return res
        })
    }

    match(options) {
        let promise

        Object.keys(this.requests).forEach((key) => {
            const request = this.requests[key]
            // Reset lastIndex so regex starts matching from the first character
            request.regex.lastIndex = 0
            const matches = request.regex.exec(options.path)

            if (options.headers && options.headers['X-HTTP-Method-Override']) options.method = options.headers['X-HTTP-Method-Override']

            if ((options.method === request.method || (!options.method && request.method === 'GET')) && matches && matches.length > 0) {
                promise =  request.run(options, matches)
            }
        })

        if (promise) return promise

        return new Promise((resolve, reject) => {
            reject({
                code: 'api_handler_not_found',
                message: 'API handler not found.',
                data: {
                    path: options.path,
                    options: options,
                    status: 404
                }
            })
        })
    }

    async getEmbed(options, matches) {
        const params = Object.fromEntries(new URLSearchParams(matches[1]))

        return axios.get(`/nova-vendor/block-editor/oembed?url=${params.url}`).then(res => res.data)
    }

    async getThemes() {
        return [{
            theme_supports: {
                formats: [
                    'standard',
                    'aside',
                    'image',
                    'video',
                    'quote',
                    'link',
                    'gallery',
                    'audio'
                ],
                'post-thumbnails': true,
                'responsive-embeds': true
            }
        }]
    }
}
