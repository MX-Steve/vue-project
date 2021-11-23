import defaultSettings from '@/settings'

const title = defaultSettings.title || 'Vue Element Admin'


export default function getPageTitle(pageTitle) {
  //  有page title,则显示pageTitle-title
  //  没有的话,只显示title
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
