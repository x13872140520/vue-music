<template>
  <transition name="list-fade">
    <div class="playlist" v-show="showFlag"   @click.stop="hide">
      <div class="list-wrapper"  @click.stop>
        <div class="list-header" >
          <h1 class="title">
            <i class="icon" :class="iconMode" @click="changeMode" ></i>
            <span class="text" v-html="text"></span>
            <span class="clear" @click="deleteAll"><i class="icon-clear"></i></span>
          </h1>
        </div>
        <scroll ref="playlist" class="list-content" :data="sequenceList">
          <ul>
            <li class="item" v-for="(item,index) in sequenceList" @click="selectItem(item,index)" ref="listitem">
              <i class="current" :class="selectCurrent(item)"></i>
              <span class="text">{{item.name}}</span>
              <span class="like" @click.stop="favorite(item)" >
                <i :class="checkExist(item)"></i>
              </span>
              <span class="delete" @click.stop="deleteOne(item)">
                <i class="icon-delete"></i>
              </span>
            </li>
          </ul>
        </scroll>
        <div class="list-operate">
          <div  class="add" @click="addBtn">
            <i class="icon-add"></i>
            <span class="text">添加歌曲到队列</span>
          </div>
        </div>
        <div  class="list-close"  @click="hide">
          <span>关闭</span>
        </div>
      </div>
      <confirm  ref="confirm" text="是否清空播放列表" confirmBtnText="清空" @confirm="deleteWholeplayList"></confirm>
      <add-song ref="addSong"></add-song>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
import Confirm from "base/confirm/confirm"
import {mapGetters,mapActions,mapMutations} from "vuex"
import Scroll from "base/scroll/scroll"
import {getSingerPlay} from 'api/singer'
import {ERR_OK} from 'api/config'
import {playerMixin} from "common/js/mixin"
import {playMode} from 'common/js/config'
import addSong from "components/add-song/add-song"
export default{
  mixins:[playerMixin],
  data() {
    return {
      showFlag:false
    }
  },
  computed:{
    text() {
      return this.mode === playMode.sequence ? '顺序播放' : this.mode === playMode.loop ? '单曲循环' : '随机播放歌曲'
    },
    ...mapGetters([
      'sequenceList',
      'currentSong',
      'playList',
      'mode',
      'sequenceList',
      'favoriteList'
      ])
  },
  methods:{
    addBtn(){
      this.$refs.addSong.show()
    },
    deleteAll() {
      this.$refs.confirm.show()
    },
    deleteOne(item) {
      this.deleteSong(item)
      if(!this.playList.length){
        this.hide()
      }
      console.log(this.sequenceList)
    },
    selectCurrent(item) {
      if(this.currentSong.id === item.id ){
        return 'icon-play'
      } 
      return ''

    },
    selectItem(item,index) {
  getSingerPlay(item).then((res)=>{
    if(res.code == ERR_OK){
    let url ='http://dl.stream.qqmusic.qq.com/C400' + item.mid+'.m4a?vkey='+res.data.items[0].vkey+'&guid=504753841&uin=0&fromtag=66'
    this.selectPlay({
      list:this.sequenceList,
      index,
      url})
  }
      
     
 })


 },
      scrollToCurrent(newIndex){
       const index = this.sequenceList.findIndex((song)=>{
        return newIndex.id === song.id
      })
         this.$refs.playlist.scrollToElement(this.$refs.listitem[index])
      },
       

    show (){
      this.showFlag = true
      setTimeout(()=>{
        this.$refs.playlist.refresh()
        this.scrollToCurrent(this.currentSong)
      },20)
    },
    hide (){
      this.showFlag = false
    },
     ...mapMutations({
      setPlayMode:'SET_PLAY_MODE',
      setPlayList:'SET_PLAYLIST',
      setCurrentIndex:'SET_CURRENT_INDEX'
      }),
    ...mapActions([
      'selectPlay',
      'deleteSong',
      'deleteWholeplayList',
      'deleteFavoriteAction',
      'saveFavoriteAction'
      ])
   

  },
  components:{
    Scroll,
    Confirm,
    addSong
  },
  watch:{
    currentSong(newIndex,oldIndex){
     
      if(!this.showFlag || newIndex.id===oldIndex.id){
        return
      }
      
      this.scrollToCurrent(newIndex)

        
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .playlist
    position: fixed
    left: 0
    right: 0
    top: 0
    bottom: 0
    z-index: 200
    background-color: $color-background-d
    &.list-fade-enter-active, &.list-fade-leave-active
      transition: opacity 0.3s
      .list-wrapper
        transition: all 0.3s
    &.list-fade-enter, &.list-fade-leave-to
      opacity: 0
      .list-wrapper
        transform: translate3d(0, 100%, 0)
    &.list-fade-enter
    .list-wrapper
      position: absolute
      left: 0
      bottom: 0
      width: 100%
      background-color: $color-highlight-background
      .list-header
        position: relative
        padding: 20px 30px 10px 20px
        .title
          display: flex
          align-items: center
          .icon
            margin-right: 10px
            font-size: 30px
            color: $color-theme-d
          .text
            flex: 1
            font-size: $font-size-medium
            color: $color-text-l
          .clear
            extend-click()
            .icon-clear
              font-size: $font-size-medium
              color: $color-text-d
      .list-content
        max-height: 240px
        overflow: hidden
        .item
          display: flex
          align-items: center
          height: 40px
          padding: 0 30px 0 20px
          overflow: hidden
          &.list-enter-active, &.list-leave-active
            transition: all 0.1s
          &.list-enter, &.list-leave-to
            height: 0
          .current
            flex: 0 0 20px
            width: 20px
            font-size: $font-size-small
            color: $color-theme-d
          .text
            flex: 1
            no-wrap()
            font-size: $font-size-medium
            color: $color-text-d
          .like
            extend-click()
            margin-right: 15px
            font-size: $font-size-small
            color: $color-theme
            .icon-favorite
              color: $color-sub-theme
          .delete
            extend-click()
            font-size: $font-size-small
            color: $color-theme
      .list-operate
        width: 140px
        margin: 20px auto 30px auto
        .add
          display: flex
          align-items: center
          padding: 8px 16px
          border: 1px solid $color-text-l
          border-radius: 100px
          color: $color-text-l
          .icon-add
            margin-right: 5px
            font-size: $font-size-small-s
          .text
            font-size: $font-size-small
      .list-close
        text-align: center
        line-height: 50px
        background: $color-background
        font-size: $font-size-medium-x
        color: $color-text-l
</style>