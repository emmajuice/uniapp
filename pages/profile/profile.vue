<template>
	<view>
		<view class="test" @click="test">
			点击一次啊
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				haha:false
			};
		},
			
		methods:{
			test(){
				
				console.log(this.haha)
			}
		}
	}
</script>

<style lang="scss">

</style>
