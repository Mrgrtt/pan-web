<template>
<el-container>
  <el-main>
    <el-row  type="flex" justify="center">
      <el-col class="el-col-md-12">
        <el-card>
          <el-row>
            <el-col class="el-col-md-12">
              <el-row type="flex" justify="left">
                <el-col class="el-col-md-24">
                  <el-breadcrumb separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item v-for="(item, index) in parentCatalogs">
                      <el-link @click="backParent(index)">{{item.name}}</el-link>
                    </el-breadcrumb-item>
                    <el-breadcrumb-item> <el-link disabled>{{this.currentCatalog.name}}</el-link> </el-breadcrumb-item>
                  </el-breadcrumb>
                </el-col>
              </el-row>
            </el-col>
            <el-col class="el-col-md-12">
              <el-row type="flex" justify="end">
                <el-col class="el-col-md-4"><el-button @click="logout" type="text">注销</el-button></el-col>
                <el-col class="el-col-md-4">
                  <el-button @click="changePasswordDialogVisible = true" type="text">修改密码</el-button>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-divider></el-divider>
          <el-row id="add" type="flex">
            <el-col class="el-col-md-12">
              <el-row type="flex" justify="left">
                <el-col>
                  <el-button type="text" @click="back" v-if="parentCatalogs.length > 0" icon="el-icon-back">返回上级目录</el-button>
                </el-col>
              </el-row>
            </el-col>
            <el-col class="el-col-md-12">
              <el-row type="flex" justify="end">
                <el-col class="el-col-md-6">
                  <el-button @click="addCatalogDialogVisible = true" size="small" icon="el-icon-plus">目录</el-button>
                </el-col>
                <el-col class="el-col-md-12">
                  <el-upload
                    :on-success="fileUploadDone"
                    :on-error="fileUploadError"
                    :headers="headers"
                    :data="{catalogId: currentCatalog.id}"
                    action="http://localhost:8080/file/upload">
                    <el-button type="primary" size="small">上传<i class="el-icon-upload el-icon--right"></i></el-button>
                  </el-upload>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <div class="list">
            <el-row  v-for="(catalog, index) in catalogs" :key="catalog.id">
              <el-col>
                <el-card class="list_item" shadow="hover">
                  <el-row>
                    <el-col class="el-icon-folder el-col-md-2"></el-col>
                    <el-col class="el-col-md-12">
                      <el-link  @click="goChildCatalog(index)" :underline="false">{{catalog.name}}</el-link>
                    </el-col>
                    <el-col class="el-col-md-10">
                      <el-row type="flex" justify="end">
                        <el-col class="el-col-md-3">
                          <el-popover
                            placement="top"
                            trigger="click">
                            <el-link @click="showRenameCatalogDialog(index)">重命名</el-link><br/>
                            <router-link :to="{name: 'move', query: {moveType: 'catalog', id: catalog.id}}">
                              <el-link>移动到</el-link>
                            </router-link>
                            <el-link slot="reference" :underline="false" class="el-icon-edit-outline"></el-link>
                          </el-popover>
                        </el-col>
                        <el-col class="el-col-md-3">
                          <el-link @click="deleteCatalog(catalogs[index].id)" style="color: red" :underline="false" class="el-icon-delete"/>
                        </el-col>
                        <el-col class="el-col-md-3">
                          <el-popover
                            placement="right"
                            trigger="hover">
                            <span>创建时间：{{catalog.gmtCreate.replace('T', ' ')}}</span><br/>
                            <span>最后修改时间：{{catalog.gmtModified.replace('T', ' ')}}</span>
                            <el-link slot="reference" :underline="false" class="el-icon-info"></el-link>
                          </el-popover>
                        </el-col>
                      </el-row>
                    </el-col>
                  </el-row>
                </el-card>
              </el-col>
            </el-row>
          </div>
          <div>
            <el-row  v-for="(file, index) in files" :key="file.id">
              <el-col>
                <el-card shadow="hover" class="list_item">
                  <el-row>
                    <el-col class="el-icon-document el-col-md-2"></el-col>
                    <el-col class="el-col-md-12">
                      <el-link :underline="false">{{file.name}}</el-link>
                    </el-col>
                    <el-col class="el-col-md-10">
                      <el-row type="flex" justify="end">
                        <el-col class="el-col-md-3">
                          <el-link :href="'http://localhost:8080/file/download/' + file.storageKey" :underline="false" class="el-icon-download "/>
                        </el-col>
                        <el-col class="el-col-md-3">
                          <el-popover
                            placement="top"
                            trigger="click">
                            <el-link @click="showRenameFileDialog(index)">重命名</el-link><br/>
                            <router-link :to="{name: 'move', query: {moveType: 'file', id: file.id}}">
                              <el-link>移动到</el-link>
                            </router-link>
                            <el-link slot="reference" :underline="false" class="el-icon-edit-outline"></el-link>
                          </el-popover>
                        </el-col>
                        <el-col class="el-col-md-3">
                          <el-link @click="deleteFile(files[index].id)" style="color: red" :underline="false" class="el-icon-delete"/>
                        </el-col>
                        <el-col class="el-col-md-3">
                          <el-popover
                            placement="right"
                            trigger="hover">
                            <span>创建时间：{{file.gmtCreate.replace('T', ' ')}}</span><br/>
                            <span>最后修改时间：{{file.gmtModified.replace('T', ' ')}}</span><br/>
                            <span>类型：{{file.mediaType}}</span><br/>
                            <span>大小：{{file.size | fileSizeToText}}</span>
                            <el-link slot="reference" :underline="false" class="el-icon-info"></el-link>
                          </el-popover>
                        </el-col>
                      </el-row>
                    </el-col>
                  </el-row>
                </el-card>
              </el-col>
            </el-row>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </el-main>
  <div id="dialogs">
    <el-dialog
      title="修改密码"
      :visible.sync="changePasswordDialogVisible"
      width="30%">
      <el-form :model="changePasswordForm" status-icon :rules="changePasswordRules"
               ref="changePasswordForm" label-width="100px">
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input type="password" v-model="changePasswordForm.oldPassword" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input type="password" v-model="changePasswordForm.newPassword" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认新密码" prop="checkNewPassword">
          <el-input type="password" v-model="changePasswordForm.checkNewPassword" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="changePasswordDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitChangePassword('changePasswordForm')">提交</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="addCatalogDialogVisible"
      width="20%"
      title="新建目录">
      <el-input v-model="addCatalogName" placeholder="请输入目录名"/>
      <span slot="footer">
        <el-button @click="addCatalogDialogVisible= false">取 消</el-button>
        <el-button @click="addCatalog" type="primary">创建</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="renameCatalogDialogVisible"
      width="20%"
      title="重命名目录">
      <el-input v-model="newCatalogName" placeholder="请输入目录名"/>
      <span slot="footer">
        <el-button @click="renameCatalogDialogVisible= false">取 消</el-button>
        <el-button @click="renameCatalog(editingCatalog.id)" type="primary">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="renameFileDialogVisible"
      width="20%"
      title="重命名文件">
      <el-input v-model="newFileName" placeholder="请输入文件名"/>
      <span slot="footer">
        <el-button @click="renameFileDialogVisible= false">取 消</el-button>
        <el-button @click="renameFile(editingFile.id)" type="primary">确定</el-button>
      </span>
    </el-dialog>
  </div>
