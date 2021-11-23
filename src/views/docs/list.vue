<template>
    <div class="app-container">
        <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%">
            <el-table-column align="center" label="编号" width="80">
                <template slot-scope="scope">
                    <span>{{ scope.row.id }}</span>
                </template>
            </el-table-column>

            <el-table-column width="180px" align="center" label="发布时间">
                <template slot-scope="scope">
                    <span>{{ scope.row.display_time.split('T')[0] }}</span>
                </template>
            </el-table-column>

            <el-table-column width="120px" align="center" label="作者">
                <template slot-scope="scope">
                    <span>{{ scope.row.author }}</span>
                </template>
            </el-table-column>

            <el-table-column width="100px" label="级别">
                <template slot-scope="scope">
                    <svg-icon v-for="n in +scope.row.importance" :key="n" icon-class="star" class="meta-item__icon"/>
                </template>
            </el-table-column>

            <el-table-column min-width="300px" label="标题">
                <template slot-scope="{row}">
                    <el-button type="text" @click="goToEdit(row.id)" class="link-type">
                        {{ row.title }}
                    </el-button>
                </template>
            </el-table-column>

            <el-table-column align="center" label="操作" width="120">
                <template slot-scope="scope">
                    <el-button type="primary" @click="goToEdit(scope.row.id)" size="small" icon="el-icon-edit">
                        Edit
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit"
                    @pagination="getList"/>
    </div>
</template>

<script>
  import {fetchList} from '@/api/article'
  import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

  export default {
    name: 'ArticleList',
    components: {Pagination},
    filters: {
      statusFilter(status) {
        const statusMap = {
          published: 'success',
          draft: 'info',
          deleted: 'danger'
        }
        return statusMap[status]
      }
    },
    data() {
      return {
        list: null,
        total: 0,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 20
        }
      }
    },
    created() {
      this.getList()
    },
    methods: {
      getList() {
        this.listLoading = true
        fetchList(this.listQuery).then(response => {
          this.list = response.data
          this.total = response.data.length
          this.listLoading = false
        })
      },
      goToEdit(id) {
        this.$router.push({
          name: 'EditArticle', params: {id: id}
        })
      }
    }
  }
</script>

<style scoped>
    .edit-input {
        padding-right: 100px;
    }

    .cancel-btn {
        position: absolute;
        right: 15px;
        top: 10px;
    }
</style>
