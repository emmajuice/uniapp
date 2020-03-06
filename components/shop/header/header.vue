<template>
	<view class="header">
		<view class="header-bg">
			<image src="https://cdn.nlark.com/yuque/0/2019/png/280374/1552996358352-assets/web-upload/cc3b1807-c684-4b83-8f80-80e5b8a6b975.png" mode=""></image>
		</view>
		<view :class="showStoreBox ? 'header-bg-gray' : 'header-bg-black'"></view>
		<view class="header-top-Placeholder" ></view>
		<view class="container storeInfo hx-shadow" :style="{height:storeInfoBoxHeight + 'px'}">
			<image class="storeAvatar hx-shadow" :src="storeData.avatar" mode=""></image>
			<view class="hx-txt-18 hx-color-black hx-txt-weigth hx-mb-10 ">
				十里桃花
			</view>
			<view class="hx-txt-14 hx-color-black">
				店家说明,本店放心吃，地方名才
			</view>
			<view class="">
				后续再扩展优惠券，满减，折扣，活动等功能
			</view>
			<view class="shrink-box">
				<i class="hxicon" :class="showStoreBox ? 'icon-fold' : 'icon-unfold'"  @click="handleExport">></i>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		props:[
			'storeData'
		],
		data() {
			return {
				//展开门店信息容器
				showStoreBox: false,
				//商家盒子高度
				storeInfoBoxHeight: 100,
			};
		},
		watch:{
			showStoreBox(val,oldVal){
				if(val == true){
					this.showStoreBoxFunc();
				}else{
					this.hiddenStoreBoxFunc();
				}
			}
		},
		methods:{
			handleExport(){
				var that = this;
				console.log("showStoreBox",that.showStoreBox)
				that.showStoreBox = !that.showStoreBox
			},
			clickme(){
				uni.$on('page-popup', (data) => {
				    console.log('标 题：' + data.title)
				    console.log('内容：' + data.content)
				})  
			},
			touchStart(e){
			    console.log("touchStart",e.changedTouches)  
				let that = this;
				console.log("touchData====>",that)
			    // that.touchData.clientX=e.changedTouches[0].clientX;
			    // that.touchData.clientY=e.changedTouches[0].clientY;
			},
			touchEnd(e){
			    console.log("touchEnd",e.changedTouches)
			},
			showStoreBoxFunc(){
				console.log("change open")
				this.storeInfoBoxHeight = uni.getSystemInfoSync().screenHeight-230;
				// this.$set(this.$data,'showFoot',false);
				console.log("storeInfoBoxHeight",this.storeInfoBoxHeight)
				this.showStoreBox = true;
				uni.pageScrollTo({
					duration:0,
					scrollTop:0
				})
			},
			hiddenStoreBoxFunc(){
				console.log("change hidden")
				this.storeInfoBoxHeight = 100;
				this.showStoreBox = false;
				// if(this.swiperCurrent == 0){
				// 	this.$set(this.$data,'showFoot',true);
				// }
			},
		}
	}
</script>
<style lang="scss">
	.header{
		position: relative;
		min-height: 230px;
		&-bg{
			position: absolute;
			left: 0;
			top: 0;
			z-index: 2;
			width: 100%;
			height: 142px;
			display: flex;
			background: #8dc63f;
			image{
				width: 100%;
				height:100%;
			}
		}
		&-bg-black{
			position: absolute;
			left: 0;
			top: 142px;
			bottom: 0;
			z-index: 1;
			background-color: #ffffff;
			width: 100%;
			transition: background-color 0.2s;
		}
		&-bg-gray{
			position: absolute;
			left: 0;
			top: 142px;
			bottom: -16px;
			z-index: 1;
			background-color: #eee;
			width: 100%;
			transition: background-color 0.2s;
		}
		&-top-Placeholder{
			height: 105px;
		}
		.storeInfo{
			position: relative;
			z-index: 2;
			background: #ffffff;
			height: 100px;
			border-radius: 6px;
			padding: 12px;
			margin-bottom: 4px;
			transition: all 0.2s;
			.shrink-box{
				position: absolute;
				bottom: 0;
				left: 0;
				right: 0;
				text-align: center;
				font-size: 20px;
				color: #a2a8ab;
			}
			.storeAvatar{
				position: absolute;
				width: 50px;
				height: 50px;
				right: 16px;
				top: -25px;
				background: #ffffff;
				border-radius: 4px;
				
			}
		}
	}
</style>
