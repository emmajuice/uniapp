<template>
	<view>
		<scroll-view scroll-y class="page">
			<!-- <cu-custom bgImage="https://image.weilanwl.com/color2.0/plugin/cjkz2329.jpg">
				<block slot="content">
					<image src="/static/cjkz.png" mode="aspectFill" style="width: 240upx;height: 60upx;"></image>
				</block>
			</cu-custom> -->
			<cu-custom bgColor="bg-gradual-orange">></block>
			    <block slot="content">VIP Center</block>
			</cu-custom>
			<view class="cu-card">
				<view class="cu-item bg-img shadow-blur" :style="[{backgroundImage:'url('+item.img+')'}]" @tap="toChild" :data-id="item.id"
				 v-for="(item,index) in list" :key="index">
					<view class="cardTitle">
						{{item.title}}
					</view>
				</view>
			</view>
			<view class="cu-tabbar-height"></view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				StatusBar: this.StatusBar,
				CustomBar: this.CustomBar,
				list: [{
						title: 'VIP卡',
						img: 'https://image.weilanwl.com/color2.0/plugin/sylb2244.jpg',
						id: '123156'
					},
					{
						title: '农夫山泉会员卡',
						img: 'https://image.weilanwl.com/color2.0/plugin/wdh2236.jpg',
						id: '123157'
					},
					{
						title: '大地鲜果卡嘉宾卡',
						img: 'https://image.weilanwl.com/color2.0/plugin/qpct2148.jpg',
						id: '123158'
					},
					{
						title: 'QD青春会员卡',
						img: 'https://image.weilanwl.com/color2.0/plugin/qpczdh2307.jpg',
						id: '123159'
					}
				]
			};
		},
		methods: {
			toChild(e) {
				var cardId = e.currentTarget.dataset.id;
				uni.navigateTo({
					url: `cardDetail?id=${cardId}`
				})
			},
		},
	}
</script>

<style>
	.page {
		height: 100vh;
	}
	.cardTitle {
		color: #fff;
		padding: 90upx 60upx;
		font-size: 40upx;
		font-weight: 300;
		transform: skew(-10deg, 0deg);
		position: relative;
		text-shadow: 0px 0px 6upx rgba(0, 0, 0, 0.3)
	}
	.cardTitle::before {
		content: "";
		position: absolute;
		/* width: 60upx;
		height: 6upx;
		border-radius: 20upx;
		background-color: #fff; */
		display: block;
		top: 60upx;
		left: 50upx;
		transform: skew(10deg, 0deg);
	}
	.cardTitle::after {
		content: "";
		position: absolute;
		/* width: 140upx;
		border-radius: 6upx;
		height: 24upx;
		background-color: #fff; */
		display: block;
		bottom: 76upx;
		left: 90upx;
		transform: skew(10deg, 0deg);
		opacity: 0.1;
	}
</style>
