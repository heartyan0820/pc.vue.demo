const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const MESS_KEY = "mess_info";
const ORDER_QUERY_KEY = "order_query_Params";
const User_KEY = "rememberedUser";
const ActiveIndex_KEY = "mess_activeIndex";
const WPFOrder_KEY = "wpf_orderInfo";
const PcPatientName_KEY = "pc_patientName";
const COLOR_KEY = "color_info";
function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY) || "";
}
function setAccessToken(token) {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
}
function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY) || "";
}
function setRefreshToken(token) {
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
}
function clearToken() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}
function setMessData(data) {
  localStorage.setItem(MESS_KEY, data);
}
function getMessData() {
  return localStorage.getItem(MESS_KEY) || "";
}
function setQueryParamsData(data) {
  localStorage.setItem(ORDER_QUERY_KEY, data);
}
function getQueryParamsData() {
  return localStorage.getItem(ORDER_QUERY_KEY) || "";
}
function clearQueryParamsData() {
  localStorage.removeItem(ORDER_QUERY_KEY);
}
function setRememberedUser(data) {
  localStorage.setItem(User_KEY, data);
}
function getRememberedUser() {
  return localStorage.getItem(User_KEY) || "";
}
function clearRememberedUser() {
  localStorage.removeItem(User_KEY);
}
function setActiveIndex(data) {
  localStorage.setItem(ActiveIndex_KEY, data);
}
function getActiveIndex() {
  return localStorage.getItem(ActiveIndex_KEY) || 0;
}
function setWpfOrder(data) {
  localStorage.setItem(WPFOrder_KEY, data);
}
function getWpfOrder() {
  return localStorage.getItem(WPFOrder_KEY) || "";
}
function clearWpfOrder() {
  localStorage.removeItem(WPFOrder_KEY);
}
function setPcPatientName(data) {
  localStorage.setItem(PcPatientName_KEY, data);
}
function getPcPatientName() {
  return localStorage.getItem(PcPatientName_KEY) || "";
}
function clearPcPatientName() {
  localStorage.removeItem(PcPatientName_KEY);
}
function setXdColor(data) {
  localStorage.setItem(COLOR_KEY, data);
}
function getXdColor() {
  return localStorage.getItem(COLOR_KEY) || "";
}
function clearXdColor() {
  localStorage.removeItem(COLOR_KEY);
}
export {
  clearPcPatientName,
  clearQueryParamsData,
  clearRememberedUser,
  clearToken,
  clearWpfOrder,
  clearXdColor,
  getAccessToken,
  getActiveIndex,
  getMessData,
  getPcPatientName,
  getQueryParamsData,
  getRefreshToken,
  getRememberedUser,
  getWpfOrder,
  getXdColor,
  setAccessToken,
  setActiveIndex,
  setMessData,
  setPcPatientName,
  setQueryParamsData,
  setRefreshToken,
  setRememberedUser,
  setWpfOrder,
  setXdColor
};
