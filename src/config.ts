
export interface IConfig {
    name: string
    host: string
    domain: string
    schema: string
    languages: string[]
    facebookPublisher?: string
    facebookId?: string
}

const config: IConfig = {
    name: "ArtOficiu",
    host: "artoficiu.md",
    domain: "artoficiu.md",
    schema: "http:",
    languages: ["ro", "ru"],
    facebookPublisher: "artoficiu.md",
    facebookId: ""
};

export default config;
