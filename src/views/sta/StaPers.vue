<template>
  <div>
    <el-row>
      <el-col :offset="3">
        <div class="block">
          <el-date-picker v-model="month"
                          type="month"
                          value-format="yyyy-MM"
                          placeholder="选择月份"
                          :clearable="false"
                          @change="initPers">
          </el-date-picker>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <div id="empSal"></div>
      </el-col>
      <el-col :span="12">
        <div id="empAddRe"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "StaPers",
  data () {
    return {
      month: '2020-04',
      empSal: '',
      empAddRe: ''
    }
  },
  methods: {
    empSalLine () {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById('empSal'))
      // 绘制图表
      myChart.setOption({
        title: {
          text: '薪资区间人员数量'
        },
        tooltip: {},
        xAxis: {
          data: this.empSal.salary
        },
        axisLabel: {
          interval: 0,
          formatter: function (value) {
            var ret = "";//拼接加\n返回的类目项  
            var maxLength = 5;//每项显示文字个数  
            var valLength = value.length;//X轴类目项的文字个数  
            var rowN = Math.ceil(valLength / maxLength); //类目项需要换行的行数  
            if (rowN > 1)//如果类目项的文字大于3,  
            {
              for (var i = 0; i < rowN; i++) {
                var temp = "";//每次截取的字符串  
                var start = i * maxLength;//开始截取的位置  
                var end = start + maxLength;//结束截取的位置  
                //这里也可以加一个是否是最后一行的判断，但是不加也没有影响，那就不加吧  
                temp = value.substring(start, end) + "\n";
                ret += temp; //凭借最终的字符串  
              }
              return ret;
            }
            else {
              return value;
            }
          }
        },
        yAxis: {},
        series: [{
          name: '人数',
          type: 'bar',
          barWidth: 20,
          data: this.empSal.employee
        }]
      })
    },
    empAddReLine () {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById('empAddRe'))
      // 绘制图表
      myChart.setOption({
        title: {
          text: '部门人数'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['新增', '离职'],
          bottom: '88%'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: this.empAddRe.month
          }
        ],
        axisLabel: {
          interval: 0,
          formatter: function (value) {
            var ret = "";//拼接加\n返回的类目项  
            var maxLength = 3;//每项显示文字个数  
            var valLength = value.length;//X轴类目项的文字个数  
            var rowN = Math.ceil(valLength / maxLength); //类目项需要换行的行数  
            if (rowN > 1)//如果类目项的文字大于3,  
            {
              for (var i = 0; i < rowN; i++) {
                var temp = "";//每次截取的字符串  
                var start = i * maxLength;//开始截取的位置  
                var end = start + maxLength;//结束截取的位置  
                //这里也可以加一个是否是最后一行的判断，但是不加也没有影响，那就不加吧  
                temp = value.substring(start, end) + "\n";
                ret += temp; //凭借最终的字符串  
              }
              return ret;
            }
            else {
              return value;
            }
          }
        },
        yAxis: [
          {
            type: 'value',
            scale: true
          }
        ],
        series: [
          {
            name: '新增',
            type: 'line',
            stack: '人数',
            data: this.empAddRe.add
          },
          {
            name: '离职',
            type: 'line',
            stack: '人数',
            data: this.empAddRe.remove
          }
        ]
      });
    },
    initPers () {
      let url = '/salaryTable/data/hr/salary?month=' + this.month;
      this.getRequest(url).then(resp => {
        if (resp) {
          this.empSal = resp
          this.empSalLine()
        }
      })
    },
    initAddRe () {
      let url = '/salaryTable/data/hr/employee'
      this.getRequest(url).then(resp => {
        if (resp) {
          this.empAddRe = resp
          this.empAddReLine()
        }
      })
    }
  },
  mounted () {
    this.initPers()
    this.initAddRe()
  }
}
</script>

<style scoped>
#empSal,
#empAddRe {
  height: 400px;
}
</style>