<template>
  <transition name="slide">
    <div class="add-song" v-show="showFlag" @click.stop>
      <div class="header">
        <h1 class="title">添加歌曲到列表</h1>
        <div class="close" @click="hide">
          <i class="icon-close"></i>
        </div>
      </div>
      <div class="search-box-wrapper">
        <search-box @query="search" :placeholder="placeholder" ref="searchBox"></search-box>
      </div>
      <div class="shortcut" v-show="!query" >
        <switches :switches="switches" :currentIndex ="currentIndex" @select="getIndex"></switches>
        <div class="list-wrapper">
          <scroll ref="songList" class="list-scroll" v-if="currentIndex === 0" :data="playHistory">
            <div class="list-inner">
              <song-list @select="toplaysong" :rank="false" :songs="playHistory" ></song-list>
            </div>
          </scroll>

           <scroll ref="searchList" class="list-scroll" v-if="currentIndex === 1" :data="searchHistory">
            <div class="list-inner">
              <search-list @select="addQuery" @delete="deleteSearchHistory" :searches="searchHistory"></search-list>
            </div>
          </scroll>
        </div>
      </div>
      <div class="search-result" v-show="query">
        <suggest  @select="selectSuggest" :query="query" :showSinger="showSinger"></suggest>
      </div>
      <top-tip ref="topTip">
      <div class="tip-title">
        <i class="icon-ok"></i>
        <span class="text">1首歌曲已经加到播放列表</span>
      </div>
    </top-tip>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import SearchBox from "base/search-box/search-box"
  import Suggest from "components/suggest/suggest"
  import {searchMixin} from "common/js/mixin"
  import {mapGetters,mapActions} from 'vuex'
  import Switches  from "base/switches/switches"
  import Scroll from "base/scroll/scroll"
  import SongList from "base/song-list/song-list"
  import Song from "common/js/song"
  import {getSingerPlay} from "api/singer"
  import {ERR_OK} from "api/config"
  import SearchList from "base/search-list/search-list"
  import TopTip from "base/top-tip/top-tip"
  export default {
    mixins:[searchMixin],
    data(){
      return {
        showFlag:false ,
        placeholder:'搜索歌曲',
        showSinger:false,
        switches:['最近播放','搜索历史'],
        currentIndex:0
      }
    },
    computed:{
      ...mapGetters([
        'playHistory',
        'searchHistory'
        ])
    },
   
    methods:{
      toplaysong(item,index,url){
       
        var song = new Song(item)
        
        getSingerPlay(song).then((res)=>{
    if(res.code == ERR_OK){
   
    let url ='http://dl.stream.qqmusic.qq.com/C400' + song.mid+'.m4a?vkey='+res.data.items[0].vkey+'&guid=504753841&uin=0&fromtag=66'
  
    this.insertSong({
      song,
      url
    })
  }
 })
        this.$refs.topTip.show()
      },
      
      getIndex(index){
        this.currentIndex = index
      },
      selectSuggest(){
        this.saveSearch()
      },
      show(){
        this.showFlag = true
        setTimeout(()=>{
          if(this.currentIndex === 0){
            this.$refs.songList.refresh()
          }else if(this.currentIndex === 1){
            this.$refs.searchList.refresh()
          }
          
        },20)
      },
      hide(){
        this.showFlag = false
      },
      search(query) {
        this.query = query
      },
      ...mapActions([
        'insertSong'
        ])
    },
    components:{
      SearchBox,
      Suggest,
      Switches,
      Scroll,
      SongList,
      SearchList,
      TopTip
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .add-song
    position: fixed
    top: 0
    bottom: 0
    width: 100%
    z-index: 200
    background: $color-background
    &.slide-enter-active, &.slide-leave-active
      transition: all 0.3s
    &.slide-enter, &.slide-leave-to
      transform: translate3d(100%, 0, 0)
    .header
      position: relative
      height: 44px
      text-align: center
      .title
        line-height: 44px
        font-size: $font-size-large
        color: $color-text
      .close
        position: absolute
        top: 0
        right: 8px
        .icon-close
          display: block
          padding: 12px
          font-size: 20px
          color: $color-theme

    .search-box-wrapper
      margin: 20px
    .shortcut
      .list-wrapper
        position: absolute
        top: 165px
        bottom: 0
        width: 100%
        .list-scroll
          height: 100%
          overflow: hidden
          .list-inner
            padding: 20px 30px
    .search-result
      position: fixed
      top: 124px
      bottom: 0
      width: 100%
    .tip-title
      text-align: center
      padding: 18px 0
      font-size: 0
      .icon-ok
        font-size: $font-size-medium
        color: $color-theme
        margin-right: 4px
      .text
        font-size: $font-size-medium
        color: $color-text
</style>