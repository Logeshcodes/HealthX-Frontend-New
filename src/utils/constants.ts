import { config } from 'dotenv';

config()

export const MESSAGE_SERVICE_DOMAIN =
  process.env.NEXT_PUBLIC_MESSAGE_SERVICE_DOMAIN ||
  "https://socialconnect.site";

  export const USER_SERVICE_DOMAIN =
  process.env.NEXT_PUBLIC_USER_SERVICE_DOMAIN || "https://socialconnect.site";

  export const NOTIFICATION_SERVICE_DOMAIN =
  process.env.NEXT_PUBLIC_NOTIFICATION_SERVICE_DOMAIN ||
  "https://socialconnect.site";





export const SOCKET_URI = MESSAGE_SERVICE_DOMAIN;
export const USER_SOCKET_URI = USER_SERVICE_DOMAIN;
export const NOTIFICATION_SOCKET_URI = NOTIFICATION_SERVICE_DOMAIN;