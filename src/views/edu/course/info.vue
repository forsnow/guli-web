<template>

  <div class="app-container">

    <h2 style="text-align: center;">发布新课程</h2>

    <el-steps :active="1" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="提交审核"/>
    </el-steps>

    <el-form label-width="120px">

  <el-form-item label="课程标题">
    <el-input v-model="courseInfo.title" placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写"/>
  </el-form-item>

  <!-- 所属课程分类 TODO -->
  <el-form-item label="课程分类">
    <el-select
      v-model="courseInfo.subjectParentId"
      placeholder="一级分类" @change="getSecondSubject">
      <el-option
        v-for="subject in subjectFisrtList"
        :key="subject.id"
        :label="subject.title"
        :value="subject.id"/>
    </el-select>

     <el-select
      v-model="courseInfo.subjectId"
      placeholder="二级分类">
      <el-option
        v-for="subject in subjectSecondList"
        :key="subject.id"
        :label="subject.title"
        :value="subject.id"/>
    </el-select>
  </el-form-item>

  
  <!-- 课程讲师 TODO -->
  <el-form-item label="课程讲师">
    <el-select
      v-model="courseInfo.teacherId"
      placeholder="请选择">
      <el-option
        v-for="teacher in teacherList"
        :key="teacher.id"
        :label="teacher.name"
        :value="teacher.id"/>
    </el-select>
  </el-form-item>

  <el-form-item label="总课时">
    <el-input-number :min="0" v-model="courseInfo.lessonNum" controls-position="right" placeholder="请填写课程的总课时数"/>
  </el-form-item>

  <!-- 课程简介 TODO -->
  <el-form-item label="课程简介">
     <el-input v-model="courseInfo.description" placeholder="请输入课程描述"/>
  </el-form-item>

  <!-- 课程封面 TODO -->
  <el-form-item label="课程封面">

  <el-upload
    :show-file-list="false"
    :on-success="handleAvatarSuccess"
    :before-upload="beforeAvatarUpload"
    :action="BASE_API+'/eduoss/file'"
    class="avatar-uploader">
    <img :src="courseInfo.cover">
  </el-upload>

</el-form-item>

  <el-form-item label="课程价格">
    <el-input-number :min="0" v-model="courseInfo.price" controls-position="right" placeholder="免费课程请设置为0元"/> 元
  </el-form-item>

  <el-form-item>
    <el-button :disabled="saveBtnDisabled" type="primary" @click="SaveOrUpdate">保存并下一步</el-button>
  </el-form-item>
</el-form>
  </div>
</template>

<script>
import course from "@/api/edu/course/course";
import subject from '@/api/edu/subject/subject' 
import Tinymce from '@/components/Tinymce'

export default {
    components: { Tinymce },
    data(){
        return{
            saveBtnDisabled: false,
            courseInfo:{
                 title: '',
                 subjectId: '',//二级分类id
                 subjectParentId: '',//一级分类id
                 teacherId: '',
                 lessonNum: 0,
                 description: '',
                 cover: '',
                 price: 0,
                 cover: '/static/01.png'
            },
            teacherList: [],
            subjectFisrtList: [],
            subjectSecondList: [],
            BASE_API: process.env.BASE_API,//接口API地址
            courseId:''
        }
    },

    created(){
        console.log('info created')
        this.init();
        
        
    },

    methods:{
        //初始化获取路由传过来的courseId值
        init(){
             if (this.$route.params && this.$route.params.id) {
                  this.courseId = this.$route.params.id;
                  this.getCouseByid();
                  //初始化所有讲师
                 this.getTeacherList();
               }else {
                 //初始化所有讲师
                 this.getTeacherList();
                 //初始化一级分类
                 this.getSubject();
               }
        },

        //根据课程id查询
        getCouseByid(){
            course.getCourseInfoById(this.courseId).then(response =>{
                this.courseInfo = response.data.courseInfo;
                //1.查询所有的一级分类和二级分类 
                subject.getNestedTreeList().then(response => {
                  //获取所有的一级分类
                   this.subjectFisrtList = response.data.list;
                   //所有的一级分类的数组进行遍历，比较当前courseInfo里面的一级分类id和所有的一级分类id
                   for(var i = 0;i<this.subjectFisrtList.length;i++){
                      var firstSubject = this.subjectFisrtList[i]
                      //比较当前courseInfo里面的一级分类id和所有的一级分类id
                      if(this.courseInfo.subjectParentId == firstSubject.id){
                          //获取一级分类中所有的二级分类
                          this.subjectSecondList = firstSubject.children
                      }
                   }

                })      
            })
        },

        //添加课程方法
        addCourse(){
          console.log('next')
            course.addCourseInfo(this.courseInfo).then(response => {
                //提示信息
                this.$message({
                type: 'success',
                message: '添加课程信息成功!'
                })
                //跳转到chapter页面
                this.$router.push({ path: '/course/chapter/'+response.data.courseId })
            })
        },

        //修改课程方法
        updateCourse(){
            course.updateCourseInfo(this.courseInfo).then(response => {
                 //提示信息
                this.$message({
                type: 'success',
                message: '修改课程信息成功!'
                })
                //跳转到chapter页面
                this.$router.push({ path: '/course/chapter/'+this.courseId })
            });
        },


        SaveOrUpdate(){
          //判断添加还是修改
          if(!this.courseInfo.id){
            //添加
            this.addCourse();
          } else {
            this.updateCourse();
          }
            
        },

        getTeacherList(){
            course.getList().then(response => {
            this.teacherList = response.data.items;
        })
        },

        getSubject(){
            subject.getNestedTreeList().then(response =>{
                this.subjectFisrtList = response.data.list;
            })
        },

        //点击某一个一级分类，触发change 显示对应的二级分类
        getSecondSubject(value){
            console.log(value)
            //console.log(this.subjectFisrtList)
            for (var i = 0; i < this.subjectFisrtList.length; i++) {
               if(this.subjectFisrtList[i].id == value){
                   this.subjectSecondList = this.subjectFisrtList[i].children;
                   this.courseInfo.subjectId = ''
               }
            }
        },
        //上传封面成功调用的方法
        handleAvatarSuccess(){
             console.log(res)// 上传响应
             console.log(URL.createObjectURL(file.raw))// base64编码
             this.courseInfo.cover = res.data.url
        },

        //上传之前
        beforeAvatarUpload(){
             const isJPG = file.type === 'image/jpeg'
             const isLt2M = file.size / 1024 / 1024 < 2

             if (!isJPG) {
               this.$message.error('上传头像图片只能是 JPG 格式!')
             }
             if (!isLt2M) {
               this.$message.error('上传头像图片大小不能超过 2MB!')
             }
             return isJPG && isLt2M
        }

    }
}
</script>

<style scoped>
.tinymce-container {
  line-height: 29px;
}
</style>