</el-container>
</template>

<script>
    import {addCatalog, deleteCatalog, getCatalogs, moveCatalog, renameCatalog} from "../api/catalog";
  import {getToken, removeToken} from "../util/auth";
    import {deleteFile, getFiles, renameFile} from "../api/file";
  import {changePassword} from "../api/user";

  export default {
      data() {
           var validatePassword = (rule, value, callback) => {
              if (value === '') {
                  callback(new Error('请输入密码'));
              } else if (value.length < 8) {
                  callback(new Error('密码最短为8位'));
              } else {
                  callback()
              }
          };
          var validateCheckNewPassword = (rule, value, callback) => {
              if (value === '') {
                  callback(new Error('请再次输入新密码'));
              } else if (value !== this.changePasswordForm.newPassword) {
                  callback(new Error('两次输入的新密码不一致!'));
              } else {
                  callback();
              }
          };
          return {
              catalogs: [],
              files: [],
              currentCatalog: { name: '根目录', id: 0},
              parentCatalogs: [],
              changePasswordDialogVisible: false,
              changePasswordForm: {
                  oldPassword: '',
                  newPassword: '',
                  checkNewPassword: ''
              },
              changePasswordRules: {
                  oldPassword: [
                      { validator: validatePassword, trigger: 'blur' }
                  ],
                  newPassword: [
                      { validator: validatePassword, trigger: 'blur'}
                  ],
                  checkNewPassword: [
                      { validator: validateCheckNewPassword, trigger: 'blur' }
                  ]
              },
              addCatalogDialogVisible: false,
              addCatalogName: '',
              newCatalogName: '',
              renameCatalogDialogVisible: false,
              editingCatalog: null,
              newFileName: '',
              renameFileDialogVisible: false,
              editingFile: null,
              headers: { 'Authorization': 'Bearer ' + getToken()}
          }
      },
      mounted: function () {
          this.listCatalogAndFile()
      },
      filters: {
          fileSizeToText(size) {
              let K = 1024
              let M = 1024 * K
              let G = 1024 * M
              if (size > G) {
                  return (size / G).toFixed(2) + 'GB'
              }
              if (size > M) {
                  return (size / M).toFixed(2) + 'MB'
              }
              if (size > K) {
                  return (size / K).toFixed(2) + 'KB'
              }
              return size + 'B'
          }
      },
      methods: {
          back() {
              this.currentCatalog = this.parentCatalogs.pop()
              this.listCatalogAndFile()
          },
          backParent(index) {
              this.currentCatalog = this.parentCatalogs[index]
              this.parentCatalogs = this.parentCatalogs.slice(0, index)
              this.listCatalogAndFile()
          },
          goChildCatalog(index) {
              this.parentCatalogs.push(this.currentCatalog)
              this.currentCatalog = this.catalogs[index]
              this.listCatalogAndFile()
          },
          listCatalogAndFile() {
              this.listCatalog(this.currentCatalog.id)
              this.listFiles(this.currentCatalog.id)
          },
          listFiles(id) {
              getFiles(id).then((r) => {
                  this.files.splice(0, this.files.length)
                  for (let i = 0; i < r.data.length; ++i) {
                      this.files.splice(this.files.length, 0, r.data[i])
                  }
              })
          },
          listCatalog(id){
              getCatalogs(id).then((r) => {
                  this.catalogs.splice(0, this.catalogs.length)
                  for (let i = 0; i < r.data.length; ++i) {
                      this.catalogs.splice(this.catalogs.length, 0, r.data[i])
                  }
              })
          },
          logout() {
              removeToken()
              location.reload()
          },
          submitChangePassword(formName) {
              this.$refs[formName].validate((valid) => {
                  if (valid) {
                      changePassword(this.changePasswordForm).then((r) => {
                          this.$message({
                              message: '密码修改成功',
                              type: 'success',
                              onClose: () => {
                                  this.logout()
                              }
                          });
                          this.changePasswordDialogVisible = false
                      })

                  }
              });
          },
          fileUploadDone(response, file, fileList) {
              this.$message({
                  message: '文件上传成功',
                  type: 'success'
              });
              this.listCatalogAndFile()
          },
          fileUploadError(response, file, fileList) {
              this.$message({
                  message: '文件上传失败',
                  type: 'error'
              });
          },
          deleteFile(id) {
              this.$confirm('确认删除？').then(_ => {
                  deleteFile(id).then((r) => {
                      this.listCatalogAndFile()
                  })
              })
          },
          deleteCatalog(id) {
              this.$confirm('确认删除？').then(_ => {
                  deleteCatalog(id).then((r) => {
                      this.listCatalogAndFile()
                  })
              })
          },
          addCatalog() {
              addCatalog(this.currentCatalog.id, this.addCatalogName).then((r) => {
                  this.listCatalogAndFile()
                  this.addCatalogDialogVisible = false
              })
          },
          showRenameCatalogDialog(index) {
              this.editingCatalog = this.catalogs[index]
              this.renameCatalogDialogVisible = true
          },
          showRenameFileDialog(index) {
              this.editingFile = this.files[index]
              this.renameFileDialogVisible = true
          },
          renameCatalog(id) {
              renameCatalog(id, this.newCatalogName).then((r) => {
                  this.listCatalogAndFile()
                  this.renameCatalogDialogVisible = false
              })
          },
          renameFile(id) {
              renameFile(id, this.newFileName).then((r) => {
                  this.listCatalogAndFile()
                  this.renameFileDialogVisible = false
              })
          }
      }
  }
</script>

<style>
  .list, #add {
    margin-top: 20px;
  }
  .list_item {
    margin-top: 2px;
    background: #DCDFE6;
  }
</style>
