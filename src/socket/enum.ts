export enum SocketEvents {
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  CONNECTION_ERROR = 'connect_error',
  CONNECTION_TIMEOUT = 'connect_timeout',
  RECONNECT = 'reconnect',
  RECONNECT_ATTEMPT = 'reconnect_attempt',
  RECONNECTING = 'reconnecting',
  RECONNECT_ERROR = 'reconnect_error',
  RECONNECT_FAILED = 'reconnect_failed',
  RECONNECT_ABORTED = 'reconnect_aborted',
  FIND_CLOSET_SHOE_MAKERS = 'find-closest-shoemakers',
  NOT_FOUND = 'not-found', //find-closest-shoemaker
  UPDATE_LOCATION = 'update-location',
  TRIP_STATUS = 'trip-status',
  PAYMENT_STATUS = 'payment-status',
}
