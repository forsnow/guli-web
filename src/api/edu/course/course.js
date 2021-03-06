import request from '@/utils/request'
import { data } from 'autoprefixer'

const course_api = '/eduservice/edu-course'
const teacher_api = '/eduservice/edu-teacher'

export default{
    //得到所有科目信息
    addCourseInfo(courseInfo){
        return request({
            url: `${course_api}/addCourseInfo`,
            method: 'post',
            data: courseInfo
          })
    },

    //查询下拉列表中所有讲师信息
    getList(){
        return request({
            url: `${teacher_api}/findAll`,
            method: 'get',
        })
    },
    
    //根据id查询课程
    getCourseInfoById(courseId){
        return request({
            url: `${course_api}/getCourseInfo/${courseId}`,
            method: 'get'
        })
    },

    //修改课程信息
    updateCourseInfo(courseInfo){
        return request({
            url: `${course_api}/updateCourseInfo`,
            method: 'post',
            data: courseInfo
        })
    },
    //修改课程信息
    getCoursePublishInfo(courseId){
        return request({
            url: `${course_api}/getCoursePublishInfo/${courseId}`,
            method: 'get',
        })
    },

    //发布课程信息
    publishCourse(courseId){
        return request({
            url: `${course_api}/publishCourse/${courseId}`,
            method: 'post',
        })
    },
    
    //获取课程列表
    getCourseListPage(page,limit,teacherQuery){
        return request({
            url: `${course_api}/getCourseListPage/${page}/${limit}`,
            method: 'get',
            data:teacherQuery
        })
    },

    //条件分页查询讲师信息
    getCourseListConditionPage(page,limit,courseQuery){
        return request({
            url: `${course_api}/getCourseListConditionPage/${page}/${limit}`,
            method: 'post',
            data: courseQuery
          })
    },

    //根据讲师ID删除课程信息
    delCourseById(courseID){
        return request({
            url: `${course_api}/${courseID}`,
            method: 'delete'
        })
    },


}
