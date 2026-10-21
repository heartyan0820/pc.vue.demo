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

  var DOUYIN_PACKAGE = "com.ss.android.ugc.aweme";
  // 抖音极速版：包名与 scheme 都和抖音不同
  //   package = com.ss.android.ugc.aweme.lite（小米应用商店可查）
  //   scheme  = snssdk2329://（不是 snssdk1128，写错就只能走兜底网页）
  // 真机上若仍唤起失败，可用 config() 覆盖这两个值再测
  var DOUYIN_LITE_PACKAGE = "com.ss.android.ugc.aweme.lite";
  var DOUYIN_LITE_SCHEME = "snssdk2329://";

  // ============ 调试钩子 ============
  // 外部可挂 DouyinOpener.onDebug = function(msg){} 观察唤起全过程
  function debug(msg) {
    try {
      if (
        global.DouyinOpener &&
        typeof global.DouyinOpener.onDebug === "function"
      ) {
        global.DouyinOpener.onDebug(msg);
      }
    } catch (e) {}
  }

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

    debug("开始唤起，兜底网页 = " + webUrl);

    // 1. 受限环境（微信/QQ/企微）→ 弹出引导蒙层
    if (isRestrictedEnv() && !options.forceWeb) {
      debug("命中受限环境（微信/QQ/企微）→ 只弹引导蒙层，未发起跳转");
      showGuideMask();
      return;
    }

    // 2. 强制走网页
    if (options.forceWeb) {
      debug("强制网页版 → " + webUrl);
      window.location.href = webUrl;
      return;
    }

    var timer = null;
    var startTime = Date.now();
    var jumped = false;

    // 页面被隐藏 / 失去焦点 → 说明 App 成功唤起，清掉降级定时器
    function onVisibilityChange() {
      if (document.hidden || document.webkitHidden) {
        debug("页面被切到后台 → 判定为已唤起，取消降级（若此时 App 没打开，就是这个判断误判）");
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
        debug("超时（" + elapsed + "ms）仍未唤起 → 降级到 " + (webUrl || DOUYIN_DOWNLOAD));
        window.location.href = webUrl || DOUYIN_DOWNLOAD;
      } else {
        debug("超时但页面在后台 → 认为已唤起，不做降级");
      }
    }, DEFAULT_TIMEOUT);

    // 4. 执行跳转：iOS 直接 location；Android 优先 intent:// 语法带降级
    var isLite = options.app === "lite";
    var pkg = isLite ? DOUYIN_LITE_PACKAGE : DOUYIN_PACKAGE;
    var finalScheme = schemeUrl;
    if (
      isLite &&
      DOUYIN_LITE_SCHEME !== DOUYIN_SCHEME &&
      finalScheme.indexOf(DOUYIN_SCHEME) === 0
    ) {
      finalScheme = DOUYIN_LITE_SCHEME + finalScheme.slice(DOUYIN_SCHEME.length);
    }
    debug("目标 App = " + (isLite ? "抖音极速版" : "抖音") + "（package = " + pkg + "）");

    var targetUrl = isAndroid()
      ? buildAndroidIntent(finalScheme, webUrl, pkg)
      : finalScheme;
    debug((isAndroid() ? "Android 走 intent → " : "iOS 走 scheme → ") + targetUrl);

    // 连续唤起多条时，用隐藏 iframe 在「同一次点击」里一起发出：
    // 定时器里发的第 2 条起可能被浏览器当成非用户手势而丢弃
    if (options.trigger === "iframe") {
      debug("触发方式 = 隐藏 iframe（同一次点击内并发发出）");
      var frame = document.createElement("iframe");
      frame.style.display = "none";
      frame.src = targetUrl;
      document.body.appendChild(frame);
      setTimeout(function () {
        if (frame.parentNode) frame.parentNode.removeChild(frame);
      }, 1500);
    } else {
      window.location.href = targetUrl;
    }
  }

  /**
   * 覆盖极速版的包名 / scheme（真机唤起失败时用 URL 参数快速试，无需改代码）
   * @param {{litePackage?: string, liteScheme?: string}} opts
   */
  function config(opts) {
    opts = opts || {};
    if (opts.litePackage) DOUYIN_LITE_PACKAGE = opts.litePackage;
    if (opts.liteScheme) DOUYIN_LITE_SCHEME = opts.liteScheme;
    debug(
      "配置更新：极速版 package = " +
        DOUYIN_LITE_PACKAGE +
        "，scheme = " +
        DOUYIN_LITE_SCHEME,
    );
  }

  /**
   * 构造 Android Intent 链接
   * 格式参考：intent://...#Intent;scheme=xxx;package=com.douyin.tiktok;S.browser_fallback_url=xxx;end
   */
  function buildAndroidIntent(schemeUrl, fallbackUrl, packageName) {
    // snssdk1128://aweme/detail/xxx → 取 scheme 名与路径部分
    // 极速版是 snssdk2329://，所以 scheme 名也要跟着变，写死 snssdk1128 会导致唤不起
    var matched = schemeUrl.match(/^([a-zA-Z][a-zA-Z0-9+.\-]*):\/\/([\s\S]*)$/);
    var schemeName = matched ? matched[1] : "snssdk1128";
    var schemeBody = matched ? matched[2] : schemeUrl;
    var intent =
      "intent://" +
      schemeBody +
      "#Intent;scheme=" + schemeName + ";" +
      "package=" + (packageName || DOUYIN_PACKAGE) + ";" +
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
   * 按列表连续播放多条视频（一条 intent 带整个列表）
   *
   * 这是抖音**未公开**的入口，靠它才能做到「打开抖音后连着刷一串指定视频」：
   *
   *   snssdk1128://aweme/push_detail?item_id=<首条>&hot=feed&cold=feed&gids=<ID1,ID2,...>
   *   极速版 snssdk2329:// 同上
   *
   * 三个要点（缺一个就退回「孤立单视频、不能上滑」）：
   *   1. 路径是 aweme/push_detail，不是 aweme/detail
   *   2. gids 一次带上整个列表（英文逗号分隔），item_id 是其中要开始播的那条
   *   3. hot=feed&cold=feed 让客户端按 feed 形态呈现，才可上下滑
   *
   * 注意：官方未公开，顺序是否生效取决于客户端版本；失效时请退回 openVideo() 逐条打开。
   *
   * @param {string[]} videoIds - 视频ID列表（按播放顺序，目标视频放最后）
   * @param {object} [options]
   */
  function openPlaylist(videoIds, options) {
    var ids = (videoIds || [])
      .map(function (id) {
        return String(id == null ? "" : id).trim();
      })
      .filter(function (id) {
        return /^\d{8,}$/.test(id);
      });

    if (!ids.length) {
      debug("openPlaylist：没有有效视频ID，已忽略");
      return;
    }

    var scheme =
      DOUYIN_SCHEME +
      "aweme/push_detail?item_id=" +
      ids[0] +
      "&hot=feed&cold=feed&gids=" +
      ids.join(",");
    // 兜底网页落到最后一条（目标视频）
    var web = DOUYIN_WEB_BASE + "video/" + ids[ids.length - 1];
    debug(
      "列表播放：共 " +
        ids.length +
        " 条（末条为目标视频），一条 intent 带整个 gids 列表",
    );
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
   * 打开抖音首页推荐流
   *
   * 【已真机验证的结论】抖音「首页feed」= snssdk1128://feed，只接受 refer / gd_label。
   * 试过在后面挂 aweme_id=<作品ID>，客户端**直接忽略**——实测结果是进推荐流，
   * 但显示的是算法推荐的内容，不是指定那条视频（Android + Chrome 135 / 小米浏览器）。
   * 也就是说：「推荐流 + 指定视频」这个组合抖音不开放，二者只能二选一：
   *   - 要定位到具体作品 → 用 openVideo()（snssdk1128://aweme/detail/<id>）
   *   - 要进推荐流       → 用本方法（不指定视频）
   *
   * @param {string} [videoId] - 保留参数位仅为兼容旧调用，实际会被忽略（见上）
   * @param {object} [options]
   */
  function openHome(videoId, options) {
    // 允许 openHome({ forceWeb: true }) 这种省略 videoId 的调法
    if (videoId && typeof videoId === "object") {
      options = videoId;
      videoId = "";
    }
    if (videoId) {
      debug(
        "推荐流不接受作品ID（实测 aweme_id 被忽略），已忽略传入的 videoId；要定位到 " +
          videoId +
          " 请改用 openVideo()",
      );
    }
    open(DOUYIN_SCHEME + "feed?refer=web", DOUYIN_WEB_BASE, options);
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
    openPlaylist: openPlaylist,
    openLive: openLive,
    openHome: openHome,
    config: config,
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
