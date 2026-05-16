
export async function getExternalIdClient(): Promise<string> {

    let externalId = localStorage.getItem("externalId")
    if (!externalId) {
        externalId = generateExternalId()
        localStorage.setItem("externalId", externalId)
    }

    return externalId
}

function generateExternalId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}
