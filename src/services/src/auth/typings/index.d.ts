declare namespace auth {
  interface Error {
    type: string;
    code: string;
  }

  interface ParamsVerifyPhoneNumber {
    phone: string;
  }
  interface ResponseVerifyPhoneNumber {
    data: {
      isExisted: boolean;
      fullName: string;
      isVerified: boolean;
    };
    type: string;
  }

  interface ParamsCreateAccount {
    phone: string;
    password: string;
    fullName: string;
    address: string;
    referralCode: string;
  }
  interface ResponeCreateAccount {
    type: string;
    data: {
      userId: string;
    };
  }

  interface ParamsLogin {
    phone: string;
    password: string;
  }
  interface ResponeLogin {
    type: string;
    data: {
      token: string;
      user: any;
    };
  }

  interface ParamsForgotPassword {
    phone: string;
  }
  interface ResponeForgotPassword {
    type: string;
    data: {
      userId: string;
    };
  }

  interface ParamsVerifyOTP {
    userId: string;
    otp: string;
  }
  interface ResponseVerifyOTP {
    data: boolean;
    type: string;
  }

  interface ParamsUpdate {
    userId: string;
    password: string;
    otp: string;
    fullName?: string;
    email?: string;
    referralCode?: string;
  }
  interface ResponseUpdate {
    data: boolean;
    type: string;
  }

  interface ResponseLogout {
    data: boolean;
    type: string;
  }
}
