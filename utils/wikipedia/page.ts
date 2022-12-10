import wiki from '../../libs/wikipedia'
import { NormalNodeData } from '../../store'

const page = async (title: string): Promise<NormalNodeData | undefined> => {
  try {
    const page = await wiki.page(title)
    const [summary, { pages: relateds }] = await Promise.all([
      await page.summary(),
      await page.related(),
    ])

    const { extract_html: html, thumbnail, content_urls } = summary

    return {
      type: 'normal',
      self: {
        title: title.replaceAll('_', ' '),
        thumbnail: thumbnail?.source,
        html,
        url: {
          desktop: content_urls.desktop.page,
          mobile: content_urls.mobile.page,
        },
      },
      relateds: relateds
        .filter(
          ({ extract_html }) =>
            !extract_html.endsWith('may refer to:</p>') &&
            !extract_html.endsWith('may stand for:</p>')
        )
        .map(({ extract_html, thumbnail, title, content_urls }) => ({
          title: title.replaceAll('_', ' '),
          url: {
            desktop: content_urls.desktop.page,
            mobile: content_urls.mobile.page,
          },
          thumbnail: thumbnail?.source,
          html: extract_html,
        })),
    }
  } catch (error) {
    console.error(`error while looking up ${title}`, error)
    return undefined
  }
}

export default page
