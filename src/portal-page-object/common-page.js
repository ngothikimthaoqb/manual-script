import * as fs from 'fs'
import {messages} from '../enums/index.js'
import {SYSTEM_LOADING_TIMEOUT, SYSTEM_LOADING_ELEMENT_TIMEOUT} from '../config.js'
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
      await page.setDefaultTimeout(SYSTEM_LOADING_TIMEOUT)
      await page.gotoUrl(url
        , {
        waitUntil: 'load',
        timeout: SYSTEM_LOADING_TIMEOUT
      })

      // expect the page must load to Kobiton portal page
      await page.waitingForLoadingNewPage()
    }
    catch (err) {
      throw new Error(messages.ACCESS_FAILED)
    }
  }

  writeLog = (log) => {
    const message = new Date() + ':' + log
    console.log(message)
    fs.appendFile('../logs/log.txt', message, (err) => {
      if (err) throw new Error(messages.WRITE_LOGS_FAILED)
    })
  }
  delay(time) {
    return new Promise((resolve) => { 
      setTimeout(resolve, time)
    })
 }
}
