import request from '@/utils/request';

export function getPostList(params) {
  return request({
    url: '/morningPaper',
    method: 'get',
    params
  });
}

export function sendMsg(params) {
  return request({
    url: '/sendMsg2Weixin',
    method: 'get',
    params
  });
}
