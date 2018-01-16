import {playMode} from 'common/js/config'
const state = {
	singer: {},
	playing:false,
	fullScreen:false,
	playList:[],
	sequenceList:[],
	mode:playMode.random,
	currentIndex:-1,
	currentUrl:'',
	disc:{}
}
export default state