import wiki from '../../libs/wikipedia'

const autocomplete = async (title: string): Promise<string[] | undefined> => {
  try {
    return await wiki.autocomplete(title)
  } catch (error) {
    console.error(`error while looking up ${title}`, error)
    return undefined
  }
}

export default autocomplete
