"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setAPIUrl = exports.returnRestUrl = exports.makeRestRequest = void 0;
const node_fetch_1 = require("node-fetch");
const errors_1 = require("./errors");
let API_URL = 'https://en.wikipedia.org/w/api.php?', REST_API_URL = 'https://en.wikipedia.org/api/rest_v1/';
// RATE_LIMIT = false,
// RATE_LIMIT_MIN_WAIT = undefined,
// RATE_LIMIT_LAST_CALL = undefined,
const USER_AGENT = 'wikipedia (https://github.com/dopecodez/Wikipedia/)';
// Makes a request to legacy php endpoint
async function makeRequest(params, redirect = true) {
    try {
        const search = { ...params };
        search['format'] = 'json';
        if (redirect) {
            search['redirects'] = '';
        }
        if (!params.action)
            search['action'] = "query";
        search['origin'] = '*';
        const options = {
            headers: {
                'Api-User-Agent': USER_AGENT,
            }
        };
        let searchParam = '';
        Object.keys(search).forEach(key => {
            searchParam += `${key}=${search[key]}&`;
        });
        const response = await (0, node_fetch_1.default)(encodeURI(API_URL + searchParam), options);
        const result = await response.json();
        return result;
    }
    catch (error) {
        throw new errors_1.wikiError(error);
    }
}
// Makes a request to rest api endpoint
async function makeRestRequest(path, redirect = true) {
    try {
        if (!redirect) {
            path += '?redirect=false';
        }
        const options = {
            headers: {
                'Api-User-Agent': USER_AGENT
            }
        };
        const response = await (0, node_fetch_1.default)(encodeURI(REST_API_URL + path), options);
        let result = await response.text();
        try {
            result = JSON.parse(result);
        }
        finally {
            return result;
        }
    }
    catch (error) {
        throw new errors_1.wikiError(error);
    }
}
exports.makeRestRequest = makeRestRequest;
//return rest uri
function returnRestUrl(path) {
    const url = encodeURI(REST_API_URL + path);
    return url;
}
exports.returnRestUrl = returnRestUrl;
//change language of both urls
function setAPIUrl(prefix) {
    API_URL = 'https://' + prefix.toLowerCase() + '.wikipedia.org/w/api.php?';
    REST_API_URL = 'https://' + prefix.toLowerCase() + '.wikipedia.org/api/rest_v1/';
    return API_URL;
}
exports.setAPIUrl = setAPIUrl;
exports.default = makeRequest;
