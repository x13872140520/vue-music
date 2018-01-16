import * as types from './mutation-types'
import {shuffle} from 'common/js/util'
import {playMode} from 'common/js/config'
import {getSingerPlay} from 'api/singer'
import {ERR_OK} from 'api/config'
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