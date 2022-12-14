import { pageOptions, searchOptions, geoOptions, listOptions, eventOptions, fcOptions, randomFormats, pdfOptions, citationFormat } from './optionTypes';
import Page from './page';
import { coordinatesResult, eventResult, featuredContentResult, geoSearchResult, imageResult, langLinksResult, languageResult, mobileSections, relatedResult, title, wikiMediaResult, wikiSearchResult, wikiSummary, notFound, wikiAutocompletionResult } from './resultTypes';
/**
 * The default wiki export
 *
 * @remarks
 * Internally calls wiki.page
 *
 */
declare const wiki: {
    (title: string, pageOptions?: pageOptions | undefined): Promise<Page>;
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
    search(query: string, searchOptions?: searchOptions | undefined): Promise<wikiSearchResult>;
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
    autocomplete(query: string, autocompletionOptions?: searchOptions): Promise<wikiAutocompletionResult>;
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
    page(title: string, pageOptions?: pageOptions | undefined): Promise<Page>;
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
    intro(title: string, pageOptions?: pageOptions | undefined): Promise<string>;
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
    images(title: string, listOptions?: listOptions | undefined): Promise<Array<imageResult>>;
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
    summary(title: string, pageOptions?: pageOptions | undefined): Promise<wikiSummary>;
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
    html(title: string, pageOptions?: pageOptions | undefined): Promise<string>;
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
    content(title: string, pageOptions?: pageOptions | undefined): Promise<string>;
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
    categories(title: string, listOptions?: listOptions | undefined): Promise<Array<string>>;
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
    related(title: string, pageOptions?: pageOptions | undefined): Promise<relatedResult>;
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
    media(title: string, pageOptions?: pageOptions | undefined): Promise<wikiMediaResult>;
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
    links(title: string, listOptions?: listOptions | undefined): Promise<Array<string>>;
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
    references(title: string, listOptions?: listOptions | undefined): Promise<Array<string>>;
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
    coordinates(title: string, pageOptions?: pageOptions | undefined): Promise<coordinatesResult | null>;
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
    langLinks(title: string, listOptions?: listOptions | undefined): Promise<Array<langLinksResult>>;
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
    infobox(title: string, pageOptions?: pageOptions | undefined): Promise<any>;
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
    tables(title: string, pageOptions?: pageOptions | undefined): Promise<Array<any>>;
    /**
     * Returns the languages available in wiki
     *
     * @remarks
     * Use this if you want to check if a lanuage exists before actually setting it
     *
     * @returns The languages an array of {@link languageResult | languageResult}
     */
    languages(): Promise<Array<languageResult>>;
    /**
     * sets the languages to given string - verify your input using languages method
     *
     * @remarks
     * Use this to set your language for future api calls
     *
     * @returns The new api endpoint as string
     */
    setLang(language: string): string;
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
    geoSearch(latitude: number, longitude: number, geoOptions?: geoOptions | undefined): Promise<Array<geoSearchResult>>;
    /**
     * Returns the suggestion for a given query
     *
     * @remarks
     * Use this if you want your user to approve the suggestion before using it
     *
     * @param query - The string to query
     * @returns Returns a string or null based on if suggestion is present or not
     */
    suggest(query: string): Promise<string | null>;
    /**
     * Returns the events for a given day
     *
     * @remarks
     * The api returns the events that happened on a particular month and day
     *
     * @param eventOptions - the event types, and the month and day {@link eventOptions | eventOptions}
     * @returns Returns the results as array of {@link eventResult | eventResult}
     */
    onThisDay(eventOptions?: eventOptions): Promise<eventResult>;
    /**
     * Returns featured content for a given day
     *
     * @remarks
     * The api returns content featured at a particular date
     *
     * @param fcOptions - the year/month/day of featured content by {@link fcOptions | eventOptions}
     * @returns Returns the results as array of {@link fcResult | fcResult}
     */
    featuredContent(fcOptions?: fcOptions): Promise<featuredContentResult>;
    /**
     * Returns a random page
     *
     * @param format - The desired return format
     * @returns Returns content from a random page
     */
    random(format?: randomFormats): Promise<wikiSummary | title | relatedResult | mobileSections | string>;
    /**
     * Returns mobile-optimised HTML of a page
     *
     * @param title - The title of the page to query
     * @param pageOptions - Whether to redirect in case of 302
     * @returns Returns HTML string
     */
    mobileHtml(title: string, pageOptions?: pageOptions | undefined): Promise<notFound | string>;
    /**
     * Returns pdf of a given page
     *
     * @param title - The title of the page to query
     * @param pdfOptions - {@link pdfOptions | pdfOptions }
     * @returns Returns pdf format
     */
    pdf(title: string, pdfOptions?: pdfOptions | undefined): Promise<any>;
    /**
     * Returns citation of a given page, or query string
     *
     * @param format - the format of the citation result
     * @param query - url or query string
     * @param language - if you want lanuage enabled results
     * @returns Returns citation data
     */
    citation(query: string, format?: citationFormat, language?: string): Promise<any>;
};
export default wiki;
export * from './errors';
export * from './resultTypes';
export * from './optionTypes';
export * from './page';
