<template>
  <el-container>
    <el-main>
      <el-row  type="flex" justify="center">
        <el-col class="el-col-md-12">
          <el-card>
            <div id="title">
              <el-col>
                <span>移动到</span>
              </el-col>
            </div>
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
                </el-row>
              </el-col>
            </el-row>
            <div class="list">
              <el-row  v-for="(catalog, index) in catalogs" :key="catalog.id">
                <el-col v-if="catalog.id !== moveId">
                  <el-card class="list_item" shadow="hover">
                    <el-row>
                      <el-col class="el-icon-folder el-col-md-2"></el-col>
                      <el-col class="el-col-md-12">
                        <el-link  @click="goChildCatalog(index)" :underline="false">{{catalog.name}}</el-link>
                      </el-col>
                    </el-row>
                  </el-card>
                </el-col>
              </el-row>
            </div>
            <el-row type="flex" justify="end">
              <el-col class="el-col-md-6">
                <router-link :to="{ name: 'home'}">
                  <el-button style="width: 80%;margin-top: 20px">取消</el-button>
                </router-link>
              </el-col>
              <el-col class="el-col-md-6">
                <el-button @click="move" style="width: 80%;margin-top: 20px" type="primary">确定</el-button>
              </el-col>
            </el-row>
          </el-card>
        </el-col>
      </el-row>
    </el-main>
    <div id="dialogs">
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
    </div>
  </el-container>
</template>
<script>
    import {addCatalog, getCatalogs, moveCatalog} from "../api/catalog";
    import {moveFile} from "../api/file";

    export default {
        data() {
            return {
                catalogs: [],
                currentCatalog: { name: '根目录', id: 0},
                parentCatalogs: [],
                addCatalogDialogVisible: false,
                addCatalogName: '',
                moveType: '',
                moveId: '',
            }
        },
        mounted: function () {
            if (!this.$route.query.moveType || !this.$route.query.id) {
                this.$router.push({ name: 'home'})
            }
            this.moveType = this.$route.query.moveType
            this.moveId = this.$route.query.id
            this.listCatalog()
        },
        methods: {
            move() {
                if (this.moveType.toLowerCase() === 'catalog') {
                    this.moveCatalog()
                }
                if (this.moveType.toLowerCase() === 'file') {
                    this.moveFile()
                }
            },
            back() {
                this.currentCatalog = this.parentCatalogs.pop()
                this.listCatalog()
            },
            backParent(index) {
                this.currentCatalog = this.parentCatalogs[index]
                this.parentCatalogs = this.parentCatalogs.slice(0, index)
                this.listCatalog()
            },
            goChildCatalog(index) {
                this.parentCatalogs.push(this.currentCatalog)
                this.currentCatalog = this.catalogs[index]
                this.listCatalog()
            },
            listCatalog(){
                getCatalogs(this.currentCatalog.id).then((r) => {
                    this.catalogs.splice(0, this.catalogs.length)
                    for (let i = 0; i < r.data.length; ++i) {
                        this.catalogs.splice(this.catalogs.length, 0, r.data[i])
                    }
                })
            },
            addCatalog() {
                addCatalog(this.currentCatalog.id, this.addCatalogName).then((r) => {
                    this.listCatalog()
                    this.addCatalogDialogVisible = false
                })
            },
            moveCatalog() {
                moveCatalog(this.moveId, this.currentCatalog.id).then((r) => {
                    this.$router.push({name: 'home'})
                })
            },
            moveFile() {
                moveFile(this.moveId, this.currentCatalog.id).then((r) => {
                    this.$router.push({name: 'home'})
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
  #title {
    margin-bottom: 30px;
  }
</style>
