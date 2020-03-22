<template>
  <div>
    <div style="margin-top: 10px">
      <el-col :span="4"
              :offset="20">
        <el-button type="primary"
                   size="mini"
                   @click="initEc">
          刷新列表
        </el-button>
        <el-button type="primary"
                   size="mini"
                   @click="showAddEcView">
          添加奖惩
        </el-button>
      </el-col>
      <el-table :data="Ecs"
                v-loading="loading"
                element-loading-text="正在加载..."
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0, 0.8)"
                style="width: 100%">
        <el-table-column type="selection"
                         width="55">
        </el-table-column>
        <el-table-column prop="members"
                         fixed
                         label="员工名称">
        </el-table-column>
        <el-table-column prop="time"
                         label="奖惩时间">
        </el-table-column>
        <el-table-column prop="reason"
                         label="奖惩原因">
        </el-table-column>
        <el-table-column prop="info"
                         label="奖惩详情">
        </el-table-column>
        <el-table-column label="操作"
                         fixed="right">
          <template slot-scope="scope">
            <el-button @click="showEditEcView(scope.row)"
                       style="padding: 3px"
                       size="mini">编辑</el-button>
            <el-button @click="deleteEc(scope.row)"
                       style="padding: 3px"
                       size="mini"
                       type="danger">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="display: flex;justify-content: flex-end">
        <el-pagination background
                       @current-change="currentChange"
                       @size-change="sizeChange"
                       :page-sizes="[2, 5, 10, 20]"
                       layout="sizes, prev, pager, next, jumper, ->, total, slot"
                       :total="total">
        </el-pagination>
      </div>
    </div>
    <el-dialog :title="title"
               :visible.sync="dialogVisible"
               width="80%">
      <div>
        <el-form :model="Ec"
                 :rules="rules"
                 ref="EcForm">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="员工姓名:"
                            prop="members">
                <el-input size="mini"
                          prefix-icon="el-icon-edit"
                          v-model="Ec.members"
                          placeholder="请输入员工姓名"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="奖惩时间:"
                            prop="time">
                <el-date-picker v-model="Ec.time"
                                size="mini"
                                type="date"
                                value-format="yyyy-MM-dd"
                                placeholder="请选择奖惩时间">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="奖惩原因:"
                            prop="reason">
                <el-input type="textarea"
                          :autosize="{ minRows: 2, maxRows: 4}"
                          prefix-icon="el-icon-edit"
                          v-model="Ec.reason"
                          placeholder="请输入奖惩原因"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="奖惩详情:"
                            prop="info">
                <el-input type="textarea"
                          :autosize="{ minRows: 2, maxRows: 4}"
                          prefix-icon="el-icon-edit"
                          v-model="Ec.info"
                          placeholder="请输入奖惩详情"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="doAddEc">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "PerEc",
  data () {
    return {
      Ecs: [],
      Ec: {
        members: '',
        time: '',
        reason: '',
        info: ''
      },
      rules: {
        members: [{ required: true, message: '请输入员工姓名', trigger: 'blur' }],
        time: [{ required: true, message: '请选择奖惩时间', trigger: 'blur' }],
        reason: [{ required: true, message: '请输入奖惩原因', trigger: 'blur' }],
        info: [{ required: true, message: '请输入奖惩详情', trigger: 'blur' }]
      },
      loading: false,
      dialogVisible: false,
      total: 0,
      page: 1,
      size: 10,
      title: ''
    }
  },
  mounted () {
    this.initEc()
  },
  methods: {
    sizeChange (currentSize) {
      this.size = currentSize;
      this.initEc();
    },
    currentChange (currentPage) {
      this.page = currentPage;
      this.initEc();
    },
    showEditEcView (data) {
      this.title = '编辑奖惩信息';
      this.Ec = data;
      this.dialogVisible = true;
    },
    deleteEc (data) {
      this.$confirm('此操作将永久删除【' + data.members + '】的该条记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRequest("/rewardPunishments/" + data.id).then(resp => {
          if (resp) {
            this.initEc();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    doAddEc () {
      if (this.Ec.id) {
        this.$refs['EcForm'].validate(valid => {
          if (valid) {
            this.putRequest("/rewardPunishments/", this.Ec).then(resp => {
              if (resp) {//编辑
                this.dialogVisible = false;
                this.initEc();
              }
            })
          }
        });
      } else {
        this.$refs['EcForm'].validate(valid => {
          if (valid) {//添加
            this.postRequest("/rewardPunishments/", this.Ec).then(resp => {
              if (resp) {
                this.dialogVisible = false;
                this.initEc();
              }
            })
          }
        });
      }
    },
    emptyEc () {
      this.Ec = {
        members: '',
        time: '',
        reason: '',
        info: ''
      }
    },
    showAddEcView () {
      this.emptyEc();
      this.title = '添加奖惩';
      this.dialogVisible = true;
    },
    initEc (type) {
      this.loading = true;
      let url = '/rewardPunishments/?page=' + this.page + '&size=' + this.size;
      this.getRequest(url).then(resp => {
        this.loading = false;
        if (resp) {
          this.Ecs = resp.data;
          for (var i in this.Ecs) {
            this.Ecs[i].time = this.Ecs[i].time.substr(0, 10)
          }
          this.total = resp.total;
        }
      })
    }
  }
}
</script>

<style scoped>
</style>