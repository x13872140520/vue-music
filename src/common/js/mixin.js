import {mapGetters,mapActions} from 'vuex'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'
import Song from "common/js/song"
export const playlistMixin = {
	computed:{
		...mapGetters([
			'playList'
			])
	},
	mounted() {
		this.handlePlayList(this.playList)
	},
	activated() {
		this.handlePlayList(this.playList)
	},
	watch:{
		playList(newVal) {
			this.handlePlayList(newVal)
		}
	},
	methods:{
		handlePlayList() {
			throw new Error('components must implement handlePlayList method')
		}
	}

}
export const playerMixin = {
	computed:{
		  iconMode() {
    return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
  },
},
	methods:{
    favorite(song){
      let index = this.favoriteList.findIndex((item)=>{
       return song.id === item.id
        //I am  not sure if the same between the type of their,current is testing!
      })
      if(index > -1){
        this.deleteFavoriteAction(song)
        // execute some operate to delete this song from  favoritelist
      }else{
        // execute some operate to add this song to favoritelist
        this.saveFavoriteAction(song)
      }
    },
  checkExist(song){
     let index = this.favoriteList.findIndex((item)=>{
        return song.id === item.id
      })
     if(index >-1){
      return "icon-favorite"
     } else{
        return "icon-not-favorite"
     }
    },
  changeMode() {
  const mode = (this.mode + 1) % 3
  this.setPlayMode(mode)
  let list = null
 
  if(mode ===playMode.random ) {
  
  list = shuffle(this.sequenceList)
  
}else{
  list = this.sequenceList
}

this.resetCurrentIndex(list)
this.setPlayList(list)
},
resetCurrentIndex(list) {
 
  let index = list.findIndex((item) => {
  return item.id === this.currentSong.id
})
 
  this.setCurrentIndex(index)
},
}
}



export const searchMixin = {
  data() {
    return {
      query: '',
      refreshDelay: 120
    }
  },
  computed: {
    ...mapGetters([
      'searchHistory'
    ])
  },
  methods: {
    onQueryChange(query) {
      this.query = query
    },
    addQuery(query) {
      this.$refs.searchBox.setQuery(query)
    },
    saveSearch() {
      this.saveSearchHistory(this.query)
    },
    ...mapActions([
      'saveSearchHistory',
      'deleteSearchHistory'
    ])
  }
}