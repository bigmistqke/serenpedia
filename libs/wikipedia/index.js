"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
const request_1 = require("./request");
const page_1 = require("./page");
const errors_1 = require("./errors");
const messages_1 = require("./messages");
const utils_1 = require("./utils");
/**
 * The default wiki export
 *
 * @remarks
 * Internally calls wiki.page
 *
 */
const wiki = async (title, pageOptions) => {
    return wiki.page(title, pageOptions);
};
/**
 * Returns the search results for a given query
 *
 * @remarks
 * Limits results by default to 10
 *
 * @param query - The string to search for
 * @param searchOptions - The number of results and if suggestion needed {@link searchOptions | searchOptions }
 * @returns an array of {@link wikiSearchResult | wikiSearchResult }
 */
wiki.search = async (query, searchOptions) => {
    try {
        const searchParams = {
            'list': 'search',
            'srprop': '',
            'srlimit': (searchOptions === null || searchOptions === void 0 ? void 0 : searchOptions.limit) || 10,
            'srsearch': query
        };
        (searchOptions === null || searchOptions === void 0 ? void 0 : searchOptions.suggestion) ? searchParams['srinfo'] = 'suggestion' : null;
        const response = await (0, request_1.default)(searchParams);
        const result = {
            results: response.query.search,
            suggestion: response.query.searchinfo ? response.query.searchinfo.suggestion : null
        };
        return result;
    }
    catch (error) {
        throw new errors_1.searchError(error);
    }
};
/**
 * Returns the search results for a given query
 *
 * @remarks
 * Limits results by default to 10
 *
 * @param query - The string to search for
 * @param autocompletionOptions - The number of results and if suggestion needed {@link autocompletionOptions | autocompletionOptions }
 * @returns an array of {@link wikiSearchResult | wikiAutocompletionResult }
 */
wiki.autocomplete = async (query, autocompletionOptions) => {
    try {
        const autocompletionParams = {
            'list': 'search',
            'limit': (autocompletionOptions === null || autocompletionOptions === void 0 ? void 0 : autocompletionOptions.limit) || 10,
            'search': query,
            'action': 'opensearch',
            'redirect': 'return'
        };
        const [_, autocompletions] = await (0, request_1.default)(autocompletionParams, false);
        return autocompletions;
    }
    catch (error) {
        throw new errors_1.autocompletionError(error);
    }
};
/**
 * Returns the page for a given title or string
 *
 * @remarks
 * Call this method to get the basic info for page and also to preload any params you might use in future
 *
 * @param title - The title or page Id of the page
 * @param pageOptions - Whether to redirect, autoSuggest or preload any fields {@link pageOptions | pageOptions }
 * @returns The intro string
 */
wiki.page = async (title, pageOptions) => {
    try {
        if (pageOptions === null || pageOptions === void 0 ? void 0 : pageOptions.autoSuggest) {
            title = await (0, utils_1.setTitleForPage)(title);
        }
        let pageParams = {
            prop: 'info|pageprops',
            inprop: 'url',
            ppprop: 'disambiguation',
        };
        pageParams = (0, utils_1.setPageIdOrTitleParam)(pageParams, title);
        const response = await (0, request_1.default)(pageParams);
        let pageInfo = response.query.pages;
        const pageId = (0, utils_1.setPageId)(pageParams, response);
        pageInfo = pageInfo[pageId];
        if (pageInfo.missing == '') {
            throw new errors_1.pageError(`${messages_1.MSGS.PAGE_NOT_EXIST}${title}`);
        }
        const page = new page_1.default(pageInfo);
        if (pageOptions === null || pageOptions === void 0 ? void 0 : pageOptions.preload) {
            if (!(pageOptions === null || pageOptions === void 0 ? void 0 : pageOptions.fields)) {
                pageOptions.fields = ['summary', 'images'];
            }
            for (const field of pageOptions.fields) {
                await page.runMethod(field);
            }
        }
        return page;
    }
    catch (error) {
        throw new errors_1.pageError(error);
    }
};
/**
 * Returns the intro present in a wiki page
 *
 * @remarks
 * Called in page object and also through wiki default object
 *
 * @param title - The title or page Id of the page
 * @param pageOptions - Whether to redirect in case of 302
 * @returns The intro string
 */
