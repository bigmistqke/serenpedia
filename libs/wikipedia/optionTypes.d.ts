export interface searchOptions {
    limit?: number;
    suggestion?: boolean;
}
export interface autocompletionOptions {
    limit?: number;
}
export interface pageOptions {
    autoSuggest?: boolean;
    redirect?: boolean;
    preload?: boolean;
    fields?: Array<pageFunctions>;
}
export interface listOptions {
    autoSuggest?: boolean;
    redirect?: boolean;
    limit?: number;
}
export interface geoOptions {
    limit?: number;
    radius?: number;
}
export declare type pageFunctions = 'summary' | 'images' | 'intro' | 'html' | 'content' | 'categories' | 'links' | 'references' | 'coordinates' | 'langLinks' | 'infobox' | 'tables' | 'related';
export interface eventOptions {
    type?: eventTypes;
    month?: string;
    day?: string;
}
export interface fcOptions {
    year?: string;
    month?: string;
    day?: string;
}
export declare type eventTypes = 'all' | 'selected' | 'births' | 'deaths' | 'events' | 'holidays';
export declare type randomFormats = 'title' | 'summary' | 'related' | 'mobile-sections' | 'mobile-sections-lead';
export declare type format = 'a4' | 'letter' | 'legal';
export declare type pdfType = 'desktop' | 'mobile';
export interface pdfOptions {
    autoSuggest?: boolean;
    format?: format;
    type?: pdfType;
}
export declare type citationFormat = 'mediawiki' | 'mediawiki-basefields' | 'zotero' | 'bibtex' | 'wikibase';
