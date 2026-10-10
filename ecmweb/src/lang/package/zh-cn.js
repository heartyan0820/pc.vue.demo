var stdin_default = {
  // 菜单国际化
  route: {
    index: "首页",
    document: "项目文档"
  },
  // 登录页面国际化
  login: {
    account: "请输入用户名或手机号",
    password: "请输入密码",
    mobile: "请输入手机号",
    login: "立 即 登 录",
    captchaCode: "验证码",
    capsLock: "大写锁定已打开",
    rememberMe: "记住我",
    forgetPassword: "忘记密码",
    message: {
      account: {
        required: "请输入用户名或手机号"
      },
      password: {
        required: "请输入密码",
        min: "密码不能少于6位"
      },
      captchaCode: {
        required: "请输入验证码"
      },
      mobile: {
        required: "请输入手机号"
      }
    },
    otherLoginMethods: "其他登录方式",
    serviceHotline: "18428162526",
    serviceHot: "02868055607"
  },
  // 导航栏国际化
  navbar: {
    index: "首页",
    logout: "退出登录",
    document: "项目文档",
    gitee: "项目地址",
    profile: "个人中心"
  },
  sizeSelect: {
    tooltip: "布局大小",
    default: "默认",
    large: "大型",
    small: "小型",
    message: {
      success: "切换布局大小成功！"
    }
  },
  langSelect: {
    message: {
      success: "切换语言成功！"
    }
  },
  settings: {
    project: "项目配置",
    theme: "主题设置",
    interface: "界面设置",
    navigation: "导航设置",
    themeColor: "主题颜色",
    tagsView: "开启 Tags-View",
    sidebarLogo: "侧边栏 Logo",
    sidebarColorScheme: "侧边栏配色",
    watermark: "开启水印",
    classicBlue: "经典蓝",
    minimalWhite: "极简白"
  }
};
export {
  stdin_default as default
};