wiki.intro = async (title, pageOptions) => {
    try {
        if (pageOptions === null || pageOptions === void 0 ? void 0 : pageOptions.autoSuggest) {
            title = await (0, utils_1.setTitleForPage)(title);
        }
        const result = await (0, page_1.intro)(title, pageOptions === null || pageOptions === void 0 ? void 0 : pageOptions.redirect);
        return result;
    }
    catch (error) {
        throw new errors_1.introError(error);
    }
};
/**
 * Returns the images present in a wiki page
 *
 * @remarks
 * Called in page object and also through wiki default object
 *
 * @param title - The title or page Id of the page
 * @param listOptions - {@link listOptions | listOptions }
 * @returns an array of imageResult {@link imageResult | imageResult }
 */
wiki.images = async (title, listOptions) => {
    try {
        if (listOptions === null || listOptions === void 0 ? void 0 : listOptions.autoSuggest) {
            title = await (0, utils_1.setTitleForPage)(title);
        }
        const result = await (0, page_1.images)(title, listOptions);
        return result;
    }
    catch (error) {
        throw new errors_1.imageError(error);
    }
};
/**
 * Returns the summary of the page
 *
 * @remarks
 * Called in page object and also through wiki default object
 *
 * @param title - The title or page Id of the page
 * @param pageOptions - Whether to redirect in case of 302
 * @returns The summary of the page as {@link wikiSummary | wikiSummary}
 */
wiki.summary = async (title, pageOptions) => {
    try {
        if (pageOptions === null || pageOptions === void 0 ? void 0 : pageOptions.autoSuggest) {
            title = await (0, utils_1.setTitleForPage)(title);
        }
        const result = await (0, page_1.summary)(title, pageOptions === null || pageOptions === void 0 ? void 0 : pageOptions.redirect);
        return result;
    }
    catch (error) {
        throw new errors_1.summaryError(error);
    }
};
/**
 * Returns the html content of a page
 *
 * @remarks
 * Called in page object and also through wiki default object
 *
 * @param title - The title or page Id of the page
 * @param pageOptions - Whether to redirect in case of 302
 * @returns The html content as string
 *
 * @beta
 */
wiki.html = async (title, pageOptions) => {
    try {
        if (pageOptions === null || pageOptions === void 0 ? void 0 : pageOptions.autoSuggest) {
            title = await (0, utils_1.setTitleForPage)(title);
        }
        const result = await (0, page_1.html)(title, pageOptions === null || pageOptions === void 0 ? void 0 : pageOptions.redirect);
        return result;
    }
    catch (error) {
        throw new errors_1.htmlError(error);
    }
};
/**
 * Returns the plain text content of a page
 *
 * @remarks
 * Called in page object and also through wiki default object
 *
 * @param title - The title or page Id of the page
 * @param pageOptions - Whether to redirect in case of 302
 * @returns The plain text as string and the parent and revision ids
 */
wiki.content = async (title, pageOptions) => {
    try {
        if (pageOptions === null || pageOptions === void 0 ? void 0 : pageOptions.autoSuggest) {
            title = await (0, utils_1.setTitleForPage)(title);
        }
        const response = await (0, page_1.content)(title, pageOptions === null || pageOptions === void 0 ? void 0 : pageOptions.redirect);
        return response.result;
    }
    catch (error) {
        throw new errors_1.contentError(error);
    }
};
/**
 * Returns the cetegories present in page
 *
 * @remarks
 * Called in page object and also through wiki default object
 *
 * @param title - The title or page Id of the page
 * @param listOptions - {@link listOptions | listOptions }
 * @returns The categories as an array of string
 */
wiki.categories = async (title, listOptions) => {
    try {
        if (listOptions === null || listOptions === void 0 ? void 0 : listOptions.autoSuggest) {
            title = await (0, utils_1.setTitleForPage)(title);
        }
        const response = await (0, page_1.categories)(title, listOptions);
        return response;
    }
    catch (error) {
        throw new errors_1.categoriesError(error);
    }
};
/**
 * Returns summaries for 20 pages related to the given page. Summaries include page title, namespace
 * and id along with short text description of the page and a thumbnail.
 *
 * @remarks
 * Called in page object and also through index
 *
 * @param title - The title or page Id of the page
 * @param pageOptions - Whether to redirect in case of 302
 * @returns The related pages and summary as an array of {@link wikiSummary | wikiSummary}
 *
 * @experimental
 */
