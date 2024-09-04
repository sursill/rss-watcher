import { XMLParser } from 'fast-xml-parser'
import { gt } from 'semver'
import Release from './classes/GitLab/release'

/**
 * Welcome to Cloudflare Workers!
 *
 * This is a template for a Scheduled Worker: a Worker that can run on a
 * configurable interval:
 * https://developers.cloudflare.com/workers/platform/triggers/cron-triggers/
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Run `curl "http://localhost:8787/__scheduled?cron=*+*+*+*+*"` to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

const RSS_FEED = 'https://dev.sp-tarkov.com/SPT/Stable-releases.rss'

export default {
	async fetch(req) {
		const url = new URL(req.url)
		url.pathname = "/__scheduled";
		url.searchParams.append("cron", "* * * * *");
		return new Response(`To test the scheduled handler, ensure you have used the "--test-scheduled" then try running "curl ${url.href}".`);
	},

	// The scheduled handler is invoked at the interval set in our wrangler.toml's
	// [[triggers]] configuration.
	async scheduled(event, env, ctx) {
    const response = await fetch(RSS_FEED)
    const data = await response.text()

    const parser = new XMLParser()
    const { rss } = parser.parse(data)
    const latest = new Release(rss.channel.item[0])

    console.log(RSS_FEED)
    console.log({
      channel: rss.channel,
      latest,
    })
	},
};
