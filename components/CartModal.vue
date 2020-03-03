<template>
	<view>
		<cu-custom bgColor="bg-gradual-blue" :isBack="true">
		    <!-- <block slot="backText">返回</block> -->
		    <block slot="content">导航栏</block>
		</cu-custom>
		<view class="commodity_screen" @click="hideModal" v-if="showModalStatus"></view>
		<view :animation="animationData" class="commodity_attr_box" v-if="showModalStatus">{{cart}}</view>
	</view>
</template>

<script>
	export default {
		props:[
			'cart'
		],
		data() {
			return {
				showModalStatus:false,
			};
		},
		onLoad(){
			console.log("111111111111")
			uni.$emit('page-popup', {  
			    title: '我是title',  
			    content: '我是content'  
			});
			this.showModal();
			
		},
		methods:{
			clickme(){
			   this.showModal();
			   console.log("222222222222222")
			},
			showModal() {
			    // 显示遮罩层
			    var animation = wx.createAnimation({
			      duration: 200,
			      timingFunction: "linear",
			      delay: 0
			    })
			    this.animation = animation
			    animation.translateY(300).step()
			    this.animationData = animation.export()
			    this.showModalStatus = true
			    setTimeout(function () {
			      animation.translateY(0).step()
			      this.animationData = animation.export()
			    }.bind(this), 200)
			},
			  
			hideModal(){
				// this.showModalStatus = true;
				var animation = wx.createAnimation({
				  duration: 200,
				  timingFunction: "linear",
				  delay: 0
				})
				this.animation = animation
				animation.translateY(300).step()
				this.animationData = animation.export()
				setTimeout(function () {
				  animation.translateY(0).step()
				  this.animationData = animation.export()
				  this.showModalStatus = false
				}.bind(this), 200)
			}
		}
	}
</script>

<style lang="scss">
.commodity_screen {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background: #000;
  opacity: 0.2;
  overflow: hidden;
  z-index: 1000;
  color: #fff;
}
/*对话框 */
.commodity_attr_box {
  height: 300rpx;
  width: 100%;
  overflow: hidden;
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 2000;
  background: #fff;
  padding-top: 20rpx;
}
</style>
