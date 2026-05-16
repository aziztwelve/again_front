export interface User {
    id: string;
    email: string;
    profile: Profile
}

export interface Profile {
    first_name?: string,
    last_name?: string,
    email: string,
    phone?: string
}