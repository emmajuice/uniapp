<template>
	<view>
		<cu-custom bgColor="bg-gradual-blue">></block>
		    <block slot="content">水联盟</block>
		</cu-custom>
		<van-tabs swipeable animated sticky='true' :active="activeid" @change="onChange">
		  <van-tab title="地图">
			<view class="tab-item-container map_container">
			  <map class="map" id="map" :longitude="longitude" :latitude="latitude" scale="14" show-location="true" :markers="markers" @markertap="makertap"></map>
			</view>
		  </van-tab>
		  <van-tab title="列表">
			<view class="tab-item-container" v-if="markersData">
			  <view class="map_text" v-for="(item,index) in markersData" :key="index" @tap="handlemarker(item)">
				<p class="name">{{item.name}}</p>
				<p>{{item.address}}</p>
			  </view>
			</view>
		  </van-tab>
		</van-tabs>
	</view>
</template>

<script>
	import amapFile from '../../libs/amap-wx.js'
	import config from '../../libs/config.js'
	export default {
		data() {
			return {
				activeid: 0,
				markers: [],
				latitude: '',
				longitude: '',
				textData: {},
				city: '',
				markersData : []
			}
		},
		onLoad(e) {
			console.log(e);
			var that = this;
			var key = config.Config.key;
			var myAmapFun = new amapFile.AMapWX({key: key});
			var params = {
			  iconPathSelected: '../../static/images/marker_checked.png',
			  iconPath: '../../static/images/marker.png',
			  success: function(data){
			    // console.log("data",data)
			    that.markersData = data.markers;
			    var poisData = data.poisData;
			    var markers_new = [];
			    that.markersData.forEach(function(item,index){
			      markers_new.push({
			          id:item.id,
			          // id: poisData[index].id,
			          latitude: item.latitude,
			          longitude: item.longitude,
			          iconPath: item.iconPath,
			          width: item.width,
			          height: item.height
			        })
			    })
			    if(that.markersData.length > 0){
			      that.markers = markers_new;
			
			      that.city = poisData[0].cityname || '';
			      that.latitude = that.markersData[0].latitude;
			      that.longitude = that.markersData[0].longitude;
			      console.log("====emma====",that.markers)
			      that.showMarkerInfo(that.markersData,0);
			    }else{
			      wx.getLocation({
			        type: 'gcj02',
			        success: function(res) {
			          that.latitude = res.latitude;
			          that.longitude = res.longitude;
			          that.city = '贵阳市';
			        },
			        fail: function(){
			          that.latitude = 26.646769;
			          that.longitude = 106.631049;
			          that.city = '贵阳市';
			        }
			      })
			
			      that.textData ={
			          name: '抱歉，未找到结果',
			          desc: ''
			        };
			    }
			
			  },
			  fail: function(info){
			    wx.showModal({title:info.errMsg})
			  }
			}
			if(e && e.keywords){
			  console.log("params=======",params,e);
			  params.querykeywords = e.keywords;
			}
			myAmapFun.getPoiAround(params)
		},
		methods:{
			onChange(e) {
			  console.log("===a=a==a",e)
			  this.activeid = e.mp.detail.index;
			},
			bindInput(e){
			  var that = this;
			  var url = '../inputtips/main';
			  if(e.target.dataset.latitude && e.target.dataset.longitude && e.target.dataset.city){
			    var dataset = e.target.dataset;
			    url = url + '?lonlat=' + dataset.longitude + ',' + dataset.latitude + '&city=' + dataset.city;
			  }
			  console.log("url00000======",url)
			  mpvue.redirectTo({
			    url: url
			  })
			},
			showMarkerInfo: function(data,i){
			  var that = this;
			  that.textData= {
			      name: data[i].name,
			      desc: data[i].address
			    };
			  console.log("that.textData",data[0])
			  // this.$fly.request({
			  //   method:"get", //post/get 请求方式
			  //   url:"/test/test",
			  //   // data:{
			  //   //   "latitude":data[0].latitude,
			  //   //   "longitude":data[0].longitude
			  //   // },
			  //   body:{
			  //     "latitude":data[0].latitude,
			  //     "longitude":data[0].longitude
			  //   }
			  //   }).then(res =>{
			  //   console.log("r",res)
			  //   }).catch(res=>{
			  //     console.log("55555报错了",res)
			  //   })
			},
			changeMarkerColor: function(data,i){
			  console.log(data,i)
			  var that = this;
			  var markers = [];
			  for(var j = 0; j < data.length; j++){
			    if(j==i){
			      data[j].iconPath = "../../static/images/marker_checked.png";
			    }else{
			      data[j].iconPath = "../../static/images/marker.png";
			    }
			    markers.push({
			      id: data[j].id,
			      latitude: data[j].latitude,
			      longitude: data[j].longitude,
			      iconPath: data[j].iconPath,
			      width: data[j].width,
			      height: data[j].height
			    })
			  }
			  that.markers= markers;
			},
			makertap: function(e) {
			  var id = e.mp.markerId;
			  var that = this;
			  // console.log("maker=====",e)
			  // console.log("markersData=====",this.markersData)
			  that.showMarkerInfo(this.markersData,id);
			  that.changeMarkerColor(this.markersData,id);
			},
			handlemarker(marker){
			  this.activeid = 0;
			  var id = marker.id;
			   var that = this;
			  // console.log("item",marker);
			  // that.activeid = 0;
			  //  console.log("item",that.activeid);
			  that.showMarkerInfo(this.markersData,id);
			  that.changeMarkerColor(this.markersData,id);
			}
			
		}
	
	}
</script>

<style lang="scss" scpoed>
.section{
  height:60px;
  width: 100%;
}
.section input{
  width:90%;
  margin:5px auto;
  border:1px solid #c3c3c3;
  height:30px;
  border-radius: 3px;
  padding: 0 5px;
}
.tab-item-container{
  display: flex;
  flex-direction: column;
  height: 85vh;
}
.map_container{
  // position: absolute;
  margin-top: 10rpx;
  // left: 0;
  // right: 0;
}
.map{
  width: 100%;
  height: 100vh;
}
.map_text{
  // position: absolute;
  // left: 0;
  // right: 0;
  // bottom: 0px;
  margin-top: 10rpx;
  background: #ffffff;
  padding: 0 15px;
  border-bottom: 1px solid #ccc;
  p{
    margin: 5px 0;
    display: block;
    font-size:12px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  .testBtn{
    background: orange;
  }
  .name{
    font-size:28rpx;
    font-weight: 600;
  }
}
</style>
