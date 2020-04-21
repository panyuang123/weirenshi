<template>
  <div>
    <!-- <el-row>
      <el-col :span="8">
        <el-card shadow="hover">
          鼠标悬浮时显示
        </el-card>
      </el-col>
    </el-row> -->
    <el-row>
      <el-col :span="12">
        <div id="empNum"></div>
      </el-col>
      <el-col :span="12">
        <div id="depEmp"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "StaAll",
  data () {
    return {
      empNum: '',
      depEmp: ''
    }
  },
  methods: {
    empNumLine () {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById('empNum'))
      // 绘制图表
      myChart.setOption({
        title: {
          text: '员工总数'
        },
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.empNum.quarter
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
        yAxis: {
          scale: true
        },
        series: [{
          name: '人数',
          type: 'line',
          barWidth: 20,
          data: this.empNum.num
        }]
      });
    },
    depEmpLine () {
      // 基于准备好的dom，初始化echarts实例
      let myChart = this.$echarts.init(document.getElementById('depEmp'))
      // 绘制图表
      myChart.setOption({
        title: {
          text: '部门人数'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: this.depEmp.department,
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
            data: this.depEmp.quarter
          }
        ],
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
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: this.depEmp.department[0],
            type: 'line',
            stack: '总量',
            areaStyle: { normal: {} },
            data: this.depEmp.data[0]
          },
          {
            name: this.depEmp.department[1],
            type: 'line',
            stack: '总量',
            areaStyle: { normal: {} },
            data: this.depEmp.data[1]
          },
          {
            name: this.depEmp.department[2],
            type: 'line',
            stack: '总量',
            areaStyle: { normal: {} },
            data: this.depEmp.data[2]
          },
          {
            name: this.depEmp.department[3],
            type: 'line',
            stack: '总量',
            areaStyle: { normal: {} },
            data: this.depEmp.data[3]
          },
          {
            name: this.depEmp.department[4],
            type: 'line',
            stack: '总量',
            areaStyle: { normal: {} },
            data: this.depEmp.data[4]
          }
        ]
      });
    },
    initSalary () {
      let url = '/salaryTable/data/';
      this.getRequest(url).then(resp => {
        if (resp) {
          this.empNum = resp.employee
          this.depEmp = resp.department
          this.empNumLine()
          this.depEmpLine()
        }
      })
    }
  },
  mounted () {
    this.initSalary()
  },
}
</script>

<style scoped>
#empNum,
#depEmp {
  height: 400px;
}
</style>