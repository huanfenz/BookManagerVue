<template>
  <div class="app-container">
    <!-- 顶部功能 -->
    <div class="filter-container" style="margin-bottom: 15px">
      <!-- 用户名输入 -->
      <el-input v-model="queryParam.username" placeholder="用户名" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <!-- 一些按钮 -->
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleShowAll">
        显示全部
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        添加用户
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="danger" icon="el-icon-delete" @click="handleDeleteSome">
        批量删除
      </el-button>
    </div>

    <!--弹出框-->
    <el-dialog :title="formTitle" :visible.sync="dialogFormVisible" width="30%">
      <!--普通表单-->
      <el-form :model="form" :rules="rules" ref="ruleForm" label-width="80px">

        <el-form-item label="用户名称" prop="username">
          <el-input v-model="form.username"></el-input>
        </el-form-item>

        <el-form-item label="用户密码" prop="userpassword">
          <el-input v-model="form.userpassword"></el-input>
        </el-form-item>

        <el-form-item label="身份" prop="isadmin">
          <el-radio v-model="form.isadmin" :label="1">管理员</el-radio>
          <el-radio v-model="form.isadmin" :label="0">读者</el-radio>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>

    <!--数据表格-->
    <el-table
        ref="multipleTable"
        :data="tableData"
        border
        style="width: 100%">
      <el-table-column
          fixed
          type="selection"
          width="55">
      </el-table-column>
      <el-table-column
          fixed
          prop="userid"
          label="序号"
          width="100">
      </el-table-column>
      <el-table-column
          prop="username"
          label="用户名称"
          show-overflow-tooltip>
      </el-table-column>
      <el-table-column
          prop="userpassword"
          label="用户密码"
          show-overflow-tooltip>
      </el-table-column>
      <el-table-column
          label="用户身份"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <el-tag v-if="scope.row.isadmin === 1" type="warning">管理员</el-tag>
            <el-tag v-else type="success">读者</el-tag>
          </template>
      </el-table-column>
      <el-table-column
          fixed="right"
          label="操作"
          width="150">
        <template slot-scope="scope">
          <el-button @click="handleUpdate(scope.row)" type="primary" size="small">编辑</el-button>
          <el-button @click="handleDelete(scope.row,scope.$index)" type="danger" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--分页条-->
    <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="queryParam.page"
        :page-sizes="[5, 10, 20, 50]"
        :page-size="queryParam.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="recordTotal"
        style="margin-top: 15px">
    </el-pagination>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import waves from '@/directive/waves' // waves directive
import { getCount,queryUsers,queryUsersByPage,addUser,deleteUser,deleteUsers,updateUser }
from '@/api/user'

