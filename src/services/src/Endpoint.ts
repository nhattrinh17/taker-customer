const Endpoint = {
  Auth: {
    VERIFY_PHONE_NUMBER: '/v2/customers/authentication/verify-phone-number',
    CREATE_ACCOUNT: '/v1/customers/authentication',
    LOGIN: '/v1/customers/authentication/login',
    FORGOT_PASSWORD: '/v1/customers/authentication/forgot-password',
    VERIFY_OTP: '/v1/customers/authentication/verify-otp',
    UPDATE_INFOMATION: '/v1/customers/authentication',
    LOGOUT: '/v1/customers/authentication/logout',
    SEND_SMS: '/v1/customers/authentication/send-sms',
  },
  Profile: {
    PROFILE: '/v1/customers/profile',
    UPDATE_INFOMATION: '/v1/customers/profile',
    REFERRAL: '/v1/customers/profile/referral',
    SIGNED_URL: '/v1/customers/profile/get-signed-url',
    SET_FCM_TOKEN: '/v1/customers/profile/set-fcm-token',
  },
  Search: {
    SHOE_MAKERS: '/v1/customers/search/shoemakers',
    PLACE_DETAIL: '/v1/customers/search/place-detail',
    SEARCH_SUGGESTION: '/v1/customers/search/suggestion',
    SEARCH_NEARBY: '/v1/customers/search/nearby',
  },
  Services: {
    LIST_SERVICE: '/v1/customers/services',
  },
  Activities: {
    IN_PROGRESS: '/v1/customers/activities/in-progress',
    HISTORY: '/v1/customers/activities/histories',
  },
  Trip: {
    CREATE_TRIP: '/v1/customers/trips',
    CANCEL_TRIP: '/v1/customers/trips/cancel',
    RATE_TRIP: '/v1/customers/trips/rate',
    DETAIL: '/v1/customers/trips',
  },
  SEARCH_HISTORY: '/v1/customers/search-histories',
  Wallet: {
    DEPOSITS: '/v1/customers/wallets/deposit',
    WITHDRAW: '/v1/customers/wallets/withdraw',
    HISTORY_TRANSACTIONS: '/v1/customers/wallets/transactions',
    BALANCE: '/v1/customers/wallets/balance',
  },
  Notification: {
    GET_LIST: '/v1/customers/notifications',
  },
}

export default Endpoint
