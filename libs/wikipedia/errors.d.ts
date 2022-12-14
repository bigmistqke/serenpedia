export declare class wikiError extends Error {
    code?: string;
    constructor(message: string, code?: string);
}
export declare class searchError extends wikiError {
    constructor(message: string);
}
export declare class autocompletionError extends wikiError {
    constructor(message: string);
}
export declare class pageError extends wikiError {
    constructor(message: string);
}
export declare class summaryError extends wikiError {
    constructor(message: string);
}
export declare class imageError extends wikiError {
    constructor(message: string);
}
export declare class htmlError extends wikiError {
    constructor(message: string);
}
export declare class contentError extends wikiError {
    constructor(message: string);
}
export declare class categoriesError extends wikiError {
    constructor(message: string);
}
export declare class linksError extends wikiError {
    constructor(message: string);
}
export declare class geoSearchError extends wikiError {
    constructor(message: string);
}
export declare class coordinatesError extends wikiError {
    constructor(message: string);
}
export declare class infoboxError extends wikiError {
    constructor(message: string);
}
export declare class preloadError extends wikiError {
    constructor(message: string);
}
export declare class introError extends wikiError {
    constructor(message: string);
}
export declare class relatedError extends wikiError {
    constructor(message: string);
}
export declare class mediaError extends wikiError {
    constructor(message: string);
}
export declare class eventsError extends wikiError {
    constructor(message: string);
}
export declare class fcError extends wikiError {
    constructor(message: string);
}
export declare class pdfError extends wikiError {
    constructor(message: string);
}
export declare class citationError extends wikiError {
    constructor(message: string);
}
