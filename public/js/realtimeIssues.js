/* global $, fetch */

const apiURI = '/api/'
let userData = {}

async function testAPI () {
  // let res = await fetch(`/api/search/issues?q=author:${username}`)
  let res = await fetch(`/api/repos/jimdis/jd222qe_1dv600/issues`)
  res = await res.json()
  console.log('Test API: ', res)
}

async function getData (request) {
  console.log('Getting Data from: ' + request)
  let res = await fetch(apiURI + request)
  res = await res.json()
  console.log('Returning Data', res)
  return res
}

async function getUserData () {
  let res = await getData('user')
  userData.avatar = res.avatar_url
  userData.name = res.name
}

async function getUserRepos () {
  let res = await getData('user/repos')
  userData.repos = []
  res.forEach(repo => {
    if (repo.open_issues_count > 0) {
      let obj = {}
      obj.full_name = repo.full_name
      obj.description = repo.description
      userData.repos.push(obj)
    }
  })
}

async function getIssues (repo) {
  let res = await getData(`repos/${repo.full_name}/issues`)
  console.log(repo)
  let issues = []
  res.forEach(issue => {
    console.log('getIssues: ', issue)
    let obj = {}
    obj.title = issue.title
    issues.push(obj)
  })
  repo.issues = issues
}

async function renderRepos () {
  $('#issuesDiv').append($('#reposTemplate').html())
  await getUserData()
  $('#progressBar').toggleClass('hide')
  await getUserRepos()
  $('#progressBar').remove()
  userData.repos.forEach(repo => {
    let temp = document.querySelector('#repoListTemplate').content.cloneNode(true)
    temp.querySelector('.repo-title').textContent = `Repo: ${repo.full_name}`
    temp.querySelector('.repo-description').textContent = repo.description
    temp.querySelector('a').setAttribute('data-issues', repo.full_name)
    $('#issuesDiv div.collection').append(temp)
  })
  $('#issuesDiv div.collection a').click((e) => {
    $('#issuesCollection').remove()
    renderIssues(e.currentTarget.getAttribute('data-issues'))
  })
  $('#issuesDiv div.preloader-wrapper').remove()
  $('#issuesDiv img.gh-avatar').attr('src', userData.avatar)
  $('#gh-name-repos').text(`${userData.name}'s Repos with open issues`)
}

async function renderIssues (repoName) {
  $('#issues-wrapper').append($('#issuesTemplate').html())
  $('#issuesCollection .title').text(`Issues in ${repoName}`)
  let repo = userData.repos.find(repo => repo.full_name === repoName)
  if (!repo.issues) await getIssues(repo)
  $('#progressBar').remove()
  repo.issues.forEach(issue => {
    let li = document.querySelector('#issuesListTemplate').content.cloneNode(true)
    li.querySelector('.title').textContent = issue.title
    $('#issuesCollection ul').append(li)
  })
}

async function checkAuthorization () {
  console.log('running checkAuth')
  let res = await fetch(`auth/status`)
  res = await res.json()
  if (res.authorized) {
    renderRepos()
    // getIssues()
  } else console.log('Not authorized')
}

// checkAuthorization()

renderRepos()
