import request from "@/utils/request";
const ROLE_BASE_URL = "/file";
const FileAPI = {
  /**
   * 上传文件
   *
   * @param formData
   */
  upload(formData) {
    return request({
      url: `${ROLE_BASE_URL}/upload2`,
      method: "post",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data"
      },
      timeout: 3e5
    });
  },
  /**
   * 上传文件
   */
  uploadFile(file) {
    const formData = new FormData();
    formData.append("file", file);
    return request({
      url: "/api/v1/files",
      method: "post",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
  },
  /**
   * 获取文件表单数据
   *
   * @param id ID
   * @returns 文件表单数据
   */
  getFormData(id) {
    return request({
      url: `${ROLE_BASE_URL}/${id}`,
      method: "get"
    });
  },
  /** 获取文件表分页数据 */
  getPage(data) {
    return request({
      url: `${ROLE_BASE_URL}/getfilelist`,
      method: "post",
      data
    });
  },
  /**
   * 更新文件表
   *
   * @param id ID
   * @param data 文件表单数据
   */
  update(id, data) {
    return request({
      url: `${ROLE_BASE_URL}/${id}`,
      method: "put",
      data
    });
  },
  /**
   * 删除文件
   *
   * @param filePath 文件完整路径
   */
  deleteByIds(ids) {
    return request({
      url: `${ROLE_BASE_URL}/${ids}`,
      method: "delete"
    });
  },
  delete(imgurl) {
    return request({
      url: `${ROLE_BASE_URL}/deletefileurl`,
      method: "get",
      params: { imgurl }
    });
  },
  deletes(imgurl) {
    return request({
      url: `${ROLE_BASE_URL}/deletefilename`,
      method: "get",
      params: { imgName: imgurl }
    });
  },
  /**
   * 下载文件
   * @param url
   * @param fileName
   */
  download(url, fileName) {
    return request({
      url,
      method: "get",
      responseType: "blob"
    }).then((res) => {
      const blob = new Blob([res.data]);
      const a = document.createElement("a");
      const url2 = window.URL.createObjectURL(blob);
      a.href = url2;
      a.download = fileName || "下载文件";
      a.click();
      window.URL.revokeObjectURL(url2);
    });
  },
  /**
   * 下载文件
   * @param fileName
   */
  downloads(fileName) {
    return request({
      url: `${ROLE_BASE_URL}/download`,
      method: "get",
      responseType: "blob",
      params: { id: 0, fileName }
    }).then((res) => {
      const blob = new Blob([res.data]);
      const a = document.createElement("a");
      const url = window.URL.createObjectURL(blob);
      a.href = url;
      a.download = fileName || "下载文件";
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
};
var stdin_default = FileAPI;
export {
  stdin_default as default
};
