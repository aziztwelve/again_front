export interface BlogArticle {
    title: string;
    slug: string;
    date: string;
    banner: string;
    images: {
        src: string;
        alt: string;
    }[];
    text: {
        short: string;
        full: string;
    };
}

export interface BlogQuery {
    getList: () => BlogArticle[];
    getBySlug: (slug: string) => BlogArticle | undefined;
    getRandomItems: () => BlogArticle[];
    getLast: (number?: number) => BlogArticle[];
}