/* global $, fetch */

const apiURL = '/auth'

async function getIssues () {
  let data = await fetch(`${apiURL}/issues`)
  data = await data.json()
  console.log(data)
  $('#progressBar').remove()
  data.result.forEach(issue => {
    let li = document.querySelector('#issuesListTemplate').content.cloneNode(true)
    li.querySelector('.title').textContent = issue.title
    $('#issuesDiv ul').append(li)
  })
}

async function checkAuthorization () {
  console.log('running checkAuth')
  let data = await fetch(`${apiURL}/status`)
  data = await data.json()
  if (data.authorized) {
    renderLoggedIn()
    getIssues()
  } else console.log('Not authorized')
}

function renderLoggedIn () {
  $('#issuesDiv').append($('#issuesTemplate').html())
}

checkAuthorization()
