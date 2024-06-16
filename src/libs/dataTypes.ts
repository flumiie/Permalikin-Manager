export type CountryType =
  | {
      name: string;
      code: string;
      continent: string;
      filename?: string;
    }
  | undefined;

export type CityType =
  | {
      name: string;
      country: string;
      admin1: string;
      admin2:string;
      lat: string;
      lng: string;
    }
  | undefined;
