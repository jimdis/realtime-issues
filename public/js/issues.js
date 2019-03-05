/* global $, fetch */

const apiURL = '/jimdis'

async function getIssues () {
  let data = await fetch(apiURL)
  data = await data.json()
  console.log(data)
  data.result.forEach(issue => {
    $('#issuesCollection').append(
      `<li class="collection-item avatar"><i class="material-icons circle">account_circle</i><span class="title">${issue.title}</span><p>Updated ${issue.updated_at} <br><a href="${issue.html_url}">Comments: ${issue.comments}</a></p><a href="#!" class="secondary-content"><i class="material-icons">grade</i></a></li>`
    )
  })
}

getIssues()
