<template>
	<view>
		<view class="cu-bar bg-white solid-bottom">
			<view class="action">
				<text class="cuIcon-titles text-orange"></text> 会员卡片
			</view>
		</view>
		<view class="cu-card case">
			<view class="cu-item shadow carditem">
				<view class="image">
					<image class="bg-card bg-gradual-green" src=""></image>
					<view class="cu-tag bg-blue">今日推荐</view>
					<view class="cu-bar bg-shadeBottom card-bar"> 
						<view class="text-cut card-info">
							<span>农夫山泉会员卡</span>
							<text>农夫山泉</text>
						</view>
					</view>
				</view>	
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isCard: false
			};
		},
		methods: {
			IsCard(e) {
				this.isCard = e.detail.value
			},
		}
	}
</script>

<style>
.carditem{
	margin-bottom: 0 !important;
}
.card-bar{
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	background: #pink;
	padding: 20upx;
}
.bg-card{
	height: 260upx;
	width: 100%;
}
.card-info{
	display: flex;
	flex-direction: column;
	height: 260upx;
	justify-content: center;
	span{
		font-size: 40upx;
		font-weight: 600;
	}
}
</style>
