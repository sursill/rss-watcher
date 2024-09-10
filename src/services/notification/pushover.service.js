async function notify (env, message, title = null, url = null, urlTitle = null) {
  const token = env.PUSHOVER_TOKEN
  const user = env.PUSHOVER_USER

  let response
  try {
    response = await post(
      'https://api.pushover.net/1/messages.json',
      {
        token,
        user,
        message,
        title,
        url,
        url_title: urlTitle,
      }
    )
  } catch (err) {
    console.error('Error while pushing notification via Pushover')
    console.error(err)
  }

  const status = response.status
  if (status === 1) {
    console.log('Notification sent!')
  } else {
    console.error(`Pushover query responded with status ${status}.`)
  }
}

/**
  * Send a POST request
  * @param {string} url The url to send the  request to
  * @param {object} body The JSON data to send in the request
  */
async function post(url, data = {}) {
  const init = {
    body: JSON.stringify(data),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    }
  }
  const response = await fetch(url, init)
  return await response.json()
}

export { notify }
