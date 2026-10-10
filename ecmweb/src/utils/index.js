function hasClass(ele, cls) {
  return !!ele.className.match(new RegExp("(\\s|^)" + cls + "(\\s|$)"));
}
function addClass(ele, cls) {
  if (!hasClass(ele, cls)) ele.className += " " + cls;
}
function removeClass(ele, cls) {
  if (hasClass(ele, cls)) {
    const reg = new RegExp("(\\s|^)" + cls + "(\\s|$)");
    ele.className = ele.className.replace(reg, " ");
  }
}
function isExternal(path) {
  const isExternal2 = /^(https?:|http?:|mailto:|tel:)/.test(path);
  return isExternal2;
}
function formatGrowthRate(growthRate) {
  if (growthRate === 0) {
    return "-";
  }
  const formattedRate = Math.abs(growthRate * 100).toFixed(2).replace(/\.?0+$/, "");
  return formattedRate + "%";
}
export {
  addClass,
  formatGrowthRate,
  hasClass,
  isExternal,
  removeClass
};
