<template>
	<view>
		<view class="tab-item-container map_container">
		  <map class="map" id="map" :longitude="longitude" :latitude="latitude" scale="14" show-location="true" :markers="markers" @markertap="makertap" @tap="handlecilck"></map>
		</view>
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
			handlecilck(){
			  console.log("i am here")
			  this.activeid = 1;
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
			  this.$fly.request({
			    method:"get", //post/get 请求方式
			    url:"/test/test",
			    // data:{
			    //   "latitude":data[0].latitude,
			    //   "longitude":data[0].longitude
			    // },
			    body:{
			      "latitude":data[0].latitude,
			      "longitude":data[0].longitude
			    }
			    }).then(res =>{
			    console.log("r",res)
			    }).catch(res=>{
			      console.log("55555报错了",res)
			    })
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

<style lang="scss">

</style>
