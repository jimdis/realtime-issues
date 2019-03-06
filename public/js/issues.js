/* global $, fetch */

const apiURL = '/auth'

async function getIssues () {
  let data = await fetch('/api/repos/1dv023/jd222qe-examination-3/issues')
  data = await data.json()
  console.log(data)
  $('#progressBar').remove()
  data.result.forEach(issue => {
    let li = document.querySelector('#issuesListTemplate').content.cloneNode(true)
    li.querySelector('.title').textContent = issue.title
    $('#issuesDiv ul').append(li)
  })
}

async function renderLoggedIn () {
  $('#issuesDiv').append($('#issuesTemplate').html())
  let data = await fetch('/api/user')
  data = await data.json()
  console.log(data.result)
  $('#issuesDiv img').attr('src', data.result.avatar_url)
  $('#issuesDiv h4').text(`${data.result.name}'s Issues`)
}

async function testAPI () {
  // let data = await fetch('/api/user')
  // data = await data.json()
  // console.log('Test API: ', data)
}

async function checkAuthorization () {
  console.log('running checkAuth')
  let data = await fetch(`${apiURL}/status`)
  data = await data.json()
  if (data.authorized) {
    renderLoggedIn()
    testAPI()
    getIssues()
  } else console.log('Not authorized')
}

checkAuthorization()
