<template>
	<view>
		<cu-custom bgColor="bg-gradual-orange">></block>
		    <block slot="content">个人中心</block>
		</cu-custom>
		<view class="userinfo" style="margin-bottom:50rpx;">
			<image class="userinfo-avatar" :src="userInfo.avatarUrl?userInfo.avatarUrl:'../../static/images/user.png'" background-size="cover"></image>
			<button v-if="!userInfo.nickName" open-type="getUserInfo" @getuserinfo="login"> 点击登录账户</button>
			<text v-else class="userinfo-nickname">{{ userInfo.nickName }}</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				userInfo:{}
			};
		},
		onLoad(e){
			uni.getUserInfo({
			  success:(res=>{
				this.userInfo = res.userInfo;
			  }),
			  fail:(res=>{
				console.log("登录失效重新登录吧")
			  })
			})
		},	
		methods:{
			login(e){
			  console.log(e)
			 //  if(e.mp.detail.userInfo){
				// this.userInfo = e.mp.detail.userInfo
			 //  }
			 uni.login({
			 	success(res) {
			 		console.log(res)
			 	}
			 })
			}
		}
	}
</script>

<style lang="scss">
.userinfo {
	display: flex;
	flex-direction: column;
	align-items: center;
	width: 750rpx;
}
.userinfo-avatar {
	width: 160rpx;
	height: 160rpx;
	border-radius: 80rpx;
	overflow: hidden;
	margin-bottom:20rpx;
}
.userinfo-nickname {
	margin-top: 20rpx;
	margin-bottom: 20rpx;
	font-size: 14px;
}
</style>
