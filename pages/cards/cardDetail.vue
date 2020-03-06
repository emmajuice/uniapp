<template>
	<view>
		<cu-custom bgColor="bg-gradual-orange">></block>
		    <block slot="content">会员卡详情页</block>
		</cu-custom>
		<view>{{cardId}}</view>
		<view class="cu-card" v-if="card.image">
			<view class="cu-item shadow vipcard bg-img shadow-blur" :style="[{backgroundImage:'url('+card.image+')'}]">
				<view class="cardTitle">
					<span></span>
				</view>
			</view>
		</view>
		<!-- <view class="cu-card">
			<view class="cu-item  vipcard bg-img shadow-blur" style="backgroundImage:url(https://image.weilanwl.com/color2.0/plugin/sylb2244.jpg)">
				<view class="cardTitle">
					
				</view>
			</view>
		</view> -->
	</view>
</template>

<script>
	import { getVipCard } from '../../api/user.js'
	export default {
		data() {
			return {
				cardId:'',
				cardImg:'',
				card:{}
			};
		},
		onLoad(e) {
			console.log(e)
			this.cardId = e.id,
			this.cardImg ='https://image.weilanwl.com/color2.0/plugin/sylb2244.jpg'
			this.card = {
				image:'https://image.weilanwl.com/color2.0/plugin/sylb2244.jpg'
			}
			this.getCardInfo(this.cardId);
		},
		methods:{
			getCardInfo(id){
				getVipCard().then(res=>{
					console.log("cardinfo====",res)
				})
			}
		}
	}
</script>

<style lang="scss">
.cu-card{
	display: flex;
	justify-content: center;
}
.vipcard{
	height: 300upx;
	width: 600upx;
}
</style>
