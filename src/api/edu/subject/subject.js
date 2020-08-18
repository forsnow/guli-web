import request from '@/utils/request'
import { data } from 'autoprefixer'

const subject_api = '/eduservice/edu-subject'
export default{
    //得到所有科目信息
    getNestedTreeList(){
        return request({
            url: `${subject_api}/getAllSubject`,
            method: 'get'
          })
    } 
}
