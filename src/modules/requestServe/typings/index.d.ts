declare namespace serve {
  interface RecentLocationUsed {
    title: string;
    address: string;
  }

  interface ResultSearch {
    geometry: {
      location: {
        lat: number;
        lng: number;
      };
      location_type: string;
      viewport: {
        northeast: {lat: number; lng: number};
        southwest: {lat: number; lng: number};
      };
    };
    icon: string;
    icon_background_color: string;
    icon_mask_base_uri: string;
    name: string;
    opening_hours: {open_now: boolean};
    place_id: string;
    plus_code: {compound_code: string; global_code: string};
    price_level: number;
    rating: number;
    reference: string;
    scope: string;
    types: string[];
    user_ratings_total: number;
    vicinity: string;
    formatted_address: string;
  }

  interface CurrentLocation {
    name?: string;
    formatted_address: string;
    place_id: string;
    geometry: {
      location: {
        lat: number;
        lng: number;
      };
      location_type: string;
      viewport: {
        northeast: {lat: number; lng: number};
        southwest: {lat: number; lng: number};
      };
    };
  }

  interface ItemProduct {
    serviceId: string;
    price: number;
    discountPrice: number;
    name: string;
  }

  interface Services {
    name?: string;
    serviceId: string;
    quantity: number;
    price: number;
    discountPrice: number;
  }

  interface ImageProducts {
    name: string;
    url: string;
  }

  interface ItemPayment {
    name: string;
    id: number;
    key: string;
  }

  interface ResponseInformationShoeMaker {
    data: InformationShoeMaker;
    type: string;
  }
  interface InformationShoeMaker {
    avatar: string;
    fullName: string;
    phone: string;
    time: number;
    id?: string;
    longitude: number;
    lat: number;
    lng: number;
    latitude: number;
    distance: number;
  }
}
