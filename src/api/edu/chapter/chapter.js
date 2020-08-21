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
    }
}
