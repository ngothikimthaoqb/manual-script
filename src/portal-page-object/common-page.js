import * as fs from 'fs';

export default class CommonPage {
  ensureLastPageClosed = async (page) => {
    try {
      const isPageOpened = await page.isConnected()
      if (isPageOpened) {
        await page.close()
      }
    }
    catch (ignored) {}
  }

  accessToSite = async (page, url) => {
    try {
      await page.gotoUrl(url
        , {
        waitUntil: 'load',
        timeout: 600000
      }
      )

      // expect the page must load to Kobiton portal page
      await page.waitingForLoadingNewPage()
    }
    catch (err) {
      throw new Error('ACCESS_FAILED')
    }
  }

  writeLog = (log) => {
    const message = new Date() + ':' + log
    console.log(message)
    fs.appendFile('./log.txt', message, (err) => {
      if (err) throw err
    })
  }
}
