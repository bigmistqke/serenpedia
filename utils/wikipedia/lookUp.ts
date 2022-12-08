import wiki from 'wikipedia/dist'
import { NodeData, NormalNodeData } from '../../store'

const lookUp = async (title: string): Promise<NormalNodeData | undefined> => {
  try {
    const page = await wiki.page(title)
    const [
      { extract_html: html, thumbnail, intro },
      { pages: relateds },
      allHtml,
    ] = await Promise.all([
      await page.summary(),
      await page.related(),
      await page.html(),
    ])

    console.log('allHtml', allHtml)

    return {
      type: 'normal',
      self: {
        title: title.replaceAll('_', ' '),
        thumbnail: thumbnail?.source,
        html,
      },
      relateds: relateds.map(({ extract_html, thumbnail, title }) => ({
        title: title.replaceAll('_', ' '),
        thumbnail: thumbnail?.source,
        html: extract_html,
      })),
    }
  } catch (error) {
    console.error(`error while looking up ${title}`, error)
    return undefined
  }
}

export default lookUp
