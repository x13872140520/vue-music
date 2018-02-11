import * as types from './mutation-types'
import {shuffle} from 'common/js/util'
import {playMode} from 'common/js/config'
import {getSingerPlay} from 'api/singer'
import {ERR_OK} from 'api/config'
import {saveSearch,deleteSearch,deleteWholeSearch,deletewholePlayList,savePlayHistory,loadPlayHistory,deleteFavorite,saveFavorite} from "common/js/cache"
function findIndex(list,song){
	return  list.findIndex((item) => {
		return  item.id === song.id
	})
}
export const selectPlay = function ({commit,state},{list,index,url})	{

	commit(types.SET_SEQUENCE_LIST,list)
	if(state.mode === playMode.random ){
		let randomList = shuffle(list)
		commit(types.SET_PLAYLIST,randomList)
		index = findIndex(randomList,list[index])
	}else{
		commit(types.SET_PLAYLIST,list)
	}
	
	commit(types.SET_CURRENT_INDEX,index)
	commit(types.SET_FULL_SCREEN,true)
	commit(types.SET_PLAYING_STATE,true)
	commit(types.SET_CURRENT_URL,url)

	
}

export const randomPlay = function ({commit},{list})	{
	
	commit(types.SET_PLAY_MODE,playMode.random)
	commit(types.SET_SEQUENCE_LIST,list)
	let randomList = shuffle(list)
	
	getSingerPlay(randomList[0]).then((res)=>{
		
    if(res.code == ERR_OK){
 
    let url ='http://dl.stream.qqmusic.qq.com/C400' + randomList[0].mid+'.m4a?vkey='+res.data.items[0].vkey+'&guid=504753841&uin=0&fromtag=66'
    
    commit(types.SET_CURRENT_URL,url)
    commit(types.SET_PLAYLIST,randomList)
	commit(types.SET_CURRENT_INDEX,0)
   	commit(types.SET_PLAYING_STATE,true)
  }
 })
	commit(types.SET_FULL_SCREEN,true)
	
	

	
}

export const insertSong = function ({commit,state},{song,url}) {
	let playList = state.playList.slice()
	let sequenceList =state.sequenceList.slice()
	let currentIndex = state.currentIndex
	// record information about  current song 
	let currentSong = playList[currentIndex]
	// To check  the current songlist if was there a song wait to insert  . return its index if it was. 
	let fpindex =findIndex(playList,song)

	// because its insert,plus one
	currentIndex++
	playList.splice(currentIndex,0,song)
	//如果已经包含了这首歌
	if(fpindex > -1){
		if(currentIndex > fpindex){
			playList.splice(fpindex,1)
			currentIndex--
		}else{
			playList.splice(fpindex+1,1)
		}
	}

	let currentSIndex = findIndex(sequenceList,currentSong) + 1
	let fsIndex = findIndex(sequenceList,song)

	sequenceList.splice(currentSIndex,0,song)
	if(fsIndex > -1){
		sequenceList.splice(fsIndex,1)
	}
	
	commit(types.SET_PLAYLIST,playList)
	commit(types.SET_SEQUENCE_LIST,sequenceList)
	commit(types.SET_CURRENT_INDEX,currentIndex)
	commit(types.SET_PLAYING_STATE,true)
	commit(types.SET_FULL_SCREEN,true)
	commit(types.SET_CURRENT_URL,url)
	
}

export const saveSearchHistory = function ({commit},query){
	commit(types.SET_SEARCH_HISTORY,saveSearch(query))
}

export const deleteSearchHistory = function ({commit},query){
	commit(types.SET_SEARCH_HISTORY,deleteSearch(query))
}


export const deleteWholeSearchHistory = function ({commit}){
	commit(types.SET_SEARCH_HISTORY,deleteWholeSearch())
}


export const deleteSong = function ({commit,state},song){
	let playList = state.playList.slice()
	let sequenceList =state.sequenceList.slice()
	let currentIndex =state.currentIndex
	const playIndex = playList.findIndex((item)=>{
		return song.id ===item.id
	})
	const sequenceIndex = sequenceList.findIndex((item)=>{
		return song.id ===item.id
	})
	playList.splice(playIndex,1)
	sequenceList.splice(sequenceIndex,1)
	if(currentIndex > playIndex || currentIndex === playList.length){
		currentIndex--
	}
	commit(types.SET_PLAYLIST,playList)
	commit(types.SET_SEQUENCE_LIST,sequenceList)
	commit(types.SET_CURRENT_INDEX,currentIndex)
	if(!playList.length){
		commit(types.SET_PLAYING_STATE,false)
	}else{
		commit(types.SET_PLAYING_STATE,true)
	}
}

export const deleteWholeplayList = function ({commit}){
	commit(types.SET_PLAYLIST,deletewholePlayList())
	commit(types.SET_SEQUENCE_LIST,deletewholePlayList())
}

export const savePlayHistoryAction =function ({commit},songs){
	commit(types.SET_PLAY_HISTORY,savePlayHistory(songs))
}

export const saveFavoriteAction =function ({commit},songs){
	commit(types.SET_FAVORITE_LIST,saveFavorite(songs))
}

export const deleteFavoriteAction = function ({commit},query){
	commit(types.SET_FAVORITE_LIST,deleteFavorite(query))
}