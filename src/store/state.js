import {playMode} from 'common/js/config'
import {loadSearch,loadPlayHistory,loadFavoriteList} from "common/js/cache"
const state = {
	singer: {},
	playing:false,
	fullScreen:false,
	playList:[],
	sequenceList:[],
	mode:playMode.random,
	currentIndex:-1,
	currentUrl:'',
	disc:{},
	topList:{},
	searchHistory:loadSearch(),
	playHistory:loadPlayHistory(),
	favoriteList:loadFavoriteList(),
}
export default state