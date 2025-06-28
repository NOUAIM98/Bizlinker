// config.js

const LOCAL_URL = 'http://192.168.253.1:8000'; // replace with your actual IP
const LIVE_URL = 'https://getbizlinker.site';

export const BASE_URL = __DEV__ ? LOCAL_URL : LIVE_URL;
