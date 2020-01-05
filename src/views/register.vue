<template>
  <el-container>
    <el-main>
      <el-row type="flex" justify="center">
        <el-col :span="6">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>注册</span>
            </div>
            <el-form label-width="60px" label-position="left">
              <el-form-item label="用户名">
                <el-input v-model="username"  autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="密码">
                <el-input type="password" v-model="password"  autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="onSubmit">注册</el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
    import {register} from "../api/user";

    export default {
      data() {
          return {
              username: '',
              password: ''
          }
      },
      methods: {
          onSubmit() {
              register(this.username, this.password).then((r) => {
                  this.$message({
                      message: '注册成功',
                      type: 'success',
                      onClose: () => {
                          this.$router.push({ name: 'login'})
                      }
                  })
              })
          }
      }
    }
</script>
