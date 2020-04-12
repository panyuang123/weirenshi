<template>
  <!-- 员工调薪 -->
  <div>
    <div style="margin-top: 10px">
      <el-col :span="19">
        <el-input placeholder="请输入员工名进行搜索，可以直接回车搜索..."
                  prefix-icon="el-icon-search"
                  clearable
                  @clear="initSalary"
                  style="width: 350px;margin-right: 10px"
                  v-model="keyword"
                  @keydown.enter.native="initSalary">
        </el-input>
        <el-button icon="el-icon-search"
                   type="primary"
                   @click="initSalary">
          搜索
        </el-button>
      </el-col>
      <el-col :span="5">
        <el-button type="primary"
                   size="mini"
                   @click="initSalary">
          刷新列表
        </el-button>
        <el-button type="primary"
                   size="mini"
                   @click="showAddSalaryView">
          添加调薪记录
        </el-button>
      </el-col>
      <el-table :data="salarys"
                v-loading="loading"
                element-loading-text="正在加载..."
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0, 0.8)"
                style="width: 100%">
        <el-table-column type="selection"
                         width="55">
        </el-table-column>
        <el-table-column prop="name"
                         fixed
                         label="员工姓名">
        </el-table-column>
        <el-table-column prop="department"
                         label="部门">
        </el-table-column>
        <el-table-column prop="position"
                         label="职位">
        </el-table-column>
        <el-table-column prop="beginDate"
                         label="入职日期">
        </el-table-column>
        <el-table-column prop="change_time"
                         label="调薪日期">
        </el-table-column>
        <el-table-column prop="old_salary"
                         label="原薪酬标准">
        </el-table-column>
        <el-table-column prop="now_salary"
                         label="调整后标准">
        </el-table-column>
        <el-table-column prop="reason"
                         label="调薪原因">
        </el-table-column>
        <el-table-column prop="remark"
                         label="备注">
        </el-table-column>
        <el-table-column label="操作"
                         fixed="right">
          <template slot-scope="scope">
            <el-button @click="showEditSalaryView(scope.row)"
                       style="padding: 3px"
                       size="mini">编辑</el-button>
            <el-button @click="deleteSalary(scope.row)"
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
        <el-form :model="salary"
                 :rules="rules"
                 ref="salaryForm">
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item label="员工姓名:"
                            prop="name">
                <el-input size="mini"
                          prefix-icon="el-icon-edit"
                          v-model="salary.name"
                          placeholder="请输入员工姓名"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="所属部门:"
                            prop="department">
                <el-popover placement="right"
                            title="请选择部门"
                            width="200"
                            trigger="manual"
                            v-model="popVisible">
                  <el-tree default-expand-all
                           :data="allDeps"
                           :props="defaultProps"
                           @node-click="handleNodeClick"></el-tree>
                  <div slot="reference"
                       style="width: 175px;display: inline-flex;font-size: 13px;border: 1px solid #dedede;height: 26px;border-radius: 5px;cursor: pointer;align-items: center;padding-left: 8px;box-sizing: border-box"
                       @click="showDepView">{{inputDepName}}
                  </div>
                </el-popover>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="职位:"
                            prop="position">
                <el-select v-model="salary.position_id"
                           placeholder="职位"
                           size="mini"
                           style="width: 150px;">
                  <el-option v-for="item in positions"
                             :key="item.id"
                             :label="item.name"
                             :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="入职日期:"
                            prop="beginDate">
                <el-date-picker v-model="salary.beginDate"
                                size="mini"
                                type="date"
                                value-format="yyyy-MM-dd"
                                placeholder="请选择入职日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item label="调薪日期:"
                            prop="change_time">
                <el-date-picker v-model="salary.change_time"
                                size="mini"
                                type="date"
                                value-format="yyyy-MM-dd"
                                placeholder="请选择调薪日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="原薪酬标准:"
                            prop="old_salary">
                <el-input size="mini"
                          prefix-icon="el-icon-edit"
                          v-model="salary.old_salary"
                          placeholder="请输入原薪酬标准"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="调整后标准:"
                            prop="now_salary">
                <el-input size="mini"
                          prefix-icon="el-icon-edit"
                          v-model="salary.now_salary"
                          placeholder="请输入调整后标准"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="调薪原因:"
                            prop="reason">
                <el-input size="mini"
                          prefix-icon="el-icon-edit"
                          v-model="salary.reason"
                          placeholder="请输入调薪原因"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="备注:"
                            prop="remark">
                <el-input size="mini"
                          prefix-icon="el-icon-edit"
                          v-model="salary.remark"
                          placeholder="备注"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="doAddSalary">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "PerSalary",
  data () {
    return {
      salarys: [],
      allDeps: '',
      positions: [],
      keyword: '',
      inputDepName: '所属部门',
      salary: {
        name: '',
        department: '',
        position: '',
        beginDate: '',
        change_time: '',
        old_salary: '',
        now_salary: '',
        reason: '',
        remark: '',
        department_id: ''
      },
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      popVisible: false,
      rules: {
        name: [{ required: true, message: '请输入员工姓名', trigger: 'blur' }],
        position: [{ required: true, message: '请选择职位', trigger: 'blur' }],
        beginDate: [{ required: true, message: '请选择入职时间', trigger: 'blur' }],
        change_time: [{ required: true, message: '请选择调薪日期', trigger: 'blur' }],
        old_salary: [{ required: true, message: '请输入原薪酬标准', trigger: 'blur' }],
        now_salary: [{ required: true, message: '请输入调整后标准', trigger: 'blur' }],
        reason: [{ required: true, message: '请输入调薪原因', trigger: 'blur' }]
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
    this.initSalary();
    this.initData()
  },
  methods: {
    sizeChange (currentSize) {
      this.size = currentSize;
      this.initSalary();
    },
    currentChange (currentPage) {
      this.page = currentPage;
      this.initSalary();
    },
    showEditSalaryView (data) {
      this.initPositions();
      this.title = '编辑培训信息';
      this.salary = data;
      this.dialogVisible = true;
      this.inputDepName = data.department;
    },
    deleteSalary (data) {
      this.$confirm('此操作将永久删除【' + data.title + '】, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRequest("/salaryChange/" + data.id).then(resp => {
          if (resp) {
            this.initSalary();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    doAddSalary () {
      if (this.salary.id) {
        this.$refs['salaryForm'].validate(valid => {
          if (valid) {
            this.putRequest("/salaryChange/", this.salary).then(resp => {
              if (resp) {//编辑
                this.dialogVisible = false;
                this.initSalary();
              }
            })
          }
        });
      } else {
        this.$refs['salaryForm'].validate(valid => {
          if (valid) {//添加
            this.postRequest("/salaryChange/", this.salary).then(resp => {
              if (resp) {
                this.dialogVisible = false;
                this.initSalary();
              }
            })
          }
        });
      }
    },
    emptySalary () {
      this.salary = {
        name: '',
        department: '',
        position: '',
        beginDate: '',
        change_time: '',
        old_salary: '',
        now_salary: '',
        reason: '',
        remark: '',
        department_id: ''
      }
      this.inputDepName = '';
    },
    showAddSalaryView () {
      this.emptySalary();
      this.initPositions();
      this.title = '添加调薪记录';
      this.dialogVisible = true;
    },
    initSalary (type) {
      this.loading = true;
      let url = '/salaryChange/?page=' + this.page + '&size=' + this.size + "&name=" + this.keyword;
      this.getRequest(url).then(resp => {
        this.loading = false;
        if (resp) {
          this.salarys = resp.data;
          this.total = resp.total;
        }
      })
    },
    initData () {
      if (!window.sessionStorage.getItem("deps")) {
        this.getRequest('/employee/basic/deps').then(resp => {
          if (resp) {
            this.allDeps = resp;
            window.sessionStorage.setItem("deps", JSON.stringify(resp));
          }
        })
      } else {
        this.allDeps = JSON.parse(window.sessionStorage.getItem("deps"));
      }
    },
    initPositions () {
      this.getRequest('/employee/basic/positions').then(resp => {
        if (resp) {
          this.positions = resp;
          console.log(this.positions)
        }
      })
    },
    handleNodeClick (data) {
      this.inputDepName = data.name;
      this.salary.department = data.name;
      this.salary.department_id = data.id;
      this.popVisible = !this.popVisible
    },
    showDepView () {
      this.popVisible = !this.popVisible
    }
  }
}
</script>

<style scoped>
</style>