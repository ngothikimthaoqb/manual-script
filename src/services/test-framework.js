import puppeteer from 'puppeteer'
import {DEVICE_CHECKUP_CHROME_EXECUTABLE_PATH} from '../enums/index.js'

export default class Page {
  constructor() {
    this._browser = null
    this._page = null
  }

  async start(isInVisible = false) {
    const options = {
      headless: isInVisible,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      executablePath: DEVICE_CHECKUP_CHROME_EXECUTABLE_PATH || null
    }

    this._browser = await puppeteer.launch(options)
    this._page = await this._browser.newPage()
    await this._page.setViewport({width: 1600, height: 1000})
  }

  async openNewTab() {
    this._page = await this._browser.newPage()
    await this._page.setViewport({width: 1600, height: 1000})

  }

  gotoUrl(url = '', options = {}) {
    return this._page.goto(url, options)
      .catch((err) => {
        throw new Error(err)
      })
  }

  getPageUrl() {
    return this._page.url()
  }

  async setText(element, value, options = {}) {
    await this._page.waitForSelector(element, options)
    return this._page.type(element, value)
  }

  async getText(element, options = {}) {
    await this._page.waitForSelector(element, options)
    const query = await this._page.$(element)
    const text = await this._page.evaluate(query => query.textContent, query)
    return text
  }

  async click(element, options = {}) {
    await this._page.waitForSelector(element, options)
    return this._page.click(element)
  }

  hover(selector) {
    return this._page.hover(selector)
  }

  $x(expression) {
    return this._page.$x(expression)
  }

  $eval(selector, pageFunc) {
    return this._page.$eval(selector, pageFunc)
  }

  waitingForLoadingNewPage(options = {}) {
    return this._page.waitForNavigation(options)
  }

  waitForLoading(selectorOrTimeout = 6000, options = {}) {
    return this._page.waitForTimeout(selectorOrTimeout, options)
  }

  isConnected() {
    return this._browser.isConnected()
  }

  close() {
    return this._browser.close()
  }

  press(key) {
    return this._page.keyboard.press(key)
  }
}
