import * as api from './api'

export default class UserData {
  async getUserData () {
    let res = await api.getData('user')
    this.avatar = res.avatar_url
    this.name = res.name
  }
  async getRepos () {
    let res = await api.getData('user/repos')
    this.repos = []
    res.forEach(repo => {
      if (repo.open_issues_count > 0) {
        let obj = {}
        obj.id = repo.id
        obj.full_name = repo.full_name
        obj.description = repo.description
        this.repos.push(obj)
      }
    })
  }
  async getIssues (repo) {
    let res = await api.getData(`repos/${repo.full_name}/issues`)
    let issues = []
    res.forEach(issue => {
      let obj = {}
      obj.id = issue.id
      obj.title = issue.title
      obj.username = issue.user.login
      obj.avatar = issue.user.avatar_url
      obj.body = issue.body
      obj.url = issue.html_url
      obj.comments = issue.comments
      issues.push(obj)
    })
    repo.issues = issues
  }
}
