/* global $, fetch */

const apiURL = '/auth'

async function renderLoggedIn () {
  $('#issuesDiv').append($('#reposTemplate').html())
  let res = await fetch('/api/user')
  res = await res.json()
  console.log(res)
  getAllRepos()
  $('#issuesDiv div.preloader-wrapper').remove()
  $('#issuesDiv img.gh-avatar').attr('src', res.avatar_url)
  $('#gh-name-repos').text(`${res.name}'s Repos with open issues`)
}

async function testAPI () {
  // let res = await fetch(`/api/search/issues?q=author:${username}`)
  let res = await fetch(`/api/repos/jimdis/jd222qe_1dv600/issues`)
  res = await res.json()
  console.log('Test API: ', res)
}

async function getAllRepos () {
  $('#progressBar').toggleClass('hide')
  let res = await fetch(`/api/user/repos`)
  res = await res.json()
  $('#progressBar').remove()
  res.forEach(repo => {
    if (repo.open_issues_count > 0) {
      console.log('getAllRepos: ', repo)
      let temp = document.querySelector('#repoListTemplate').content.cloneNode(true)
      temp.querySelector('.repo-title').textContent = `Repo: ${repo.full_name}`
      temp.querySelector('.repo-description').textContent = repo.description
      temp.querySelector('a').setAttribute('data-issues', repo.full_name)
      $('#issuesDiv div.collection').append(temp)
    }
  })
  $('#issuesDiv div.collection a').click((e) => {
    $('#issuesCollection').remove()
    console.log(e.currentTarget.getAttribute('data-issues'))
    getAllIssues(e.currentTarget.getAttribute('data-issues'))
  })
}

async function getAllIssues (uri) {
  $('#issues-wrapper').append($('#issuesTemplate').html())
  $('#issuesCollection .title').text(`Issues in ${uri}`)
  let res = await fetch(`/api/repos/${uri}/issues`)
  res = await res.json()
  console.log('getAllIssues: ', res)
  renderIssues(res)
}

function renderIssues (arr) {
  $('#progressBar').remove()
  arr.forEach(issue => {
    let li = document.querySelector('#issuesListTemplate').content.cloneNode(true)
    li.querySelector('.title').textContent = issue.title
    $('#issuesCollection ul').append(li)
  })
}

async function checkAuthorization () {
  console.log('running checkAuth')
  let res = await fetch(`${apiURL}/status`)
  res = await res.json()
  if (res.authorized) {
    renderLoggedIn()
    // getIssues()
  } else console.log('Not authorized')
}

// checkAuthorization()

renderLoggedIn()
