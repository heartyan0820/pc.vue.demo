/**
 * H5 唤起抖音工具类
 * 兼容 iOS / Android，自动识别微信/QQ/企微等受限环境
 * 用法：DouyinOpener.openVideo('视频ID')  /  DouyinOpener.openUser('用户ID')
 * 注意：必须在用户点击事件的同步回调中调用，不可在异步请求/await之后直接调用
 */
(function (global) {
  "use strict";

  // ============ 配置 ============
  var DOUYIN_SCHEME = "snssdk1128://";
  var DOUYIN_WEB_BASE = "https://www.douyin.com/";
  var DOUYIN_DOWNLOAD = "https://www.douyin.com/downloadpage/";
  var DEFAULT_TIMEOUT = 2800; // 唤起判定超时，毫秒

  // ============ UA 环境识别 ============
  var ua = navigator.userAgent.toLowerCase();

  function isIOS() {
    return /iphone|ipad|ipod|mac os/i.test(ua) && !/android/i.test(ua);
  }

  function isAndroid() {
    return /android/i.test(ua);
  }

  function isWeChat() {
    return /micromessenger/i.test(ua);
  }

  function isQQ() {
    return /qq\//i.test(ua) || /qqbrowser/i.test(ua);
  }

  function isWorkWeChat() {
    return /wxwork/i.test(ua);
  }

  function isDingTalk() {
    return /dingtalk/i.test(ua);
  }

  function isRestrictedEnv() {
    // 这几个环境会拦截 scheme 跳转，需要先引导用户到浏览器
    return isWeChat() || isQQ() || isWorkWeChat();
  }

  // ============ 微信/QQ 引导蒙层 ============
  var maskInstance = null;

  function showGuideMask() {
    if (maskInstance) return;
    var div = document.createElement("div");
    div.id = "douyin-opener-mask";
    div.innerHTML =
      '<div class="douyin-mask-inner">' +
      '<div class="douyin-mask-arrow"></div>' +
      '<div class="douyin-mask-tip">' +
      "<p><strong>请点击右上角</strong></p>" +
      "<p>选择「在浏览器中打开」</p>" +
      "<p>即可跳转到抖音</p>" +
      "</div>" +
      '<div class="douyin-mask-close">知道了</div>' +
      "</div>";
    document.body.appendChild(div);

    // 注入样式（只注入一次）
    if (!document.getElementById("douyin-opener-style")) {
      var style = document.createElement("style");
      style.id = "douyin-opener-style";
      style.textContent =
        "#douyin-opener-mask{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.82);z-index:999999;" +
        "display:flex;flex-direction:column;align-items:flex-start;justify-content:flex-start;color:#fff;" +
        'font-family:-apple-system,BlinkMacSystemFont,"PingFang SC","Helvetica Neue",sans-serif;-webkit-tap-highlight-color:transparent;}' +
        "#douyin-opener-mask .douyin-mask-inner{position:relative;width:100%;padding:28px 32px;box-sizing:border-box;}" +
        "#douyin-opener-mask .douyin-mask-arrow{position:absolute;top:10px;right:28px;width:64px;height:64px;" +
        "background:radial-gradient(circle at 80% 20%, transparent 28px, #fff 30px) top right/100% 100%;}" +
        '#douyin-opener-mask .douyin-mask-arrow::after{content:"";position:absolute;top:62px;right:4px;width:0;height:0;' +
        "border-left:8px solid transparent;border-right:8px solid transparent;border-top:14px solid #fff;}" +
        "#douyin-opener-mask .douyin-mask-tip{margin-top:80px;text-align:right;font-size:17px;line-height:1.8;}" +
        "#douyin-opener-mask .douyin-mask-tip p{margin:4px 0;}" +
        "#douyin-opener-mask .douyin-mask-close{margin-top:60px;align-self:center;padding:10px 48px;border:1px solid #fff;" +
        "border-radius:24px;font-size:15px;cursor:pointer;}";
      document.head.appendChild(style);
    }

    div.addEventListener("click", hideGuideMask);
    div.addEventListener(
      "touchmove",
      function (e) {
        e.preventDefault();
      },
      { passive: false },
    );
    maskInstance = div;
  }

  function hideGuideMask() {
    if (maskInstance && maskInstance.parentNode) {
      maskInstance.parentNode.removeChild(maskInstance);
    }
    maskInstance = null;
  }

  // ============ 核心唤起逻辑 ============

  /**
   * 通用唤起
   * @param {string} schemeUrl   - 抖音内部 scheme 链接
   * @param {string} webUrl      - 失败兜底的网页链接（抖音网页版/视频页）
   * @param {object} [options]   - 配置项
   * @param {boolean} [options.forceWeb=false] - 是否强制跳网页版（不尝试唤起App）
   */
  function open(schemeUrl, webUrl, options) {
    options = options || {};
    webUrl = webUrl || DOUYIN_WEB_BASE;

    // 1. 受限环境（微信/QQ/企微）→ 弹出引导蒙层
    if (isRestrictedEnv() && !options.forceWeb) {
      showGuideMask();
      return;
    }

    // 2. 强制走网页
    if (options.forceWeb) {
      window.location.href = webUrl;
      return;
    }

    var timer = null;
    var startTime = Date.now();
    var jumped = false;

    // 页面被隐藏 / 失去焦点 → 说明 App 成功唤起，清掉降级定时器
    function onVisibilityChange() {
      if (document.hidden || document.webkitHidden) {
        clearTimeout(timer);
        cleanup();
        jumped = true;
      }
    }

    function onPageHide() {
      clearTimeout(timer);
      cleanup();
      jumped = true;
    }

    function cleanup() {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      document.removeEventListener(
        "webkitvisibilitychange",
        onVisibilityChange,
      );
      window.removeEventListener("pagehide", onPageHide);
    }

    document.addEventListener("visibilitychange", onVisibilityChange);
    document.addEventListener("webkitvisibilitychange", onVisibilityChange);
    window.addEventListener("pagehide", onPageHide);

    // 3. 超时降级：未唤起成功 → 跳网页版兜底
    timer = setTimeout(function () {
      cleanup();
      var elapsed = Date.now() - startTime;
      // 如果页面没被切走，说明唤起失败，走降级
      if (
        !document.hidden &&
        !document.webkitHidden &&
        elapsed >= DEFAULT_TIMEOUT - 100
      ) {
        window.location.href = webUrl || DOUYIN_DOWNLOAD;
      }
    }, DEFAULT_TIMEOUT);

    // 4. 执行跳转：iOS 直接 location；Android 优先 intent:// 语法带降级
    if (isAndroid()) {
      // Android intent 写法：未安装自动跳到 fallback url（网页版）
      var intentScheme = buildAndroidIntent(schemeUrl, webUrl);
      window.location.href = intentScheme;
    } else {
      // iOS：直接使用 scheme
      window.location.href = schemeUrl;
    }
  }

  /**
   * 构造 Android Intent 链接
   * 格式参考：intent://...#Intent;scheme=xxx;package=com.douyin.tiktok;S.browser_fallback_url=xxx;end
   */
  function buildAndroidIntent(schemeUrl, fallbackUrl) {
    // snssdk1128://aweme/detail/xxx → 取路径部分
    var schemeBody = schemeUrl.replace(/^snssdk1128:\/\//, "");
    var intent =
      "intent://" +
      schemeBody +
      "#Intent;scheme=snssdk1128;" +
      "package=com.ss.android.ugc.aweme;" +
      "S.browser_fallback_url=" +
      encodeURIComponent(fallbackUrl) +
      ";" +
      "end";
    return intent;
  }

  // ============ 快捷方法 ============

  /**
   * 打开抖音用户主页
   * @param {string} userId - 抖音号/sec_uid/用户数字ID
   * @param {object} [options]
   */
  function openUser(userId, options) {
    var scheme = DOUYIN_SCHEME + "user/profile/" + userId;
    var web = DOUYIN_WEB_BASE + "user/" + userId;
    open(scheme, web, options);
  }

  /**
   * 打开抖音指定视频
   * @param {string} videoId - 视频ID（通常是长链 douyin.com/video/ 后的数字串）
   * @param {object} [options]
   */
  function openVideo(videoId, options) {
    var scheme = DOUYIN_SCHEME + "aweme/detail/" + videoId;
    var web = DOUYIN_WEB_BASE + "video/" + videoId;
    open(scheme, web, options);
  }

  /**
   * 打开抖音直播间
   * @param {string} roomId - 直播间ID
   * @param {string} [enterFrom] - 来源标记（可选）
   * @param {object} [options]
   */
  function openLive(roomId, enterFrom, options) {
    if (typeof enterFrom === "object") {
      options = enterFrom;
      enterFrom = "h5";
    }
    enterFrom = enterFrom || "h5";
    var scheme =
      DOUYIN_SCHEME + "live?room_id=" + roomId + "&enter_from=" + enterFrom;
    var web = DOUYIN_WEB_BASE + "live/" + roomId;
    open(scheme, web, options);
  }

  /**
   * 自定义 scheme 唤起（高级用法）
   * @param {string} path - scheme 路径部分，例如 'aweme/detail/123'
   * @param {string} [fallbackUrl] - 失败兜底链接
   * @param {object} [options]
   */
  function openCustom(path, fallbackUrl, options) {
    var scheme = DOUYIN_SCHEME + path.replace(/^\//, "");
    open(scheme, fallbackUrl || DOUYIN_WEB_BASE, options);
  }

  /**
   * 手动关闭引导蒙层
   */
  function closeGuide() {
    hideGuideMask();
  }

  // ============ 暴露 API ============
  global.DouyinOpener = {
    open: open,
    openUser: openUser,
    openVideo: openVideo,
    openLive: openLive,
    openCustom: openCustom,
    closeGuide: closeGuide,
    // 环境判断工具，供外部逻辑使用
    env: {
      isIOS: isIOS,
      isAndroid: isAndroid,
      isWeChat: isWeChat,
      isQQ: isQQ,
      isWorkWeChat: isWorkWeChat,
      isDingTalk: isDingTalk,
      isRestricted: isRestrictedEnv,
    },
  };
})(window);
