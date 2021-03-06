
import jsonp from 'common/js/jsonp'
import {commonParams,options} from './config'
import axios from 'axios'
export function getToplist(musicid){
		const  url ='https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg'
		const  data = Object.assign({},{
		platform:'h5',
		needNewCode:1,
		})
		return jsonp(url,data,options)
	}
export function getTopSong(musicid){
		const  url ='https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg'
		const  data = Object.assign({},{
		platform:'h5',
		needNewCode:1,
		topid:musicid
		})
		return jsonp(url,data,options)
	}