wiki.related = async (title, pageOptions) => {
    try {
        if (pageOptions === null || pageOptions === void 0 ? void 0 : pageOptions.autoSuggest) {
            title = await (0, utils_1.setTitleForPage)(title);
        }
        const response = await (0, page_1.related)(title, pageOptions === null || pageOptions === void 0 ? void 0 : pageOptions.redirect);
        return response;
    }
    catch (error) {
        throw new errors_1.relatedError(error);
    }
};
/**
 * Gets the list of media items (images, audio, and video) in the
 * order in which they appear on a given wiki page.
 *
 * @remarks
 * Called in page object and also through index
 *
 * @param title - The title or page Id of the page
 * @param redirect - Whether to redirect in case of 302
 * @returns The related pages and summary as an array of {@link wikiMediaResult | wikiMediaResult}
 *
 * @experimental
 */
wiki.media = async (title, pageOptions) => {
    try {
        if (pageOptions === null || pageOptions === void 0 ? void 0 : pageOptions.autoSuggest) {
            title = await (0, utils_1.setTitleForPage)(title);
        }
        const response = await (0, page_1.media)(title, pageOptions === null || pageOptions === void 0 ? void 0 : pageOptions.redirect);
        return response;
    }
    catch (error) {
        throw new errors_1.mediaError(error);
    }
};
/**
 * Returns the links present in page
 *
 * @remarks
 * Called in page object and also through wiki default object
 *
 * @param title - The title or page Id of the page
 * @param listOptions - {@link listOptions | listOptions }
 * @returns The links as an array of string
 */
wiki.links = async (title, listOptions) => {
    try {
        if (listOptions === null || listOptions === void 0 ? void 0 : listOptions.autoSuggest) {
            title = await (0, utils_1.setTitleForPage)(title);
        }
        const response = await (0, page_1.links)(title, listOptions);
        return response;
    }
    catch (error) {
        throw new errors_1.linksError(error);
    }
};
/**
 * Returns the references of external links present in page
 *
 * @remarks
 * Called in page object and also through wiki default object
 *
 * @param title - The title or page Id of the page
 * @param listOptions - {@link listOptions | listOptions }
 * @returns The references as an array of string
 */
wiki.references = async (title, listOptions) => {
    try {
        if (listOptions === null || listOptions === void 0 ? void 0 : listOptions.autoSuggest) {
            title = await (0, utils_1.setTitleForPage)(title);
        }
        const response = await (0, page_1.references)(title, listOptions);
        return response;
    }
    catch (error) {
        throw new errors_1.linksError(error);
    }
};
/**
 * Returns the coordinates of a page
 *
 * @remarks
 * Called in page object and also through wiki default object
 *
 * @param title - The title or page Id of the page
 * @param pageOptions - Whether to redirect in case of 302
 * @returns The coordinates as {@link coordinatesResult | coordinatesResult}
 */
wiki.coordinates = async (title, pageOptions) => {
    try {
        if (pageOptions === null || pageOptions === void 0 ? void 0 : pageOptions.autoSuggest) {
            title = await (0, utils_1.setTitleForPage)(title);
        }
        const response = await (0, page_1.coordinates)(title, pageOptions === null || pageOptions === void 0 ? void 0 : pageOptions.redirect);
        return response;
    }
    catch (error) {
        throw new errors_1.coordinatesError(error);
    }
};
/**
 * Returns the language links present in the page
 *
 * @remarks
 * Called in page object and also through wiki default object
 *
 * @param title - The title or page Id of the page
 * @param listOptions - {@link listOptions | listOptions }
 * @returns The links as an array of {@link langLinksResult | langLinksResult }
 */
wiki.langLinks = async (title, listOptions) => {
    try {
        if (listOptions === null || listOptions === void 0 ? void 0 : listOptions.autoSuggest) {
            title = await (0, utils_1.setTitleForPage)(title);
        }
        const response = await (0, page_1.langLinks)(title, listOptions);
        return response;
    }
    catch (error) {
        throw new errors_1.linksError(error);
    }
};
/**
 * Returns the infobox content of page if present
 *
 * @remarks
 * Called in page object and also through wiki default object
 *
 * @param title - The title or page Id of the page
 * @param pageOptions - Whether to redirect in case of 302
 * @returns The info as JSON object
 */
