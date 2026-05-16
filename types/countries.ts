export interface Countries {
    success: boolean,
    countries: Country[]
}

export interface Country {
    id: number,
    name: string,
    code: string
    phone_code: string;    // Новое поле: +7, +1, +374 и т.д.
    phone_length: number;  // Новое поле: количество цифр (10, 9, 8...)
}


export interface Region {
    id: number;
    name: string;
    country_id: number;
}

export interface Regions {
    success: boolean;
    regions: Region[];
}

export interface Cities {
    success: boolean,
    cities: Country[]
}

export interface City {
    id: number,
    name: string,
    region_id: number
}
