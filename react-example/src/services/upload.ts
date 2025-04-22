import { api, http } from ".";

export async function uploadFile(file: File) {
  try {
    // 1. 获取预签名 URL
    const presignedUrlResponse = await api
      .getUploadUrl({
        filename: file.name,
        contentType: file.type,
        expiry: 300,
      })
      .then((res) => {
        return res.data.data;
      });

    // 2. 构建表单数据
    const formData = new FormData();

    // 添加 MinIO 需要的表单字段
    for (const [key, value] of Object.entries(presignedUrlResponse.formData)) {
      formData.append(key, value);
    }

    // 添加文件
    formData.append("file", file);

    // 3. 直接上传到 MinIO
    await http.request({
      path: presignedUrlResponse.url,
      method: "POST",
      body: formData,
    });

    return await api.updateUserInfo({
      avatar_url: `${presignedUrlResponse.url}/${presignedUrlResponse.key}`,
    });

    // return completeResponse; // 返回附件信息
  } catch (error) {
    console.error("文件上传失败:", error);
    throw error;
  }
}
