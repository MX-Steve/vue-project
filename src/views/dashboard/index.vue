<template>
  <div class="dashboard-container">
    <component :is="currentRole" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// 共用的操作面板
import commonDashboard from './main'

export default {
  name: 'Dashboard',
  components: { commonDashboard },
  data() {
    return {
      currentRole: 'commonDashboard'
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ])

  },
  created() {
    if (!this.roles.includes('admin')) {
      this.currentRole = 'commonDashboard'
    }
  }
}
</script>
