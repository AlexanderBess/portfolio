interface ImportMetaEnv {
    /** AI twin backend endpoint; when unset, the client-side mock is used. */
    readonly VITE_AI_TWIN_ENDPOINT?: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

declare module '*.scss' {
    const content: {[className: string]: string};
    export default content;
}

declare module '*.css' {
    const content: {[className: string]: string};
    export default content;
}