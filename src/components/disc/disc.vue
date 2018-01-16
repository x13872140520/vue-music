<template>
	<transition name="slide">
		<music-list :title="title" :bgImage="bgImage"></music-list>
	</transition>
</template>
<script type="text/ecmascript-6">
	import MusicList from 'components/music-list/music-list'
	import {mapGetters} from 'vuex'
	import {getSongList} from 'api/recommend'
	import {ERR_OK} from 'api/config'
	export default{
		computed:{
			title() {
				return this.disc.song
			},
			bgImage() {
				return this.disc.url
			},
			...mapGetters([
				'disc'
				])
		},
		created() {
			this._getSongList()
		},
		methods:{
			_getSongList() {
				console.log()
				getSongList(this.disc.dissid).then((res) => {
					console.log(typeof res)
					if(res.code === ERR_OK){
						console.log(res)
					}
				})
			}
		},
		components:{
			MusicList
		}
	}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
	@import "~common/stylus/variable"
	.slide-enter-active, .slide-leave-active
	  transition:all 0.3s

	.slide-enter, .slide-leave-to
	  transform:translate3d(100%,0,0)
</style>