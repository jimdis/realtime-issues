/* global $, M, fetch, io */
'use strict'

const apiURI = '/api/'
let userData = {}
let socket = io()

socket.on('issue', async (msg) => {
  console.log(msg)
  // Check if msg is related to an issue
  if (msg.issue) {
    renderIssueCard(msg)
    let repo = userData.repos.find(repo => repo.id === msg.repository.id)
    await getIssues(repo)
    // Re-render list of issues if currently visible
    if (document.querySelector(`#issues-${repo.id}`)) renderIssues(repo.id)
  }
})

// $('#index-banner .header').click(() => renderIssueCard(
//   {
//     action: 'closed',
//     issue: { id: 12345, html_url: 'https://github.com/1dv023/jd222qe-examination-3/issues/5' },
//     sender: { login: 'jimdis', avatar_url: 'https://avatars0.githubusercontent.com/u/42964925?v=4' },
//     repository: { name: 'jd222qe-examination3' }
//   }
// ))

function renderIssueCard (data) {
  let temp = document.querySelector('#newIssueTemplate').content.cloneNode(true)
  let id = `card-${Math.random().toString(36).replace('0.', '')}`
  temp.firstElementChild.id = id
  temp.querySelector('.newIssueTitle').textContent = `Issue ${data.action}`
  temp.querySelector('.gh-avatar').src = data.sender.avatar_url
  temp.querySelector('.newIssueBody').textContent = `${data.sender.login} just ${data.action} an issue in ${data.repository.name}`
  temp.querySelector('.newIssueGoto').href = data.issue.html_url
  $('#newIssuesDiv').append(temp)
  $(`#${id} .newIssueDismiss`).click((e) => {
    e.preventDefault()
    $(`#${id}`).remove()
  })
}

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
      obj.id = repo.id
      obj.full_name = repo.full_name
      obj.description = repo.description
      obj.hooks_url = repo.hooks_url
      userData.repos.push(obj)
    }
  })
}

async function getRepoHooks (url) {
  let res = await getData(url)
  console.log('Hooks:', res)
}

async function getIssues (repo) {
  let res = await getData(`repos/${repo.full_name}/issues`)
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

async function createWebHook (repoFullName) {
  let res = await fetch(`api/repo/?wh=true&path=${repoFullName}&action=create`)
  res = await res.json()
  if (res.active) return res
}

async function deleteWebHook (repoFullName, hookID) {
  let res = await fetch(`api/repo/?wh=true&path=${repoFullName}&action=delete&id=${hookID}`)
  console.log('DELETE WH RES STATUS', res)
  if (res.status === 204) return true
}

async function renderRepos () {
  $('.fixed-action-btn').removeClass('hide')
  $('.tooltipped').tooltip()
  $('#issuesDiv').append($('#reposTemplate').html())
  await getUserData()
  $('#user-preloader').remove()
  $('#issuesDiv .collection').removeClass('hide')
  $('#issuesDiv img.gh-avatar').attr('src', userData.avatar)
  $('#gh-name-repos').text(`${userData.name}'s Repos with open issues`)
  // $('#repo-preloader').toggleClass('hide')
  await getUserRepos()
  $('#repo-preloader').remove()
  userData.repos.forEach(repo => {
    let temp = document.querySelector('#repoListTemplate').content.cloneNode(true)
    temp.querySelector('.repo-title').textContent = `Repo: ${repo.full_name}`
    temp.querySelector('.repo-description').textContent = repo.description
    temp.querySelector('a').setAttribute('data-issues', repo.id)
    $('#issuesDiv div.collection').append(temp)
  })
  // Event listeners for clicks
  $('#issuesDiv div.collection a').click((e) => {
    e.preventDefault()

    $('a.collection-item').removeClass('active')
    $(e.currentTarget).addClass('active')
    renderIssues($(e.currentTarget).data('issues'))
  })
}

async function renderIssues (repoID) {
  let repo = userData.repos.find(repo => repo.id === repoID)
  $('#issues-wrapper .issuesCollection').remove()
  $('#reposHeader').after($('#issuesTemplate').html())
  $('#issues-wrapper .issuesCollection').attr('id', `issues-${repo.id}`)
  $('#issues-wrapper .issuesCollection .title').text(`Issues in ${repo.full_name}`)

  if (!repo.issues) await getIssues(repo)
  $('#issues-preloader').remove()
  repo.issues.forEach(issue => {
    let li = document.querySelector('#issuesListTemplate').content.cloneNode(true)
    li.querySelector('.title').textContent = issue.title
    li.querySelector('.gh-avatar').src = issue.avatar
    li.querySelector('.gh-avatar').title = issue.username
    li.querySelector('.body').textContent = issue.body ? issue.body : 'No description provided :('
    li.querySelector('a').href = issue.url
    li.querySelector('.badge').textContent = issue.comments
    $('#issues-wrapper .issuesCollection ul').append(li)
  })

  $('#issues-wrapper .notificationIcon').tooltip()
  $('#issues-wrapper .notificationIcon').click((e) => {
    e.preventDefault()
    toggleWebHook(repo)
  })
}

async function toggleWebHook (repo) {
  if (!repo.hookID) {
    let res = await createWebHook(repo.full_name)
    if (res) {
      repo.hookID = res.id
      $('#issues-wrapper .notificationIcon .badge').removeClass('red')
      $('#issues-wrapper .notificationIcon .badge').addClass('green')
      $('#issues-wrapper .notificationIcon .badge').attr('data-badge-caption', 'on')
      M.toast({ html: '<span class="green-text">Alert created!</span>' })
    } else {
      M.toast({ html: '<span class="red-text">There was a problem creating the alert</span>' })
    }
  } else {
    let res = await deleteWebHook(repo.full_name, repo.hookID)
    if (res) {
      repo.hookID = null
      $('#issues-wrapper .notificationIcon .badge').removeClass('green')
      $('#issues-wrapper .notificationIcon .badge').addClass('red')
      $('#issues-wrapper .notificationIcon .badge').attr('data-badge-caption', 'off')
      M.toast({ html: '<span class="green-text">Alert removed!</span>' })
    } else {
      M.toast({ html: '<span class="red-text">There was a problem removing the alert</span>' })
    }
  }
}

async function checkAuthorization () {
  console.log('running checkAuth')
  let res = await fetch(`auth/status`)
  res = await res.json()
  $('#main-preloader').remove()
  if (res.authorized) {
    renderRepos()
  } else {
    $('#errorMessage, #mainButton').removeClass('hide')
    $('#mainButton').text('Authorize again through GitHub»')
  }
}

async function checkSession () {
  let res = await fetch(`auth/session`)
  res = await res.json()
  if (!res.active) {
    $('#subTitle, #mainButton').removeClass('hide')
    $('#main-preloader').remove()
  } else checkAuthorization()
}

checkSession()
