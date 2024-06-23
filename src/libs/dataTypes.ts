export type MasterDataType = {
  avatar?: string;
  memberCode: string;
  fullName: string;
  birthPlaceDate: string;
  religion?: string;
  address: {
    identityCardAddress: string;
    currentAddress: string;
    country: string;
    province: string;
    city: string;
    zipCode: string;
  };
  phoneNo: string;
  email?: string;
  status?: string;
  balance: {
    initial: string;
    end: string;
  };
};

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
      admin2: string;
      lat: string;
      lng: string;
    }
  | undefined;

export type MemberDuesType = {
  date: string;
  due: string;
  paid: string;
  remaining: string;
};

export type MemberDonationsType = {
  date: string;
  amount: string;
};

export type MemberInterestsType = {
  date: string;
  amount: string;
};