wiki.infobox = async (title, pageOptions) => {
    try {
        if (pageOptions === null || pageOptions === void 0 ? void 0 : pageOptions.autoSuggest) {
            title = await (0, utils_1.setTitleForPage)(title);
        }
        const response = await (0, page_1.infobox)(title, pageOptions === null || pageOptions === void 0 ? void 0 : pageOptions.redirect);
        return response;
    }
    catch (error) {
        throw new errors_1.infoboxError(error);
    }
};
/**
 * Returns the table content of page if present
 *
 * @remarks
 * Called in page object and also through wiki default object
 *
 * @param title - The title or page Id of the page
 * @param pageOptions - Whether to redirect in case of 302
 * @returns The tables as arrays of JSON objects
 */
wiki.tables = async (title, pageOptions) => {
    try {
        if (pageOptions === null || pageOptions === void 0 ? void 0 : pageOptions.autoSuggest) {
            title = await (0, utils_1.setTitleForPage)(title);
        }
        const response = await (0, page_1.tables)(title, pageOptions === null || pageOptions === void 0 ? void 0 : pageOptions.redirect);
        return response;
    }
    catch (error) {
        throw new errors_1.infoboxError(error);
    }
};
/**
 * Returns the languages available in wiki
 *
 * @remarks
 * Use this if you want to check if a lanuage exists before actually setting it
 *
 * @returns The languages an array of {@link languageResult | languageResult}
 */
wiki.languages = async () => {
    try {
        const langParams = {
            'meta': 'siteinfo',
            'siprop': 'languages'
        };
        const response = await (0, request_1.default)(langParams);
        const languages = [];
        for (const lang of response.query.languages) {
            languages.push({ [lang.code]: lang['*'] });
        }
        return languages;
    }
    catch (error) {
        throw new errors_1.wikiError(error);
    }
};
/**
 * sets the languages to given string - verify your input using languages method
 *
 * @remarks
 * Use this to set your language for future api calls
 *
 * @returns The new api endpoint as string
 */
wiki.setLang = (language) => {
    const apiUrl = (0, request_1.setAPIUrl)(language);
    return apiUrl;
};
/**
 * Returns the pages with coordinates near the geo search coordinates
 *
 * @remarks
 * Latitude and longitude should be valid values
 *
 * @param latitude - The latitude to search
 * @param longitude - The longitude to search
 * @param geoOptions - The number of results and the search radius {@link geoOptions | geoOptions}
 * @returns The results as an array of {@link geoSearchResult | geoSearchResult}
 */
wiki.geoSearch = async (latitude, longitude, geoOptions) => {
    try {
        const geoSearchParams = {
            'list': 'geosearch',
            'gsradius': (geoOptions === null || geoOptions === void 0 ? void 0 : geoOptions.radius) || 1000,
            'gscoord': `${latitude}|${longitude}`,
            'gslimit': (geoOptions === null || geoOptions === void 0 ? void 0 : geoOptions.limit) || 10,
            'gsprop': 'type'
        };
        const results = await (0, request_1.default)(geoSearchParams);
        const searchPages = results.query.geosearch;
        return searchPages;
    }
    catch (error) {
        throw new errors_1.geoSearchError(error);
    }
};
/**
 * Returns the suggestion for a given query
 *
 * @remarks
 * Use this if you want your user to approve the suggestion before using it
 *
 * @param query - The string to query
 * @returns Returns a string or null based on if suggestion is present or not
 */
wiki.suggest = async (query) => {
    var _a, _b, _c, _d;
    try {
        const suggestParams = {
            'list': 'search',
            'srinfo': 'suggestion',
            'srprop': '',
            'srsearch': query
        };
        const result = await (0, request_1.default)(suggestParams);
        return ((_b = (_a = result.query) === null || _a === void 0 ? void 0 : _a.searchinfo) === null || _b === void 0 ? void 0 : _b.suggestion) ? (_d = (_c = result.query) === null || _c === void 0 ? void 0 : _c.searchinfo) === null || _d === void 0 ? void 0 : _d.suggestion : null;
    }
    catch (error) {
        throw new errors_1.searchError(error);
    }
};
/**
 * Returns the events for a given day
 *
 * @remarks
 * The api returns the events that happened on a particular month and day
 *
 * @param eventOptions - the event types, and the month and day {@link eventOptions | eventOptions}
 * @returns Returns the results as array of {@link eventResult | eventResult}
 */
