function mountPrintData(printData, vhtmlDivId = "print") {
  const App = {
    data() {
      return {
        data: printData
      };
    }
  };
  const app = createApp(App);
  app.mount("#" + vhtmlDivId);
}
function clog(flag, value = "Default-value") {
  try {
    let tmp = "";
    if (value === `Default`) {
      tmp = JSON.stringify(flag);
      console.log(tmp);
    } else if (isNull(value)) {
      tmp = JSON.stringify(flag);
      console.log(tmp + ":");
    } else if (isNull(flag)) {
      tmp = JSON.stringify(value);
      console.log(":" + tmp);
    } else {
      tmp = JSON.stringify(value);
      console.log(flag + ":" + tmp);
    }
    return tmp;
  } catch (err) {
    console.log("log", err);
    return " 空对象或者空字符串 ";
  }
}
function isNull(obj) {
  if (typeof obj === "object") {
    let json = JSON.stringify(obj);
    if (json === "{}") {
      return true;
    }
    if (json === "[]") {
      return true;
    }
    return false;
  }
  let str = String(obj);
  if (str === "undefined" || str === "null" || str === "" || !str || !/[^\s]/.test(str)) {
    return true;
  }
  return false;
}
export {
  clog,
  isNull,
  mountPrintData
};
