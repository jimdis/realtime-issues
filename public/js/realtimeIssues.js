/* global $, M, fetch, io */
'use strict'

const apiURI = '/api/'
const hookURL = 'https://65fc704f.ngrok.io/api'
let userData = {}
let socket = io()

// Listens to issues through websocket and calls function to render issue card.
socket.on('issue', async (msg) => {
  // Check if msg is related to an actual issue
  if (msg.issue) {
    renderIssueCard(msg)
    let repo = userData.repos.find(repo => repo.id === msg.repository.id)
    await getIssues(repo)
    // Re-render list of issues if currently visible
    if (document.querySelector(`#issues-${repo.id}`)) renderIssues(repo.id)
  }
})

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
      userData.repos.push(obj)
    }
  })
}

async function getRepoHooks (repo) {
  let res = await getData(`repos/${repo.full_name}/hooks`)
  let hook = res.find(hook => hook.config.url === hookURL)
  if (hook) {
    repo.hookID = hook.id
    if (document.querySelector(`#issues-${repo.id}`)) renderHookBadge('on')
  }
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
  $('#issues-wrapper').removeClass('hide')
  $('#reposHeader').addClass('rendered')
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
    getRepoHooks(repo)
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
  if (repo.hookID) renderHookBadge('on')
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
    li.addEventListener('click', () => {
      let title = issue.title
      console.log('you clicked', title)
    })
  })

  $('#issues-wrapper .tooltipped').tooltip()
  $('#issues-wrapper .notificationIcon').click((e) => {
    e.preventDefault()
    toggleWebHook(repo)
  })
}

function renderIssueCard (data) {
  let temp = document.querySelector('#newIssueTemplate').content.cloneNode(true)
  let id = `card-${Math.random().toString(36).replace('0.', '')}`
  temp.firstElementChild.id = id
  temp.querySelector('.newIssueTitle').textContent = `${data.comment ? 'Comment' : 'Issue'} ${data.action}`
  temp.querySelector('.gh-avatar').src = data.sender.avatar_url
  temp.querySelector('.newIssueBody').textContent = `${data.sender.login} just ${data.action} ${data.comment ? ' a Comment' : 'an Issue'} in ${data.repository.name}`
  temp.querySelector('.newIssueGoto').href = data.comment ? data.comment.html_url : data.issue.html_url
  $('#newIssuesDiv').append(temp)
  $(`#${id} .newIssueDismiss`).click((e) => {
    e.preventDefault()
    $(`#${id}`).remove()
  })
}

async function toggleWebHook (repo) {
  if (!repo.hookID) {
    let res = await createWebHook(repo.full_name)
    if (res) {
      repo.hookID = res.id
      renderHookBadge('on')
      M.toast({ html: '<span class="green-text">Alert created!</span>' })
    } else {
      M.toast({ html: '<span class="red-text">There was a problem creating the alert</span>' })
    }
  } else {
    let res = await deleteWebHook(repo.full_name, repo.hookID)
    if (res) {
      repo.hookID = null
      renderHookBadge('off')
      M.toast({ html: '<span class="green-text">Alert removed!</span>' })
    } else {
      M.toast({ html: '<span class="red-text">There was a problem removing the alert</span>' })
    }
  }
}

function renderHookBadge (action) {
  if (action === 'on') {
    $('#issues-wrapper .notificationIcon').removeClass('red')
    $('#issues-wrapper .notificationIcon').addClass('green')
    $('#issues-wrapper .notificationIcon').attr('data-badge-caption', 'on')
    $('#issues-wrapper .notificationIcon').attr('data-tooltip', 'Remove issue notifications for this repo')
  }
  if (action === 'off') {
    $('#issues-wrapper .notificationIcon ').removeClass('green')
    $('#issues-wrapper .notificationIcon ').addClass('red')
    $('#issues-wrapper .notificationIcon ').attr('data-badge-caption', 'off')
    $('#issues-wrapper .notificationIcon').attr('data-tooltip', 'Remove issue notifications for this repo')
  }
}

// Checks if client has valid oauth-token on GH.
async function checkAuthorization () {
  let res = await fetch(`auth/status`)
  res = await res.json()
  $('#main-preloader').remove()
  if (res.authorized) {
    userData.username = res.username
    $('#index-banner .badge span').text(userData.username)
    $('#index-banner .badge').removeClass('hide')
    $('#index-banner').addClass('logged-in')
    renderRepos()
  } else {
    $('#index-banner .row').removeClass('hide')
    $('#errorMessage').removeClass('hide')
    $('#mainButton').text('Authorize again through GitHub»')
  }
}

// Checks if client has a valid session.
async function checkSession () {
  let res = await fetch(`auth/session`)
  res = await res.json()
  if (!res.active) {
    $('#index-banner .row, #subTitle').removeClass('hide')
    $('#main-preloader').remove()
  } else checkAuthorization()
}

checkSession()
