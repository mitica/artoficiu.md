
export interface IConfig {
    name: string
    host: string
    domain: string
    schema: string
    languages: string[]

    email: string

    facebookPublisher?: string
    facebookId?: string
}

const config: IConfig = {
    name: "ArtOficiu",
    host: "artoficiu.md",
    domain: "artoficiu.md",
    schema: "http:",
    languages: ["ro", "ru"],

    email: 'artoficiu@gmail.com',

    facebookPublisher: "artoficiu.md",
    facebookId: ""
};

export default config;
