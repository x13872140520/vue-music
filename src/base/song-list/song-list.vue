<template>
	<div class="song-list">
    <ul>
      <li v-for="(song,index) in songs"  class="item item-song" @click="selectItem(song,index)" >
        <div class="content">
          <h2 class="name">{{song.name}}</h2>
          <p class="desc">{{getDesc(song)}}</p>
        </div>
      </li>
    </ul>
	</div>
</template>
<script type="text/ecmascript-6">
import {getSingerPlay} from 'api/singer'
import {mapGetters,mapMutations} from 'vuex'
import {ERR_OK} from 'api/config'
import {getClass} from 'common/js/dom'

export default {
props:{
  songs:{
    type:Array,
    default:[]
}
},
  computed:{
  ...mapGetters([
  'currentSong',
  'playing'
  ])
},
  methods:{
  getDesc(song) {
  return song.singer+'.'+song.album
},
  selectItem(item,index) {

  getSingerPlay(item).then((res)=>{
    if(res.code == ERR_OK){
 
    let url ='http://dl.stream.qqmusic.qq.com/C400' + item.mid+'.m4a?vkey='+res.data.items[0].vkey+'&guid=504753841&uin=0&fromtag=66'
    
    this.$emit('select',item,index,url)
    
  }
 })


 },
 
}
}
</script>
<style scoped lang="stylus" ref="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .song-list
    .item
      display: flex
      align-items: center
      box-sizing: border-box
      height: 64px
      font-size: $font-size-medium
      .content
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          no-wrap()
          color: $color-text
        .desc
          no-wrap()
          margin-top: 4px
          color: $color-text-d

</style>