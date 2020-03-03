<template>
	<view>
		<view @click="clickme">点击我可以看到底部弹框的出现tt</view>
		<paymodal :cart='cartInfo'></paymodal>
	</view>
</template>

<script>
import paymodal from '@/components/CartModal.vue'
export default {
	data() {
		return {
			cartInfo:{
				name:'毛绒公仔',
				num:1,
				desc:'超级可爱的'
			}
		};
	},
		
	
	components:{
		paymodal,
	},
	methods:{
		clickme(){
			console.log("000000000")
			uni.$on('page-popup', (data) => {
			    console.log('标题：' + data.title)
			    console.log('内容：' + data.content)
			})  
		}
	}
}
</script>

<style lang="scss">
	
</style>
