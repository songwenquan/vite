/*
* @Author: wqsong2
* @Date: 2025/2/25 18:59
* @Desciption:
*/
import HttpClient from '@/utils/http-client';
import { config } from '@/configs/index';
const http1$ = new HttpClient(config.baseUrl);
export default {
  // 菜单列表
  menuList(data:any){
    return http1$.request({
      url: 'system/menu/list',
      method: 'get',
    });
  }
};
