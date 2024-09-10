import { XMLParser } from 'fast-xml-parser'
import { gt } from 'semver'
import Release from './classes/GitLab/release'
import { notify } from './services/notification/pushover.service'

const RSS_FEED = 'https://dev.sp-tarkov.com/SPT/Stable-releases.rss'

export default {
	async fetch(req, env) {
    // const secret = req.headers.get('secret')
    // if (!secret || secret !== 'sursill') {
    //   return new Response(null, { status: 404 })
    // }

    const lastRelease = await this.getLastRelease(env)
    return Response.json(lastRelease)
	},

	async scheduled(event, env, ctx) {
    let response
    try {
      response = await fetch(RSS_FEED)
    } catch (error) {
      console.error('Error while fetching rss feed')
      console.error(error)
    }
    const data = await response.text()

    const parser = new XMLParser()
    const { rss } = parser.parse(data)
    const latest = new Release(rss.channel.item[0])

    const lastRelease = await this.getLastRelease(env)
    const newRelease = gt(latest.version, lastRelease.version)

    // console.log({
    //   feed: RSS_FEED,
    //   latest,
    //   last: lastRelease,
    //   isNewRelease: newRelease,
    //   cond: `${latest.version} > ${lastRelease.version}`
    // })

    if (newRelease) {
      await this.updateLatestRelease(env, latest)

      const title = 'New SPTarkov released'
      const message = `SPTarkov has released a new version: ${latest.version}.`
      const urlTitle = 'Open release details'
      await notify(env, message, title, latest.link, urlTitle)
    }
	},

  async getLastRelease(env) {
    try {
      const lastRelease = await env.database
        .prepare('SELECT * FROM latest_release;')
        .first()
      return lastRelease
    } catch (error) {
      console.error('Error while querying database')
      console.error(error)
    }
  },

  async updateLatestRelease(env, release) {
    const now = new Date()
    const publishedAt = new Date(release.pubDate)

    try {
      await env.database
      .prepare('UPDATE latest_release SET version = ?, published_at = ?, updated_at = ? WHERE id = ?;')
      .bind(release.version, publishedAt.toISOString(), now.toISOString(), 1)
      .all()
    } catch(err) {
      console.error('Error while saving to database')
      console.error(err)
    }
  },
};
