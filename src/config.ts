
export interface IConfig {
    name: string
    host: string
    domain: string
    schema: string
    languages: string[]

    email: string
    telephones: string[],

    facebookPublisher?: string
    facebookId?: string

    googleAnalyticsId: string
    countItemsPerPromotedCategory: number

    TVA: number
}

const config: IConfig = {
    name: "ArtOficiu",
    host: "artoficiu.click.md",
    domain: "artoficiu.md",
    schema: "http:",
    languages: ["ro", "ru"],

    email: 'artoficiu@gmail.com',
    telephones: ['069 224 224', '022 224 224'],

    facebookPublisher: "artoficiu.md",
    facebookId: "",

    googleAnalyticsId: 'UA-55418815-1',

    TVA: 6,
    countItemsPerPromotedCategory: 4,
};

export default config;