export default {
  name: 'Bookinfo',
  directives: { waves },
  // 创建后
  created() {
    // 从服务器获取数据表格第一页的信息
    queryUsersByPage(this.queryParam).then(res => {
      console.log('首页数据获取成功',res)
      this.tableData = res.data
      this.recordTotal = res.count
    })
  },
  methods: {
    // 分页大小改变监听
    handleSizeChange(curSize) {
      const params = this.queryParam
      params.limit = curSize
      queryUsersByPage(params).then(res => {
            console.log('分页数据获取成功',res)
            this.tableData = res.data
            this.recordTotal = res.count
      })
    },

    // 点击分页监听方法
    handleCurrentChange(curPage) {
      const params = this.queryParam
      params.page = curPage
      queryUsersByPage(params).then(res => {
            console.log('分页数据获取成功',res)
            this.tableData = res.data
            this.recordTotal = res.count
      })
    },

    // 搜索
    handleFilter() {
      this.queryParam.page = 1
      queryUsersByPage(this.queryParam).then(res => {
        if(res.code === 0) {
          this.tableData = res.data
          this.recordTotal = res.count
        }
      })
    },

    // 显示全部
    handleShowAll() {
      this.queryParam.page = 1
      this.queryParam.username = null
      queryUsersByPage(this.queryParam).then(res => {
        if(res.code === 0) {
          this.tableData = res.data
          this.recordTotal = res.count
        }
      })
    },

    // 点击添加记录
    handleCreate() {
      // 表单是添加状态
      this.formType = 0
      // 将空数据置入form
      this.form = {
        userid: null,
        username: '王鹏',
        userpassword: '123456',
        isadmin: 1,
      }
      // 显示表单框
      this.dialogFormVisible = true
    },

    // 点击编辑记录
    handleUpdate(row) {
      // 表单是编辑状态
      this.formType = 1
      // 将行数据置入form
      this.form = {
        userid: row.userid,
        username: row.username,
        userpassword: row.userpassword,
        isadmin: row.isadmin,
      }
      // 显示表单框
      this.dialogFormVisible = true
    },

    // 添加和更新的提交表单
    submitForm() {
      if (this.formType === 0) {  // 添加记录
        addUser(this.form).then(res => {
          if(res === 1) {
            this.$message.success('添加记录成功')
            // 跳转到末尾
            getCount().then(res => {
              this.recordTotal = res
              this.queryParam.page = Math.ceil(this.recordTotal / this.queryParam.limit)
              this.handleCurrentChange(this.queryParam.page)
            })
          } else {
            this.$message.error('添加记录失败')
          }
          this.dialogFormVisible = false  // 关闭对话框
        })
      } else if(this.formType === 1) {  //更新记录
        updateUser(this.form).then(res => {
          if(res === 1) {
            this.$message.success('更新记录成功')
            this.handleCurrentChange(this.queryParam.page)
          } else {
            this.$message.error('更新记录失败')
          }
          this.dialogFormVisible = false  // 关闭对话框
        })
      }
    },

    // 删除记录
    handleDelete(row, index) {
      this.$confirm('确定要删除该条记录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteUser(row).then(res => {
          if(res === 1) {
            this.$message.success('删除记录成功')
            this.tableData.splice(index, 1)
            // 如果删完了，获取上一页
            if(this.tableData.length === 0) {
              this.queryParam.page = this.queryParam.page - 1
              this.handleCurrentChange(this.queryParam.page)
            }
          } else {
            this.$message.error('删除记录失败')
          }
        })
      })
    },

    // 删除一些
    handleDeleteSome() {
      this.$confirm('确定要删除这些记录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 获取选中的对象数组
        const items = this.$refs.multipleTable.selection
        deleteUsers(items).then(res => {
          if(res > 0) {
            this.$message.success('删除' + res + '条记录成功')
            if(this.tableData.length === res) {  //如果本页内容全部删光了
              //当前页为上一页
              if(this.queryParam.page !== 0) {
                this.queryParam.page = this.queryParam.page - 1
              }
            }
            // 重载当前页
            this.handleCurrentChange(this.queryParam.page)
          } else {
            this.$message.error('删除记录失败')
          }
        })
      })
    },

  },
  data() {
    return {
      // 表格数据
      tableData: [],
      // 记录总数
      recordTotal: 0,
      // 查询参数
      queryParam: {
        page: 1,
        limit: 10,
        username: null
      },
      // 对话框表单显示
      dialogFormVisible: false,
      // 表单类型（添加数据:0,修改数据:1）
      formType: 0,
      // 表单数据
      form: {
        userid: null,
        username: '',
        userpassword: '',
        isadmin: 1
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        userpassword: [
          { required: true, message: '请输入用户密码', trigger: 'blur' }
        ]
      },
    }
  },
  computed: {
    // 获得user信息
    ...mapGetters(['id','name','roles']),
    // 通过表单类型计算表单标题
    formTitle() {
      return this.formType === 0 ? '添加记录' : '修改记录'
    }
  }
}

</script>

<style scoped>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 150px;
    height: 200px;
    display: block;
  }
</style>
