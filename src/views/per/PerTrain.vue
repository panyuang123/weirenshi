<template>
  <!-- 员工培训 -->
  <div>
    <div style="margin-top: 10px">
      <el-col :span="4"
              :offset="20">
        <el-button type="primary"
                   size="mini"
                   @click="initTrain">
          刷新列表
        </el-button>
        <el-button type="primary"
                   size="mini"
                   @click="showAddTrainView">
          添加培训
        </el-button>
      </el-col>
      <el-table :data="trains"
                v-loading="loading"
                element-loading-text="正在加载..."
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0, 0.8)"
                style="width: 100%">
        <el-table-column type="selection"
                         width="55">
        </el-table-column>
        <el-table-column prop=""
                         fixed
                         label="培训名称">
        </el-table-column>
        <el-table-column prop="teacher"
                         label="培训讲师">
        </el-table-column>
        <el-table-column prop="start_at"
                         label="开始时间">
        </el-table-column>
        <el-table-column prop="end_at"
                         label="结束时间">
        </el-table-column>
        <el-table-column prop="purpose"
                         label="培训目标">
        </el-table-column>
        <el-table-column prop="members"
                         label="参训人员">
        </el-table-column>
        <el-table-column prop="info"
                         label="培训详情">
        </el-table-column>
        <el-table-column label="操作"
                         fixed="right">
          <template slot-scope="scope">
            <el-button @click="showEditTrainView(scope.row)"
                       style="padding: 3px"
                       size="mini">编辑</el-button>
            <el-button @click="deleteTrain(scope.row)"
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
        <el-form :model="train"
                 :rules="rules"
                 ref="trainForm">
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item label="培训名称:"
                            prop="title">
                <el-input size="mini"
                          prefix-icon="el-icon-edit"
                          v-model="train.title"
                          placeholder="请输入培训名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="培训讲师:"
                            prop="teacher">
                <el-input size="mini"
                          prefix-icon="el-icon-edit"
                          v-model="train.teacher"
                          placeholder="请输入员培训讲师"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="开始时间:"
                            prop="start_at">
                <el-date-picker v-model="train.start_at"
                                size="mini"
                                type="date"
                                value-format="yyyy-MM-dd"
                                placeholder="请选择开始时间">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="结束时间:"
                            prop="end_at">
                <el-date-picker v-model="train.end_at"
                                size="mini"
                                type="date"
                                value-format="yyyy-MM-dd"
                                placeholder="请选择结束时间">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="培训目标:"
                            prop="purpose">
                <el-input size="mini"
                          prefix-icon="el-icon-edit"
                          v-model="train.purpose"
                          placeholder="请输入培训目标"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="参训人员:"
                            prop="members">
                <el-input type="textarea"
                          :autosize="{ minRows: 2, maxRows: 4}"
                          prefix-icon="el-icon-edit"
                          v-model="train.members"
                          placeholder="请输入参训人员"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="培训详情:"
                            prop="info">
                <el-input type="textarea"
                          :autosize="{ minRows: 2, maxRows: 4}"
                          prefix-icon="el-icon-edit"
                          v-model="train.info"
                          placeholder="请输入培训详情"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="doAddTrain">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "PerTrain",
  data () {
    return {
      trains: [],
      train: {
        title: '',
        teacher: '',
        start_at: '',
        end_at: '',
        purpose: '',
        members: '',
        info: ''
      },
      rules: {
        title: [{ required: true, message: '请输入培训名称', trigger: 'blur' }],
        teacher: [{ required: true, message: '请输入培训讲师', trigger: 'blur' }],
        start_at: [{ required: true, message: '请输入开始时间', trigger: 'blur' }],
        end_at: [{ required: true, message: '请输入结束时间', trigger: 'blur' }],
        purpose: [{ required: true, message: '请输入培训目标', trigger: 'blur' }],
        members: [{ required: true, message: '请输入参训人员', trigger: 'blur' }],
        info: [{ required: true, message: '请输入培训详情', trigger: 'blur' }]
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
    this.initTrain();
  },
  methods: {
    sizeChange (currentSize) {
      this.size = currentSize;
      this.initTrain();
    },
    currentChange (currentPage) {
      this.page = currentPage;
      this.initTrain();
    },
    showEditTrainView (data) {
      this.title = '编辑培训信息';
      this.train = data;
      this.dialogVisible = true;
    },
    deleteTrain (data) {
      this.$confirm('此操作将永久删除【' + data.title + '】, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRequest("/train/" + data.id).then(resp => {
          if (resp) {
            this.initTrain();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    doAddTrain () {
      if (this.train.id) {
        this.$refs['trainForm'].validate(valid => {
          if (valid) {
            this.putRequest("/train/", this.train).then(resp => {
              if (resp) {//编辑
                this.dialogVisible = false;
                this.initTrain();
              }
            })
          }
        });
      } else {
        this.$refs['trainForm'].validate(valid => {
          if (valid) {//添加
            this.postRequest("/train/", this.train).then(resp => {
              if (resp) {
                this.dialogVisible = false;
                this.initTrain();
              }
            })
          }
        });
      }
    },
    emptyTrain () {
      this.train = {
        title: '',
        teacher: '',
        start_at: '',
        end_at: '',
        purpose: '',
        members: '',
        info: ''
      }
    },
    showAddTrainView () {
      this.emptyTrain();
      this.title = '添加培训';
      this.dialogVisible = true;
    },
    initTrain (type) {
      this.loading = true;
      let url = '/train/?page=' + this.page + '&size=' + this.size;
      this.getRequest(url).then(resp => {
        this.loading = false;
        if (resp) {
          this.trains = resp.data;
          this.total = resp.total;
        }
      })
    }
  }
}
</script>

<style scoped>
</style>