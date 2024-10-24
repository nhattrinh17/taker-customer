import { StatusActivity } from 'modules/activity/typings';
import Toast from 'react-native-toast-message';

export const showMessageError = (desc: string) => {
  Toast.show({
    type: 'error',
    text1: '',
    text2: desc,
  });
};

export const showMessageWarning = (desc: string) => {
  Toast.show({
    type: 'info',
    text1: '',
    text2: desc,
  });
};

export const showMessageSuccess = (desc: string) => {
  Toast.show({
    type: 'success',
    text1: '',
    text2: desc,
  });
};

export const renderStatusActivity = (status: string) => {
  switch (status) {
    case StatusActivity.SEARCHING:
    case StatusActivity.MEETING:
      return 'Đang đặt';
    case StatusActivity.ACCEPTED:
      return 'Đã nhận đơn';
    case StatusActivity.INPROGRESS:
      return 'Đang thực hiện';
    case StatusActivity.CUSTOMER_CANCEL:
      return 'Đã huỷ';
    case StatusActivity.NOT_FOUND:
      return 'Không tìm thấy thợ đánh giày';
    case StatusActivity.COMPLETED:
      return 'Đã hoàn thành';
    default:
      return '';
  }
};

export function formatCurrency(amount: number): string {
  // Convert number to string and split it into integer and decimal parts
  const parts = amount?.toFixed(0).split('.');

  const integerPart = parts?.[0]?.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  // Combine integer and decimal parts and add the Vietnamese currency symbol
  const formattedAmount = `${integerPart}`;

  return formattedAmount;
}

export const renderTypePayment = (paymentMethod: string) => {
  switch (paymentMethod) {
    case 'DIGITAL_WALLET':
      return 'Ví Taker';
    case 'OFFLINE_PAYMENT':
      return 'Tiền mặt';
    case 'CREDIT_CARD':
      return 'Qr Code/Thẻ Visa/Master/Nội địa';
    default:
      return 'Tiền mặt';
  }
};

// export const renderColorStatusOrder = (status: StatusUpdateOrder) => {
//   switch (status) {
//     case StatusUpdateOrder.ACCEPTED:
//     case StatusUpdateOrder.MEETING:
//     case StatusUpdateOrder.COMPLETED:
//     case StatusUpdateOrder.INPROGRESS:
//       return Colors.main
//     case StatusUpdateOrder.CANCEL:
//     case StatusUpdateOrder.CUSTOMER_CANCEL:
//       return Colors.red
//     default:
//       return Colors.textPrimary
//   }
// }

export const payments: serve.ItemPayment[] = [
  {
    name: 'Ví Taker',
    id: 3,
    key: 'DIGITAL_WALLET',
  },
  {
    name: 'Qr Code/Thẻ Visa/Master/Nội địa',
    id: 2,
    key: 'CREDIT_CARD',
  },

  {
    name: 'Tiền mặt',
    id: 4,
    key: 'OFFLINE_PAYMENT',
  },
];

export const NOTIFICATIONS_SCREEN = {
  REQUEST_TRIP: 'REQUEST_TRIP',
  HOME: 'HOME',
  CUSTOMER_CARE: 'CUSTOMER_CARE',
  WALLET: 'WALLET',
  DETAIL_NOTIFICATION: 'DETAIL_NOTIFICATION',
};
