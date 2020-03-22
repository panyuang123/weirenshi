<template>
  <el-container class='home-container'>
    <el-header>
      <div class="title">微人事</div>
      <div>
        <el-button icon="el-icon-bell"
                   type="text"
                   style="margin-right: 8px;color: #000000;"
                   size="normal"
                   @click="goChat"></el-button>
        <el-dropdown class="userInfo"
                     @command="commandHandler">
          <span class="el-dropdown-link">
            {{user.name}}<i><img :src="user.userface"
                   alt=""></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="userinfo">个人中心</el-dropdown-item>
            <el-dropdown-item command="setting">设置</el-dropdown-item>
            <el-dropdown-item command="logout"
                              divided>注销登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-header>
    <el-container>
      <el-aside :width="isCollapse ? '65px':'200px'">
        <div class="toggle-button"
             @click="toggleCollapse">
          <i class="el-icon-more"></i>
        </div>
        <el-menu background-color="#d3dce6"
                 text-color="#333"
                 active-text-color="#409EFF"
                 unique-opened
                 :collapse="isCollapse"
                 :collapse-transition="false"
                 router>
          <el-submenu :index="index+''"
                      v-for="(item,index) in routes"
                      v-if="!item.hidden"
                      :key="index">
            <template slot="title">
              <i style="color: #409eff;margin-right: 5px"
                 :class="item.iconCls"></i>
              <span>{{item.name}}</span>
            </template>
            <el-menu-item :index="child.path"
                          v-for="(child,indexj) in item.children"
                          :key="indexj">
              <span style="margin-left:20px">{{child.name}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <el-breadcrumb separator-class="el-icon-arrow-right"
                       v-if="this.$router.currentRoute.path!='/home'">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>{{this.$router.currentRoute.name}}</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="homeWelcome"
             v-if="this.$router.currentRoute.path=='/home'">
          欢迎来到微人事！
        </div>
        <router-view class="homeRouterView" />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "Home",
  data () {
    return {
      // user: JSON.parse(window.sessionStorage.getItem("user"))
      isCollapse: false
    }
  },
  computed: {
    routes () {
      return this.$store.state.routes;
    },
    user () {
      return this.$store.state.currentHr;
    }
  },
  methods: {
    goChat () {
      this.$router.push("/chat");
    },
    commandHandler (cmd) {
      if (cmd == 'logout') {
        this.$confirm('此操作将注销登录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.getRequest("/logout");
          window.sessionStorage.removeItem("user")
          this.$store.commit('initRoutes', []);
          this.$router.replace("/");
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          });
        });
      } else if (cmd == 'userinfo') {
        this.$router.push('/hrinfo');
      }
    },
    // 切换菜单的折叠与展开
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    }
  }
}
</script>

<style>
.home-container {
  height: 100%;
}

.homeRouterView {
  margin-top: 10px;
}

.homeWelcome {
  text-align: center;
  font-size: 30px;
  font-family: 华文行楷;
  color: #409eff;
  padding-top: 50px;
}

.el-header {
  background-color: #b3c0d1;
  color: #333;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 20px;
}

.el-header .title {
  font-size: 30px;
  font-family: 华文行楷;
  color: #ffffff;
}

.el-header .userInfo {
  cursor: pointer;
}

.el-dropdown-link img {
  width: 48px;
  height: 48px;
  border-radius: 24px;
  margin-left: 8px;
}

.el-dropdown-link {
  display: flex;
  align-items: center;
}

.toggle-button {
  background-color: #b7a6e0;
  color: #333;
  height: 24px;
  text-align: center;
  cursor: pointer;
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
  height: 100%;
}
</style>