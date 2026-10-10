function isMobile() {
  if (typeof window === "undefined" || !window.navigator || !window.innerWidth) {
    return false;
  }
  const userAgent = window.navigator.userAgent.toLowerCase();
  const mobileKeywords = [
    "android",
    "iphone",
    "ipod",
    "ipad",
    "windows phone",
    "blackberry",
    "webos",
    "symbian",
    "ucbrowser",
    "mobile",
    "mini",
    "micromessenger",
    "wechat",
    "huawei",
    "mi",
    "oppo",
    "vivo"
  ];
  return mobileKeywords.some((key) => userAgent.includes(key));
}
function isWeChatPC() {
  const ua = navigator.userAgent.toLowerCase();
  return /micromessenger/.test(ua) && (/windows/.test(ua) || /macintosh/.test(ua));
}
function isMobileOnly() {
  if (typeof window === "undefined" || !window.navigator) {
    return false;
  }
  const userAgent = window.navigator.userAgent.toLowerCase();
  const mobileOnlyKeywords = [
    "android",
    "iphone",
    "ipod",
    "windows phone",
    "blackberry",
    "webos",
    "symbian",
    "ucbrowser",
    "mobile",
    "mini"
  ];
  return mobileOnlyKeywords.some((key) => userAgent.includes(key));
}
export {
  isMobile,
  isMobileOnly,
  isWeChatPC
};
