import Fly from 'flyio/dist/npm/wx'
const fly = new Fly()
// const host = "http://localhost:3000"
// const host = "http://192.168.0.103:8889"
let token = wx.getStorageSync('token')
//添加请求拦截器
fly.interceptors.request.use((request) => {
  wx.showLoading({
    title: "加载中",
    mask:true
  });
  console.log(request);
  request.headers = {
    "X-Tag": "flyio",
    'content-type': 'application/json',
    'Authorization': token
  };

  let authParams = {
    //公共参数
    // "categoryType": "SaleGoodsType@sim",
    // "streamNo": "wxapp153570682909641893",
    // "reqSource": "MALL_H5",
    // "appid": "122334566677",
	"author":"simba",
    "timestamp": new Date().getTime(),
    // "sign": "string"
  };

  request.body && Object.keys(request.body).forEach((val) => {
    if(request.body[val] === ""){
      delete request.body[val]
    };
  });
  request.body = {
    ...request.body,
    ...authParams 
  }
  return request;
});

//添加响应拦截器
fly.interceptors.response.use(
  (response) => {
    wx.hideLoading();
    return response.data;//请求成功之后将返回值返回
  },
  (err) => {
    //请求出错，根据返回状态码判断出错原因
    wx.hideLoading();
    if(err){
      return "请求失败";
    };
  }
);

// fly.config.baseURL = host;

export default fly;