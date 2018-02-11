<template>
  <scroll class="suggest"
  ref="scroll"
  :pullUp="pullUp"
  @scrollToEnd="searchMore"
  >
    <keep-alive>
    <ul class="suggest-list" >
      <li class="suggest-item" v-for="item in result" @click="selectItem(item)" >
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <loading v-show="query && !result "></loading>
    </ul>
    </keep-alive>

    <div class="no-result-wrapper" v-show="resultMes === 'no results'">
      <div class="no-result-content">抱歉,暂无数据 </div>
    </div>

  
  </scroll>
</template>

<script type="text/ecmascript-6">
  import {search} from "api/search"
  import {ERR_OK} from "api/config"
  import {getSingerPlay} from "api/singer"
  import {filterSinger} from "common/js/song"
  import Scroll from "base/scroll/scroll"
  import Loading from "base/loading/loading"
  import Singer from "common/js/singer"
  import {mapMutations,mapActions} from "vuex"
  import {createSong} from "common/js/song"
  const TYPE_SINGER = 'singer'
  const perpage = "20"
  export default {
    props:{
      query:{
        type:String,
        default:''
      },
      showSinger:{
        type:Boolean,
        default:true
      }
    },
    data() {
      return{
        page:1,
        result:[], 
        pullUp:true,
        hasMore:true,
        resultMes:''
      }
    },
    methods:{
      selectItem(item) {
       
        if(item.type === TYPE_SINGER){
          const singer = new Singer({
            id:item.singerid,
            name:item.singername,
            mid:item.singermid
          })

          this.$router.push({
            path:'/search/'+item.singerid
          })
          this.setSinger(singer)
         
        }else{
          let song = createSong(item)


  getSingerPlay(song).then((res)=>{
    if(res.code == ERR_OK){
   
    let url ='http://dl.stream.qqmusic.qq.com/C400' + song.mid+'.m4a?vkey='+res.data.items[0].vkey+'&guid=504753841&uin=0&fromtag=66'
    console.log(song)
    this.insertSong({
      song,
      url
    })
  }
 })

         
        }
        this.$emit('select')
      },
      getIconCls(item){
        if(item.type === TYPE_SINGER){
          return "icon-mine"
        }else{
          return "icon-music"
        }

      },
      getDisplayName(item){
       
        if(item.type === TYPE_SINGER){
          return item.singername
        }else{
          return item.songname +'-' +filterSinger(item.singer)
        }
      },
      search() {
        this.page =1
        this.hasMore =true
        this.$refs.scroll.scrollTo(0,0)
        search(this.query,this.page,this.showSinger,perpage).then((res)=>{
          
          if(res.code === ERR_OK){
            this.result=this._getResult(res.data)
            this._checkMore(res.data)
            if(res.message === 'no results'){
              this.resultMes='no results'
            }else{
              this.resultMes=''
            }
          }
        })
      },
      _getResult(data) {
        let ret=[]
        if(data.zhida && data.zhida.singerid){
          ret.push({...data.zhida, ...{type:TYPE_SINGER}})
        }
        if(data.song){
          ret = ret.concat(data.song.list)

        }
        return ret
      },
      searchMore() {
        if(!this.hasMore){
          return
        }
        this.page++
          search(this.query,this.page,this.showSinger,perpage).then((res)=>{
          
          if(res.code === ERR_OK){
            this.result=this.result.concat(this._getResult(res.data))
            this._checkMore(res.data)
                if(res.message === 'no results'){
              this.resultMes='no results'
            }else{
              this.resultMes=''
            }
          }
        })


      },
      _checkMore(data) {
        if((data.curnum+data.curpage*perpage)>=data.totalnum) {
          this.hasMore = false
        }
      },
      ...mapActions([
        'insertSong'
        ]),
      ...mapMutations({
        setSinger:'SET_SINGER'
      })
    },
    watch:{
      query() {
        this.search()
        this.$refs.scroll.refresh()
      },
      result() {
        this.$refs.scroll.refresh()
      }
    },
    components:{
      Scroll,
      Loading
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
      .no-result-content
            text-align:center
</style>