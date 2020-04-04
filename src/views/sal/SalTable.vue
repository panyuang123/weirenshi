<template>
  <div>
    <div style="margin-top: 10px">
      <el-row>
        <el-col :span="5">
          <el-date-picker v-model="month"
                          type="month"
                          value-format="yyyy-MM"
                          placeholder="选择月份"
                          @change="initSals">
          </el-date-picker>
        </el-col>
        <el-col :span="17">
          <el-input placeholder="请输入员工名进行搜索，可以直接回车搜索..."
                    prefix-icon="el-icon-search"
                    clearable
                    @clear="initSals"
                    style="width: 350px;margin-right: 10px"
                    v-model="keyword"
                    @keydown.enter.native="initSals">
          </el-input>
          <el-button icon="el-icon-search"
                     type="primary"
                     @click="initSals">
            搜索
          </el-button>
        </el-col>
        <el-col :span="2">
          <el-button type="primary"
                     size="mini"
                     @click="showAddSalView">
            添加工资表
          </el-button>
        </el-col>
      </el-row>
      <el-table :data="sals"
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
        <el-table-column prop="month"
                         label="月份">
        </el-table-column>
        <el-table-column prop="salary_standard"
                         label="薪资标准">
        </el-table-column>
        <el-table-column prop="access_days"
                         label="考核天数">
        </el-table-column>
        <el-table-column prop="absence_days"
                         label="缺勤天数">
        </el-table-column>
        <el-table-column prop="absence_deduction"
                         label="缺勤扣款">
        </el-table-column>
        <el-table-column prop="work_salary"
                         label="出勤工资">
        </el-table-column>
        <el-table-column prop="sent_salary"
                         label="应发工资">
        </el-table-column>
        <el-table-column prop="other_deduction"
                         label="其他扣款">
        </el-table-column>
        <el-table-column prop="deduction_reason"
                         label="扣款原因">
        </el-table-column>
        <el-table-column prop="other_salary"
                         label="其他工资">
        </el-table-column>
        <el-table-column prop="taxable_salary"
                         label="应税工资">
        </el-table-column>
        <el-table-column prop="personal_tax"
                         label="个人所得税">
        </el-table-column>
        <el-table-column prop="actual_salary"
                         label="实发工资">
        </el-table-column>
        <el-table-column prop="remark"
                         label="备注">
        </el-table-column>
        <el-table-column label="操作"
                         width="100"
                         fixed="right">
          <template slot-scope="scope">
            <el-button @click="showEditSalView(scope.row)"
                       style="padding: 3px"
                       size="mini">编辑</el-button>
            <el-button @click="deleteSal(scope.row)"
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
    <!-- 添加，编辑 -->
    <el-dialog :title="title"
               :visible.sync="dialogVisible"
               width="80%">
      <div>
        <el-form :model="sal"
                 :rules="rules"
                 ref="salForm">
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item label="员工姓名:"
                            prop="name">
                <el-input size="mini"
                          prefix-icon="el-icon-edit"
                          v-model="sal.name"
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
                            prop="position_id">
                <el-select v-model="sal.position_id"
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
          </el-row>
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item label="月份:"
                            prop="month">
                <el-date-picker v-model="sal.month"
                                size="mini"
                                type="month"
                                :clearable='false'
                                value-format="yyyy-MM"
                                placeholder="请选择月份">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="薪资标准:"
                            prop="salary_standard">
                <el-input size="mini"
                          prefix-icon="el-icon-edit"
                          v-model="sal.salary_standard"
                          placeholder="请输入薪资标准"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="考核天数:"
                            prop="access_days">
                <el-input size="mini"
                          prefix-icon="el-icon-edit"
                          v-model.number="sal.access_days"
                          placeholder="请输入考核天数"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="缺勤天数:"
                            prop="absence_days">
                <el-input size="mini"
                          prefix-icon="el-icon-edit"
                          v-model.number="sal.absence_days"
                          placeholder="请输入缺勤天数"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item label="缺勤扣款:"
                            prop="absence_deduction">
                <el-input size="mini"
                          prefix-icon="el-icon-edit"
                          v-model="sal.absence_deduction"
                          placeholder="请输入缺勤扣款"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="出勤工资:"
                            prop="work_salary">
                <el-input size="mini"
                          prefix-icon="el-icon-edit"
                          v-model="sal.work_salary"
                          placeholder="请输入出勤工资"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="应发工资:"
                            prop="sent_salary">
                <el-input size="mini"
                          prefix-icon="el-icon-edit"
                          v-model="sal.sent_salary"
                          placeholder="请输入应发工资"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="其他扣款:"
                            prop="other_deduction">
                <el-input size="mini"
                          prefix-icon="el-icon-edit"
                          v-model="sal.other_deduction"
                          placeholder="其他扣款"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item label="扣款原因:"
                            prop="deduction_reason">
                <el-input size="mini"
                          prefix-icon="el-icon-edit"
                          v-model="sal.deduction_reason"
                          placeholder="扣款原因"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="其他工资:"
                            prop="other_salary">
                <el-input size="mini"
                          prefix-icon="el-icon-edit"
                          v-model="sal.other_salary"
                          placeholder="其他工资"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="应税工资:"
                            prop="taxable_salary">
                <el-input size="mini"
                          prefix-icon="el-icon-edit"
                          v-model="sal.taxable_salary"
                          placeholder="应税工资"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="个人所得税:"
                            prop="personal_tax">
                <el-input size="mini"
                          prefix-icon="el-icon-edit"
                          v-model="sal.personal_tax"
                          placeholder="个人所得税"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item label="实发工资:"
                            prop="actual_salary">
                <el-input size="mini"
                          prefix-icon="el-icon-edit"
                          v-model="sal.actual_salary"
                          placeholder="实发工资"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="18">
              <el-form-item label="备注:"
                            prop="remark">
                <el-input size="mini"
                          prefix-icon="el-icon-edit"
                          v-model="sal.remark"
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
                   @click="doAddSal">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "SalTable",
  data () {
    return {
      sals: [],
      inputDepName: '所属部门',
      positions: [],
      sal: {
        name: '',
        absence_days: '',
        absence_deduction: '',
        access_days: '',
        actual_salary: '',
        deduction_reason: '',
        department: '',
        month: '',
        name: '',
        other_deduction: '',
        other_salary: '',
        personal_tax: '',
        position: '',
        remark: '',
        salary_standard: '',
        taxable_salary: '',
        work_salary: '',
        department_id: ''
      },
      rules: {
        name: [{ required: true, message: '姓名为必填项' }],
        position_id: [{ required: true, message: '职位为必填项' }],
        month: [{ required: true, message: '月份为必填项' }],
        salary_standard: [{ required: true, message: '薪资标准为必填项' }, { pattern: /^(\d+)(.\d{0,2})?$/, message: '薪资标准必须为金额' }],
        access_days: [{ required: true, message: '考核天数为必填项' }, { pattern: /^\d+/, message: '考核天数必须为数字' }],
        absence_days: [{ pattern: /^\d+/, message: '缺勤天数必须为数字' }],
        absence_deduction: [{ pattern: /^(\d+)(.\d{0,2})?$/, message: '缺勤扣款必须为金额' }],
        work_salary: [{ required: true, message: '出勤工资为必填项' }, { pattern: /^(\d+)(.\d{0,2})?$/, message: '出勤工资必须为金额' }],
        sent_salary: [{ required: true, message: '应发工资为必填项' }, { pattern: /^(\d+)(.\d{0,2})?$/, message: '应发工资必须为金额' }],
        other_deduction: [{ pattern: /^(\d+)(.\d{0,2})?$/, message: '其他扣款必须为金额' }],
        other_salary: [{ pattern: /^(\d+)(.\d{0,2})?$/, message: '其他工资必须为金额' }],
        taxable_salary: [{ required: true, message: '应税工资为必填项' }, { pattern: /^(\d+)(.\d{0,2})?$/, message: '应税工资必须为金额' }],
        personal_tax: [{ required: true, message: '个人所得税为必填项' }, { pattern: /^(\d+)(.\d{0,2})?$/, message: '个人所得税必须为金额' }],
        actual_salary: [{ required: true, message: '实发工资为必填项' }, { pattern: /^(\d+)(.\d{0,2})?$/, message: '实发工资必须为金额' }]
      },
      allDeps: '',
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      loading: false,
      dialogVisible: false,
      total: 0,
      page: 1,
      size: 10,
      title: '',
      month: '',
      keyword: '',
      popVisible: false,
      popVisible2: false
    }
  },
  methods: {
    sizeChange (currentSize) {
      this.size = currentSize;
      this.initSals();
    },
    currentChange (currentPage) {
      this.page = currentPage;
      this.initSals();
    },
    // getNowTime () {
    //   var now = new Date();
    //   var year = now.getFullYear(); //得到年份
    //   var month = now.getMonth(); //得到月份
    //   month = month + 1;
    //   month = month.toString().padStart(2, "0");
    //   this.month = year + '-' + month
    // },
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
        }
      })
    },
    initSals (type) {
      this.loading = true;
      if (this.month == null) this.month = ''
      let url = '/salaryTable/?page=' + this.page + '&size=' + this.size + '&month=' + this.month + "&name=" + this.keyword;
      this.getRequest(url).then(resp => {
        this.loading = false;
        if (resp) {
          this.sals = resp.data;
          this.total = resp.total;
        }
      });
    },
    showAddSalView () {
      this.emptySal();
      this.initPositions();
      this.title = '添加工资表';
      this.dialogVisible = true;
    },
    showEditSalView (data) {
      this.initSals();
      this.initPositions();
      this.title = '编辑工资表信息';
      this.sal = data;
      this.inputDepName = data.department;
      this.dialogVisible = true;
      console.log(this.sal.position)
      console.log(this.sal.position_id)
    },
    emptySal () {
      this.sal = {
        name: '',
        absence_days: '',
        absence_deduction: '',
        access_days: '',
        actual_salary: '',
        deduction_reason: '',
        department: '',
        month: '',
        name: '',
        other_deduction: '',
        other_salary: '',
        personal_tax: '',
        position: '',
        remark: '',
        salary_standard: '',
        taxable_salary: '',
        work_salary: '',
        department_id: ''
      }
      this.inputDepName = '';
    },
    doAddSal () {
      if (this.sal.id) {
        this.$refs['salForm'].validate(valid => {
          if (valid) {
            this.putRequest("/salaryTable/", this.sal).then(resp => {
              if (resp) {//编辑
                this.dialogVisible = false;
                this.initSals();
              }
            })
          }
        });
      } else {
        this.$refs['salForm'].validate(valid => {
          if (valid) {//添加
            this.postRequest("/salaryTable/", this.sal).then(resp => {
              if (resp) {
                this.dialogVisible = false;
                this.initSals();
              }
            })
          }
        });
      }
    },
    deleteSal (data) {
      this.$confirm('此操作将永久删除【' + data.name + '/' + data.month + '】, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRequest("/salaryTable/" + data.id).then(resp => {
          if (resp) {
            this.initSals();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    handleNodeClick (data) {
      this.inputDepName = data.name;
      this.sal.department = data.name;
      this.sal.department_id = data.id;
      this.popVisible = !this.popVisible
    },
    showDepView () {
      this.popVisible = !this.popVisible
    }
  },
  mounted () {
    // this.getNowTime()
    this.initSals()
    this.initData()
  }
}
</script>

<style scoped>
</style>