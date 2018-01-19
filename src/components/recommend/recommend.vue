<template>
	<div class="recommend" ref="recommend">
		<scroll class="recommend-content" :data="discList" ref="recommendContent">
			<div>
			<div class="slider-wrapper">
				<slider v-if="recommends.length">
					<div v-for="item in recommends">
						<a :href="item.linkUrl">
							<img :src="item.picUrl"/>
						</a>
					</div>
				</slider>
			</div>
			<div class="recommend-list">
				<h1 class="list-title">
					热门歌单推荐
				</h1>
				<ul>
					<li v-for = "item in discList" class="item" @click="selectItem(item)">
						<div class="icon">
							<img width="60" height="60" v-lazy="item.url"/>
						</div>
						<div class="text">
							<h2 class="name" v-html="item.man"></h2>
							<p class="desc" v-html="item.song"></p>
						</div>
					</li>
				</ul>
			</div>
			</div>
			<div class="loading-container"  v-show="!discList.length">
			<loading>
			</loading>
			</div>
		</scroll>
		<router-view></router-view>
	</div>
</template>
<script type="text/ecmascript-6">
	import Loading from 'base/loading/loading'
	import Scroll from 'base/scroll/scroll'
	import Slider from 'base/slider/slider'
	import {getRecommend,getDiscList} from 'api/recommend'
	import {ERR_OK} from 'api/config'
	import axios from 'axios'
	import {playlistMixin} from 'common/js/mixin'
	import {mapMutations} from 'vuex'
	export default{
		mixins:[playlistMixin],
	data(){
		return{
		recommends:[], 
		discList:[]
	}
	},
	created(){
	this._getRecommend()
	this._getDiscList()
	},
	
	methods:{
		selectItem(item) {
		
			this.$router.push({
				path:'/recommend/'+item.man
			})
			this.setDisc(item)
		},
	handlePlayList(playlist) {
      const bottom = playlist.length > 0 ? '60px':''
      this.$refs.recommend.style.bottom = bottom
      this.$refs.recommendContent.refresh()
    },
	_getRecommend(){
	getRecommend().then( (res) => {
	if(res.code === ERR_OK ){
	this.recommends = res.data.slider
	}
	})
	},
	_getDiscList(){
		getDiscList().then((res)=>{
		var str = res.data
		
		var imgurlRegular=/imgurl\S{0,10}http:[^,]*/g
		var imghttpRegular=/http:[^"]*/
		var nameRegular = /"name\S{0,2}[^,]*/g
		var dissnameRegular = /dissname\S{0,2}[^,]*/g
		var subRegular = /^((?!name).)*$/
		var dissidRegular = /dissid\S{0,2}[^,]*/g

		var imgurlArr = str.match(imgurlRegular)
		var nameArr = str.match(nameRegular)
		var dissnameArr = str.match(dissnameRegular)
		var dissidArr = str.match(dissidRegular)
		var html = []
		var manName = []
		var songName = []
		var dissId = []
		
	for(var i= 0; i < imgurlArr.length ;i++ ){
		var htmlMan = nameArr[i].replace(/"name":"/,"").match(/[^"]*/)
		manName.push(htmlMan[0])
		var htmlSong = dissnameArr[i].replace(/dissname":"/,"").match(/[^"]*/)
		songName.push(htmlSong[0])
		var htmlUrl = imgurlArr[i].match(imghttpRegular)
		html.push(htmlUrl[0])	
		var htmldissId = dissidArr[i].replace(/dissid":"/,"").match(/[^"]*/)
		dissId.push(htmldissId[0])
		this.discList.push({"url":htmlUrl[0],"man":htmlMan[0],"song":htmlSong[0],'dissid':htmldissId[0]})
	}
		
		
		
		
		
	})
},
	...mapMutations({
		setDisc:'SET_DISC'
	})
},
components:{
	Slider,
	Scroll,
	Loading
}
}




</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
	@import "~common/stylus/variable"
	.recommend
		position:fixed
		width:100%
		top:88px
		bottom:0
		.recommend-content
			height:100%
			overflow:hidden
			.slider-wrapper
				position:relative
				width:100%
				overflow:hidden
			.recommend-list
				.list-title
					height:65px
					line-height:65px
					text-align:center
					font-size:$font-size-medium
					color:$color-theme
				.item
					display:flex
					box-sizing:border-box
					align-items:center
					padding:0 20px 20px 20px
					.icon
						flex:0 0 60px
						width:60px
						padding-right:20px
					.text
						display:flex
						flex-direction:column
						justify-content:center
						flex:1
						line-height:20px
						overflow:hidden
						font-size:$font-size-medium
						.name
							margin-bottom:10px
							color:$color-text
						.desc
							color:$color-text-d
			.loading-container
				position:absolute
				width:100%
				top:50%
				transform:translateY(-50%)

</style>