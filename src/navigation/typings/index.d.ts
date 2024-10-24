export type RootNavigatorParamList = {
  BottomStack: undefined;
  UserStack: undefined;
  Main: undefined;

  // Auth stack
  LoginV2: undefined;
  Intro: undefined;
  Phone: undefined;
  LoginPassword: { phone: string };
  Otp: { phone: string; userId: string; isForget: boolean };
  AuthInfomation: { userId: string; phone: string; otp: string };
  NewPassword: {
    userId: string;
    phone: string;
    otp: string;
    fullName: string;
    referralCode: string;
  };
  CommonWebView: { title: string; url: string };
  Camera: {
    onTakePicture: (item: PhotoFile) => void;
  };

  // Home stack
  HomePageStack: undefined;
  Home: undefined;
  Store: undefined;
  CleanHouse: undefined;
  Bike: undefined;
  RequestServeStack: { screen?: string };
  Schedule: undefined;

  RequestServeStack: undefined;
  ChangePassword: undefined;
  ChooseLocation: undefined;
  ChooseLocationOnMap: {
    location: ItemSearchHistory;
    lat;
    lng;
  };
  ChooseProduct: undefined;
  OrderInformation: { services: serve.Services[] };
  Camera: {
    onTakePicture: (item: PhotoFile) => void;
  };
  Black: undefined;
  FindMaker: {
    total: number;
    reOrder: () => void;
    tripId: string;
    statusOrder?: StatusActivity;
    infoShoeMaker?: serve.InformationShoeMaker;
    paymentMethod: number;
  };
  CancelOrder: {
    tripId?: string;
    params?: any;
    prevScreen?: string;
    onCancelSuccess?: () => void;
  };
  RateOrder: {
    tripId?: string;
    shoemakerId?: string;
    params?: any;
    prevScreen?: string;
    onRateSuccess?: (rate: number) => void;
    infoShoeMaker?: serve.InformationShoeMaker;
  };
  FindMaker: { total: number };
  CancelOrder: undefined;
  Notification: undefined;
  Booking: undefined;
  Activity: undefined;
  ActivityStack: undefined;
  Deposit: { callback?: () => void };
  Withdraw: undefined;

  // Profile stack
  Person: undefined;
  Profile: undefined;
  Wallet: undefined;
  Referral: { profile: any };
  Record: undefined;
  ProfileStack: undefined;
  ChangePassword: undefined;
  Support: undefined;
  Infomation: undefined;
  AccountSetting: undefined;
  Privacy: undefined;
  DetailOrder: { itemDetail: DetailOrder; status: StatusUpdateOrder | string };
};
