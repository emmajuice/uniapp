<template>
	<view>
		<cu-custom bgColor="bg-gradual-orange">></block>
		    <block slot="content">个人中心</block>
		</cu-custom>
		<view class="userinfo" style="margin-bottom:50rpx;">
			<image class="userinfo-avatar" :src="userInfo.avatarUrl?userInfo.avatarUrl:'../../static/images/user.png'" background-size="cover"></image>
			<button v-if="!userInfo.nickName" open-type="getUserInfo" @getuserinfo="login">  点击登录账户</button>
			<text v-else class="userinfo-nickname">{{ userInfo.nickName }}</text>
		</view>
		<picker class="picker" :range="userIDList" :value="selectedIndex" @change="choose">
		  <div class="cell">
		    <div class="choose">用户</div>
		    <div>
		      {{userIDList[selectedIndex]}}
		      <i-icon type="enter" />
		    </div>
		  </div>
		</picker>
		<button hover-class="clicked" :loading="loading" class="login-button" @click="handleLogin">登录</button>
	</view>
</template>

<script>
	import { mapState } from 'vuex'
	import { genTestUserSig } from '../../libs/GenerateTestUserSig'
	export default {
		data() {
			return {
				userInfo:{},
				password: '',
				userIDList: new Array(30).fill().map((item, idx) => ('user' + idx)),
				selectedIndex: 1,
				loading: false
			};
		},
		computed: {
		  ...mapState({
		    myInfo: state => state.user.myInfo
		  })
		},
		onUnload () {
		  this.loading = false
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
			},
			// 点击登录进行初始化
			handleLogin () {
			  const userID = this.userIDList[this.selectedIndex]
			  // case1: 要登录的用户是当前已登录的用户，则直接跳转即可
			  if (this.myInfo.userID && userID === this.myInfo.userID) {
			    wx.switchTab({ url: '../index/main' })
			    return
			  }
			
			  this.loading = true
			  // case2: 当前已经登录了用户，但是和即将登录的用户不一致，则先登出当前登录的用户，再登录
			  if (this.myInfo.userID) {
			    this.$store.dispatch('resetStore')
			    wx.$app.logout()
			      .then(() => {
			        this.login(userID)
			      })
			    return
			  }
			  // case3: 正常登录流程
			  this.login(userID)
			},
			login (userID) {
			  wx.$app.login({
			    userID,
			    userSig: genTestUserSig(this.userIDList[this.selectedIndex]).userSig
			  }).then(() => {
			    wx.switchTab({ url: '../index/main' })
			  }).catch(() => {
			    this.loading = false
			  })
			},
			choose (event) {
			  this.selectedIndex = Number(event.mp.detail.value)
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
