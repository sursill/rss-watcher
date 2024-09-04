export default class Release {
  constructor(item) {
    this.version = this.parseVersion(item)
    this.author = item.author
    this.pubDate = item.pubDate
    this.link = item.link
  }

  parseVersion(item) {
    const link = item.link
    return link.split('/')[7]
  }
}
