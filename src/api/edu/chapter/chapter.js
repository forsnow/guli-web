import request from '@/utils/request'
import { data } from 'autoprefixer'

const chapter_api = '/eduservice/edu-chapter'


export default{
    //得到所有章节的内容
    getChapterVideo(courseId){
        return request({
            url: `${chapter_api}/getChapterVideo/${courseId}`,
            method: 'get'
          })
    },

    //添加章节
     addChapter(eduChapter){
        return request({
            url: `${chapter_api}/addChapter/`,
            method: 'post',
            data: eduChapter
          })
    },

     //根据id查询章节
     getChapter(chapterId){
         return request({
             url: `${chapter_api}/getChapter/${chapterId}`,
             method: 'get'
           })
     },
     
     //修改章节
     updateChapter(eduChapter){
        return request({
            url: `${chapter_api}/updateChapter/`,
            method: 'post',
            data: eduChapter
          })
     },

     //删除章节
     deleteChapter(chapterId){
        return request({
            url: `${chapter_api}/deleteChapter/${chapterId}`,
            method: 'delete'
          })
    }



}
