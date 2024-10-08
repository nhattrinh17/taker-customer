import {Service} from 'services/src/typings'

export function formatCurrency(amount: number): string {
  // Convert number to string and split it into integer and decimal parts
  const parts = amount?.toFixed(0).split('.')

  const integerPart = parts?.[0]?.replace(/\B(?=(\d{3})+(?!\d))/g, '.')

  // Combine integer and decimal parts and add the Vietnamese currency symbol
  const formattedAmount = `${integerPart}`

  return formattedAmount
}

export const totalPrice = (products: serve.Services[] | Service[]) => {
  return products
    ?.filter(item => item?.quantity > 0)
    .reduce((total, item) => total + item?.price * item?.quantity, 0)
}

export const totalSalePrice = (products: serve.Services[]) => {
  return products
    ?.filter(item => item?.quantity > 0 && item?.discountPrice)
    .reduce(
      (total, item) =>
        total + (item?.price - (item?.discountPrice ?? 0)) * item?.quantity,
      0,
    )
}

export const totalPricePayment = (products: serve.Services[]) => {
  return products
    ?.filter(item => item?.quantity > 0)
    .reduce(
      (total, item) =>
        total + (item?.discountPrice ?? item?.price) * item?.quantity,
      0,
    )
}

export const convertDayToVN = (day: string) => {
  switch (day) {
    case 'monday':
      return 'T2'
    case 'tuesday':
      return 'T3'
    case 'wednesday':
      return 'T4'
    case 'thursday':
      return 'T5'
    case 'friday':
      return 'T6'
    case 'saturday':
      return 'T7'
    case 'sunday':
      return 'CN'
  }
}
