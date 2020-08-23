<template>

  <div class="app-container">

    <h2 style="text-align: center;">发布新课程</h2>

    <el-steps :active="2" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="最终发布"/>
    </el-steps>

  <el-button type="text" @click="openDialogChapter()">添加章节</el-button>
<!-- 章节 -->
<ul class="chanpterList">
    <li
        v-for="chapter in chapterVideoList"
        :key="chapter.id">
        <p>
            {{ chapter.title }}

            <span class="acts">
                <el-button type="text" @click="openAddVideo(chapter.id)">添加课时</el-button>
                <el-button style="" type="text" @click="openEditChapter(chapter.id)">编辑</el-button>
                <el-button type="text" @click="removeChapter(chapter.id)">删除</el-button>
            </span>
        </p>

        <!-- 视频 -->
        <ul class="chanpterList videoList">
            <li
                v-for="video in chapter.children"
                :key="video.id">
                <p>{{ video.title }}
                    <span class="acts">
                        <el-button type="text" @click="openEditVideo(video.id)">编辑</el-button>
                        <el-button type="text" @click="removeVideo(video.id)">删除</el-button>
                    </span>
                </p>
            </li>
        </ul>
    </li>
</ul>
<div>
    <el-button @click="previous">上一步</el-button>
    <el-button :disabled="saveBtnDisabled" type="primary" @click="next">下一步</el-button>
</div>

<!-- 添加和修改章节表单 -->
<el-dialog :visible.sync="dialogChapterFormVisible" title="添加章节">
    <el-form :model="chapter" label-width="120px">
        <el-form-item label="章节标题">
            <el-input v-model="chapter.title"/>
        </el-form-item>
        <el-form-item label="章节排序">
            <el-input-number v-model="chapter.sort" :min="0" controls-position="right"/>
        </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
        <el-button @click="dialogChapterFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdate">确 定</el-button>
    </div>
</el-dialog>

<!-- 添加和修改课时表单 -->
<el-dialog :visible.sync="dialogVideoFormVisible" title="添加课时">
  <el-form :model="video" label-width="120px">
    <el-form-item label="课时标题">
      <el-input v-model="video.title"/>
    </el-form-item>
    <el-form-item label="课时排序">
      <el-input-number v-model="video.sort" :min="0" controls-position="right"/>
    </el-form-item>
    <el-form-item label="是否免费">
      <el-radio-group v-model="video.free">
        <el-radio :label="true">免费</el-radio>
        <el-radio :label="false">默认</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="上传视频">
      <!-- TODO -->
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogVideoFormVisible = false">取 消</el-button>
    <el-button :disabled="saveVideoBtnDisabled" type="primary" @click="saveOrUpdateVideo">确 定</el-button>
  </div>
</el-dialog>
  </div>
</template>

<script>
import chapter from '@/api/edu/chapter/chapter'
import video from '@/api/edu/video/video'

