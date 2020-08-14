import request from '@/utils/request'
import { data } from 'autoprefixer'

const teacherAddition_api = '/eduservice/edu-teacher/pageTeacherCondition'
const teacher_api = '/eduservice/edu-teacher'
export default{
    //条件分页查询讲师信息
    getPageList(page,limit,teacherQuery){
        return request({
            url: `${teacherAddition_api}/${page}/${limit}`,
            method: 'post',
            data: teacherQuery
          })
    },

    //根据讲师ID删除讲师信息
    delTeacherById(teacherID){
        return request({
            url: `${teacher_api}/${teacherID}`,
            method: 'delete'
        })
    },

    //添加讲师信息
    saveTeacher(Teacher){
        return request({
            url: `${teacher_api}/addTeacher`,
            method: 'post',
            data: Teacher
        })
    },
    
    //根据讲师id查询
    selectTeacherByID(teacherID){
        return request({
            url: `${teacher_api}/getTeacher/${teacherID}`,
            method: 'get',
        })
    },

    //修改讲师
    updateTeacher(Teacher){
        return request({
            url: `${teacher_api}/updateTeacher`,
            method: 'post',
            data: Teacher
        })
    }
   
}
