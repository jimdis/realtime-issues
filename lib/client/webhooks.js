import * as api from './api'

const hookURL = 'https://65fc704f.ngrok.io/api'

export async function createWebHook (repoFullName) {
  let res = await window.fetch(`api/repo/?wh=true&path=${repoFullName}&action=create`)
  res = await res.json()
  if (res.active) return res
}

export async function deleteWebHook (repoFullName, hookID) {
  let res = await window.fetch(`api/repo/?wh=true&path=${repoFullName}&action=delete&id=${hookID}`)
  return res.status === 204
}

export async function getRepoHooks (repo) {
  let res = await api.getData(`repos/${repo.full_name}/hooks`)
  let hook = res.find(hook => hook.config.url === hookURL)
  if (hook) {
    repo.hookID = hook.id
    if (document.querySelector(`#issues-${repo.id}`)) renderHookBadge('on')
  }
}

export async function toggleWebHook (repo) {
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

export function renderHookBadge (action) {
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
