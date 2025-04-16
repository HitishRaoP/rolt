export type OwnerType = "Bot" | "User" | "Organization"

export type Provider = "Github"

export type Installation = {
    id: Number
    owner: string
    installationId: Number
    ownerType: OwnerType
    provider: Provider
}