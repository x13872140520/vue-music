import  storage from "good-storage"
import Song from "common/js/song"
const SEARCH_KEY = "_search_"
const PLAY_list = "_playlist_"
const SEARCH_MAX_LENGTH =15
const PLAYHISTORY = "_playhistory_"
const PLAY_MAX_LENGTH =200
const FAVORITELIST = "_favoritelist_"
const FAVO_MAX_LENGTH =200
function insertArray(arr,val,compare,maxLen) { 
	const index = arr.findIndex(compare)
	if(index === 0 ){
		return 
	}else if(index > 0 ){
		arr.splice(index,1)
	}
	arr.unshift(val)
	if(maxLen && arr.length > maxLen){
		arr.pop()
	}
}

function deleteArray(arr,compare) { 
	const index = arr.findIndex(compare)
	if(index > -1){
		arr.splice(index,1)
	}
}
export function saveSearch(query) {
	let searches = storage.get(SEARCH_KEY,[])
	insertArray(searches,query,(item) => {
		return item === query 
	},SEARCH_MAX_LENGTH)
	storage.set(SEARCH_KEY,searches)
	return searches
}
export function loadSearch(){
	return  storage.get(SEARCH_KEY,[])
}

export function deleteSearch(query) {
	let searches = storage.get(SEARCH_KEY,[])

	deleteArray(searches,(item)=>{
		return item === query 
	})
	
	storage.set(SEARCH_KEY,searches)
	return searches
}


export function deleteWholeSearch() {
	storage.remove(SEARCH_KEY)
	return []
}

export function deletewholePlayList() {
	storage.remove(PLAY_list)
	return []
}

export function savePlayHistory(query){
	let playkey = storage.get(PLAYHISTORY,[])
	
	insertArray(playkey,query,(item)=>{
		return item.id === query.id
	},PLAY_MAX_LENGTH)
	storage.set(PLAYHISTORY,playkey)
	return playkey

}
export function loadPlayHistory(){
	let arr = []
	storage.get(PLAYHISTORY,[]).forEach((e,v)=>{
		arr.unshift(new Song(e))


	})
	return arr
}
export function loadFavoriteList(){
	return storage.get(FAVORITELIST,[])
}
export function saveFavorite(query){
	let favorites = storage.get(FAVORITELIST,[])
	
	insertArray(favorites,query,(item)=>{
		return item.id === query.id
	},FAVO_MAX_LENGTH)
	storage.set(FAVORITELIST,favorites)
	return favorites

}

export function deleteFavorite(query) {

	let favorites = storage.get(FAVORITELIST,[])

	deleteArray(favorites,(item)=>{

		return query.id === item.id
	})
	let index = favorites.findIndex((item)=>{
		return query.id === item.id
	})

	storage.set(FAVORITELIST,favorites)
	return favorites
}
