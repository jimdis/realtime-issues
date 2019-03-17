import UserData from './UserData'
import * as webhooks from './webhooks'

let userData = new UserData()

// Connects to socket.io with username and token received from Github oauth2.
function connectWS (username, token) {
  const socket = io({
    query: {
      username: username,
      token: token
    }
  })

  // Listens to events through websocket and calls relevant functions.
  socket.on('connect', () => {
    if (socket.connected) M.toast({ html: '<span class="green-text">Connected to realtime issues!</span>' })
  })
  socket.on('error', () => {
    if (!socket.connected) M.toast({ html: '<span class="red-text">There is a problem receiving issues notifications :(</span>' })
  })
  socket.on('issue', async (msg) => {
    // Check if msg is related to an actual issue
    if (msg.issue) {
      renderIssueCard(msg)
      let repo = userData.repos.find(repo => repo.id === msg.repository.id)
      await userData.getIssues(repo)
      // Re-render list of issues if currently visible
      if (document.querySelector(`#issues-${repo.id}`)) renderIssues(repo.id)
    }
  })

  $('#logout-button').click(() => socket.disconnect())
}

// Renders list of repos
async function renderRepos () {
  $('.fixed-action-btn').removeClass('hide')
  $('.tooltipped').tooltip()
  $('#issuesDiv').append($('#reposTemplate').html())
  await userData.getUserData()
  $('#issues-wrapper').removeClass('hide')
  $('#reposHeader').addClass('rendered')
  $('#user-preloader').remove()
  $('#issuesDiv .collection').removeClass('hide')
  $('#issuesDiv img.gh-avatar').attr('src', userData.avatar)
  $('#gh-name-repos').text(`${userData.name}'s Repos with open issues`)
  // $('#repo-preloader').toggleClass('hide')
  await userData.getRepos()
  $('#repo-preloader').remove()
  userData.repos.forEach(repo => {
    let temp = document.querySelector('#repoListTemplate').content.cloneNode(true)
    temp.querySelector('.repo-title').textContent = `Repo: ${repo.full_name}`
    temp.querySelector('.repo-description').textContent = repo.description
    temp.querySelector('a').setAttribute('data-issues', repo.id)
    $('#issuesDiv div.collection').append(temp)
    webhooks.getRepoHooks(repo, userData.username)
  })
  // Event listeners to open issues-list
  $('#issuesDiv div.collection a').click((e) => {
    e.preventDefault()

    $('a.collection-item').removeClass('active')
    $(e.currentTarget).addClass('active')
    renderIssues($(e.currentTarget).data('issues'))
  })
}

// Render list of issues for a specific repo.
async function renderIssues (repoID) {
  let repo = userData.repos.find(repo => repo.id === repoID)
  $('#issues-wrapper .issuesCollection').remove()
  $('#reposHeader').after($('#issuesTemplate').html())
  $('#issues-wrapper .issuesCollection').attr('id', `issues-${repo.id}`)
  $('#issues-wrapper .issuesCollection .title').text(`Issues in ${repo.full_name}`)
  if (repo.hookID) webhooks.renderHookBadge('on')
  if (!repo.issues) await userData.getIssues(repo)
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

  $('#issues-wrapper .tooltipped').tooltip()
  $('#issues-wrapper .notificationIcon').click((e) => {
    e.preventDefault()
    webhooks.toggleWebHook(repo)
  })
  $('#issues-wrapper .issueListClose').click((e) => {
    e.preventDefault()
    $('a.collection-item').removeClass('active')
    $('#issues-wrapper .issuesCollection').remove()
  })
}

// Render a notification card when issue event is received through socket.io.
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

// Checks if client has valid oauth-token on GH.
async function checkAuthorization () {
  let res = await window.fetch(`auth/status`)
  res = await res.json()
  $('#main-preloader').remove()
  if (res.authorized) {
    connectWS(res.username, res.token)
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
export default async function checkSession () {
  let res = await window.fetch(`auth/session`)
  res = await res.json()
  console.log()
  if (!res.active) {
    $('#index-banner .row, #subTitle').removeClass('hide')
    $('#main-preloader').remove()
  } else checkAuthorization()
}
