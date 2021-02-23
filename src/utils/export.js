import request from '@/utils/request';

export function download(url, name) {
  const a = document.createElement('a');
  a.download = name;
  a.href = url;
  a.target = '_blank';
  a.click();
}

export function handleExport({ url, method = 'get', filename, params, data = {}}) {
  return request(url, {
    method,
    params,
    responseType: 'blob',
    data,
    timeout: 120000
  })
    .then(res => {
      const { data: blob, headers } = res;
      const contentType = headers['content-type'];

      if (contentType.includes('application/json')) {
        // 没有返回文件流，通常是因为参数错误，这时候就把错误信息展示出来
        const reader = new FileReader();
        reader.addEventListener('loadend', () => this.$message.error(JSON.parse(reader.result).msg));
        reader.readAsText(blob);
        return null;
      }

      const blobUrl = window.URL.createObjectURL(blob);
      download(blobUrl, filename);
    })
    .catch(console.error);
}
