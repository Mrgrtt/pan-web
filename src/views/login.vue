<template>
  <el-container>
    <el-main>
      <el-row type="flex" justify="center">
        <el-col :span="6">
          <el-card class="box-card">
            <div slot="header">
              <span>注册</span>
            </div>
            <el-form label-width="60px" label-position="left">
              <el-form-item label="用户名">
                <el-input v-model="username"></el-input>
              </el-form-item>
              <el-form-item label="密码">
                <el-input type="password" v-model="password"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="onSubmit">登录</el-button>
                <el-button @click="onRegister">注册</el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
  import { login } from '../api/user'
  import { setToken } from "../util/auth";

  export default {
  data() {
      return {
          username: '',
          password: ''
      }
  },
  methods: {
      onSubmit() {
          login(this.username, this.password).then((r) => {
              setToken(r.data)
              this.$router.push({ path: '/'})
          })
      },
      onRegister() {
          this.$router.push({ name: 'register'})
      }
  }
}
</script>

<style>

</style>
