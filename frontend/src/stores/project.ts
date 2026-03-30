import { defineStore } from 'pinia'

export const useProjectStore = defineStore('project', {
  state: () => ({
    pendingFiles: [],
    pendingRequirement: '',
    isPending: false,
    
    currentProjectId: null,
    projectData: null,
    graphData: null,
    
    systemLogs: []
  }),
  
  actions: {
    // 待上传文件管理（原 pendingUpload.js）
    setPendingUpload(files, requirement) {
      // Note: File objects can't be easily serialized in Nuxt SSR, but since this is usually client-side only, it's fine for now.
      this.pendingFiles = files
      this.pendingRequirement = requirement
      this.isPending = true
    },
    
    clearPendingUpload() {
      this.pendingFiles = []
      this.pendingRequirement = ''
      this.isPending = false
    },
    
    // 项目数据管理
    setProjectData(id, data) {
      this.currentProjectId = id
      if (data) this.projectData = data
    },
    
    setGraphData(data) {
      this.graphData = data
    },
    
    // 日志管理
    addLog(msg) {
      const time = new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }) + '.' + new Date().getMilliseconds().toString().padStart(3, '0')
      this.systemLogs.push({ time, msg })
      if (this.systemLogs.length > 100) {
        this.systemLogs.shift()
      }
    }
  }
})