export default {
     data(){
        return{
            saveBtnDisabled: false,
            chapterVideoList: [],
            courseId:'',
            dialogChapterFormVisible: false,
            dialogVideoFormVisible: false,
            saveVideoBtnDisabled: false,
            //定义章节对象
            chapter: {
                title: '',
                sort: 0
            },
            //课时对象
            video: {
                title: '',
                sort: 0,
                free: 0,
                videoSourceId: ''
            },
            //chapterId: '', // 课时所在的章节id
        }
    },

    created(){
        console.log('chapter created');
        //获取路由的id值
        this.init();
    },

    methods:{
        //====================以下为章节操作========================
        //添加小节弹框的方法
        openAddVideo(chaperId){
           //弹框
           this.dialogVideoFormVisible = true;

           //设置章节id
           this.video.chapterId = chaperId;
           
           //表单数据清空
           this.video.title = '';
           this.video.sort = 0;
           this.video.free = 0;
           this.videoSourceId = ''
        },

        //添加小节
        addEduVideo(){
            //设置课程id
            this.video.courseId = this.courseId;
            video.addEduVideo(this.video).then(response => {
                  //1.关闭弹窗
                this.dialogVideoFormVisible = false
                //2.提示成功或者失败
                this.$message({
                type: 'success',
                message: '添加小节成功!'
                })
                //3.刷新页面
                this.getChapterVideo();
            })

        },

        //修改小节
        updateEduVideo(){
            video.updateEduVideo(this.video).then(response =>{
                   //1.关闭弹窗
                this.dialogVideoFormVisible = false
                //2.提示成功或者失败
                this.$message({
                type: 'success',
                message: '修改章节成功!'
                })
                //3.刷新页面
                this.getChapterVideo();
            })
        },

        saveOrUpdateVideo(){
           if(!this.video.id){
                this.addEduVideo();
            }else {
                this.updateEduVideo();
            }
            
        },

        //删除小节
        removeVideo(eduVideoId){
          this.$confirm('此操作将删除该小节, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          video.deleteEduVideo(eduVideoId).then(response => {
            //提示信息
            this.$message({
            type: 'success',
            message: '删除成功!'
            })
            //回到主页面
            this.getChapterVideo();
            })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
            
        },

        //修改小节弹框做数据回显
        openEditVideo(videoId){
            this.dialogVideoFormVisible = true;
            video.getEduVideo(videoId).then(response => {
                this.video = response.data.eduVideo
            })     
        },

      
        //====================以下为章节操作========================
        //删除章节
        removeChapter(chaperId){
          this.$confirm('此操作将删除该章节, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          chapter.deleteChapter(chaperId).then(response => {
            //提示信息
            this.$message({
            type: 'success',
            message: '删除成功!'
            })
            //回到主页面
            this.getChapterVideo();
            })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
            
        },

        //修改章节弹框做数据回显
        openEditChapter(chaperId){
            this.dialogChapterFormVisible = true;
            chapter.getChapter(chaperId).then(response =>{
                this.chapter = response.data.chapter;
            })
        },

        //弹框的方法
        openDialogChapter(){
            this.dialogChapterFormVisible = true;
            //表单数据清空
            this.chapter.title = ''
            this.chapter.sort = 0
        },

        //添加章节
        addChapter(){
            this.chapter.courseId = this.courseId;
            chapter.addChapter(this.chapter).then(response => {
                //1.关闭弹窗
                this.dialogChapterFormVisible = false
                //2.提示成功或者失败
                this.$message({
                type: 'success',
                message: '添加章节成功!'
                })
                //3.刷新页面
                this.getChapterVideo();

            })
        },

        //修改章节
        updateChapter(){
            chapter.updateChapter(this.chapter).then(response => {
                 //1.关闭弹窗
                this.dialogChapterFormVisible = false
                //2.提示成功或者失败
                this.$message({
                type: 'success',
                message: '修改章节成功!'
                })
                //3.刷新页面
                this.getChapterVideo();
            })
        },

        saveOrUpdate(){
            if(!this.chapter.id){
                 this.addChapter();
            }else {
                this.updateChapter();
            }
        },

        //根据课程id查询章节和小节内容
        init(){
             if (this.$route.params && this.$route.params.id) {
                  this.courseId = this.$route.params.id;
                  // 根据id获取课程基本信息
                  this.getChapterVideo();
               }
        },
        
        getChapterVideo(){
            chapter.getChapterVideo(this.courseId).then(response => {
                this.chapterVideoList = response.data.chapterList
            })
        },

        previous(){
            console.log('previous')
            this.$router.push({ path: '/course/info/'+this.courseId })
        },

        next(){
            console.log('next')
            this.$router.push({ path: '/course/publish/'+this.courseId })
        }
    }
}
</script>

<style scoped>
.chanpterList{
    position: relative;
    list-style: none;
    margin: 0;
    padding: 0;
}
.chanpterList li{
  position: relative;
}
.chanpterList p{
  /* float: left; */
  font-size: 20px;
  margin: 10px 0;
  padding: 10px;
  height: 70px;
  line-height: 50px;
  width: 100%;
  border: 1px solid #DDD;
}
.chanpterList .acts {
    float: right;
    font-size: 14px;
}

.videoList{
  padding-left: 50px;
}
.videoList p{
  float: left;
  font-size: 14px;
  margin: 10px 0;
  padding: 10px;
  height: 50px;
  line-height: 30px;
  width: 100%;
  border: 1px dotted #DDD;
}

</style>