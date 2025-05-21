<template>
    <div>
      <!-- 选项卡 (Tabs) -->
      <el-tabs
        v-model="activeTab"
        @tab-click="onTabClick"
        stretch>
        <el-tab-pane label="全部 (All)" name="">
        </el-tab-pane>
        <el-tab-pane label="待审批 (Pending)" name="pending">
        </el-tab-pane>
        <el-tab-pane label="已批准 (Approved)" name="approved">
        </el-tab-pane>
        <el-tab-pane label="已拒绝 (Rejected)" name="rejected">
        </el-tab-pane>
      </el-tabs>
  
      <!-- 请假条列表 (Leave List) -->
      <el-table
        :data="leaves"
        stripe>
        <el-table-column prop="applicant" label="申请人 (Applicant)"></el-table-column>
        <el-table-column prop="start_date" label="开始日期 (Start Date)"></el-table-column>
        <el-table-column prop="end_date" label="结束日期 (End Date)"></el-table-column>
        <el-table-column prop="reason" label="请假原因 (Reason)"></el-table-column>
        <el-table-column prop="status" label="状态 (Status)"></el-table-column>
      </el-table>
  
      <!-- 分页 (Pagination) -->
      <el-pagination
        background
        layout="prev, pager, next, sizes, total"
        :total="total"
        :page-size="pageSize"
        :current-page="currentPage"
        @size-change="onSizeChange"
        @current-change="onPageChange">
      </el-pagination>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        activeTab: '',       // 当前选中选项卡 name (status filter)
        leaves: [],          // 当前页数据 (current page data)
        total: 0,            // 总记录数 (total count)
        currentPage: 1,      // 当前页码 (current page)
        pageSize: 10,        // 每页大小 (page size)
      };
    },
    created() {
      this.fetchLeaves();
    },
    methods: {
      // 选项卡点击回调 (tab-click handler)
      onTabClick(tab) {
        this.currentPage = 1;    // 切换 tab 时重置到第一页 (reset to page 1)
        this.fetchLeaves();
      },
  
      // 分页页码变化 (current page change)
      onPageChange(page) {
        this.currentPage = page;
        this.fetchLeaves();
      },
  
      // 分页大小变化 (page size change)
      onSizeChange(size) {
        this.pageSize = size;
        this.currentPage = 1;    // 重置到第一页 (reset to page 1)
        this.fetchLeaves();
      },
  
      // 查询函数 (fetch function)
      fetchLeaves() {
        axios.get('/api/leaves/', {
          params: {
            page: this.currentPage,
            page_size: this.pageSize,
            status: this.activeTab,  // 传递 status 参数，后端根据它过滤 (filter by status)
          }
        }).then(resp => {
          this.leaves = resp.data.results;
          this.total = resp.data.count;
        }).catch(err => {
          console.error('查询假条失败 (fetch leaves failed):', err);
        });
      },
    },
  };
  </script>
  