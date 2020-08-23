import request from '@/utils/request'
import { data } from 'autoprefixer'

const video_api = '/eduservice/edu-video'


export default{
    //添加小节
    addEduVideo(eduVideo){
        return request({
            url: `${video_api}/addEduVideo/`,
            method: 'post',
            data: eduVideo
          })
    },

    //删除小节
    deleteEduVideo(eduVideoId){
        return request({
            url: `${video_api}/deleteEduVideo/${eduVideoId}`,
            method: 'delete',
          })
    },

    //修改小节
    updateEduVideo(eduVideo){
        return request({
            url: `${video_api}/updateEduVideo/`,
            method: 'post',
            data: eduVideo
          })
    },




}