wiki.onThisDay = async (eventOptions = {}) => {
    try {
        const type = eventOptions.type || 'all';
        const mm = (eventOptions.month || (0, utils_1.getCurrentMonth)()).toString().padStart(2, "0");
        const dd = (eventOptions.day || (0, utils_1.getCurrentDay)()).toString().padStart(2, "0");
        const path = `feed/onthisday/${type}/${mm}/${dd}`;
        const result = await (0, request_1.makeRestRequest)(path, true);
        return result;
    }
    catch (error) {
        throw new errors_1.eventsError(error);
    }
};
/**
 * Returns featured content for a given day
 *
 * @remarks
 * The api returns content featured at a particular date
 *
 * @param fcOptions - the year/month/day of featured content by {@link fcOptions | eventOptions}
 * @returns Returns the results as array of {@link fcResult | fcResult}
 */
wiki.featuredContent = async (fcOptions = {}) => {
    try {
        const yyyy = (fcOptions.year || (0, utils_1.getCurrentYear)()).toString();
        const mm = (fcOptions.month || (0, utils_1.getCurrentMonth)()).toString().padStart(2, "0");
        const dd = (fcOptions.day || (0, utils_1.getCurrentDay)()).toString().padStart(2, "0");
        const path = `feed/featured/${yyyy}/${mm}/${dd}`;
        const result = await (0, request_1.makeRestRequest)(path, true);
        return result;
    }
    catch (error) {
        throw new errors_1.fcError(error);
    }
};
/**
 * Returns a random page
 *
 * @param format - The desired return format
 * @returns Returns content from a random page
 */
wiki.random = async (format) => {
    try {
        if (!format) {
            format = 'summary';
        }
        const path = `page/random/${format}`;
        const result = await (0, request_1.makeRestRequest)(path);
        return result;
    }
    catch (error) {
        throw new errors_1.wikiError(error);
    }
};
/**
 * Returns mobile-optimised HTML of a page
 *
 * @param title - The title of the page to query
 * @param pageOptions - Whether to redirect in case of 302
 * @returns Returns HTML string
 */
wiki.mobileHtml = async (title, pageOptions) => {
    try {
        if (pageOptions === null || pageOptions === void 0 ? void 0 : pageOptions.autoSuggest) {
            title = await (0, utils_1.setTitleForPage)(title);
        }
        const result = await (0, page_1.mobileHtml)(title, pageOptions === null || pageOptions === void 0 ? void 0 : pageOptions.redirect);
        return result;
    }
    catch (error) {
        throw new errors_1.htmlError(error);
    }
};
/**
 * Returns pdf of a given page
 *
 * @param title - The title of the page to query
 * @param pdfOptions - {@link pdfOptions | pdfOptions }
 * @returns Returns pdf format
 */
wiki.pdf = async (title, pdfOptions) => {
    try {
        if (pdfOptions === null || pdfOptions === void 0 ? void 0 : pdfOptions.autoSuggest) {
            title = await (0, utils_1.setTitleForPage)(title);
        }
        const result = await (0, page_1.pdf)(title, pdfOptions);
        return result;
    }
    catch (error) {
        throw new errors_1.pdfError(error);
    }
};
/**
 * Returns citation of a given page, or query string
 *
 * @param format - the format of the citation result
 * @param query - url or query string
 * @param language - if you want lanuage enabled results
 * @returns Returns citation data
 */
wiki.citation = async (query, format, language) => {
    try {
        const result = await (0, page_1.citation)(query, format, language);
        return result;
    }
    catch (error) {
        throw new errors_1.citationError(error);
    }
};
exports.default = wiki;
// For CommonJS default export support
module.exports = wiki;
module.exports.default = wiki;
__exportStar(require("./errors"), exports);
__exportStar(require("./resultTypes"), exports);
__exportStar(require("./optionTypes"), exports);
__exportStar(require("./page"), exports);
