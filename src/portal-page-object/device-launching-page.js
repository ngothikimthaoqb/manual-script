import BPromise from 'bluebird'
import CommonPage from './common-page.js'
import {logType} from '../enums/index.js'

export default class DeviceLaunchingPage {
  constructor(page) {
    this._page = page
    this._commonPage = new CommonPage(page)

    this._css = {
      CLOSE_ITA_GUARDRAIL_BUTTON: 'svg[id="ita-guardrail-close-button"]',
      SESSION_TIMER: 'div[class*="heimdall-session-timer"]',
      OPEN_INSTALL_APP_MODAL_BUTTON: 'button[class*="install-app-button"]',
      INSTALL_FROM_URL_BUTTON: 'div[class*="heimdall-manual-session-install-app"]',
      APP_URL_INPUT: 'input[placeholder="App URL"]',
      CLOSE_INSTALL_APP_MODAL_BUTTON: 'div[class*="kobiton popup-holder"] > div',
      DEVICE_CANVAS: 'canvas[tabindex="10000"]',
      SESSION_TOOLBAR: 'div[class*="heimdall-session-toolbar"]',
      ROTATE_BUTTON: 'span[class*="toolbar-rotate-screen"] svg',
      POWER_BUTTON: 'span[class*="toolbar-power"]',
      OPEN_EXIT_SESSION_MODAL_BUTTON: 'svg[class*="top-bar-icon"]',
      EXIT_SESSION_BUTTON: 'button[class*="heimdall-exit-current-session-confirm-button"]',
      ALERT_CLOSE_BUTTON: 'span[class*="heimdall-alert-close-button"]'
    }

    this._xpath = {
      SUCCESS_INSTALL_APP_POPUP: '//div[contains(., "app has been installed on the device.")]',
      FAILED_INSTALL_APP_POPUP: '//div[contains(., "Failed to install")]',
      SUCCESS_POWER_ON_DEVICE_POPUP: '//span[@type="TIP"]',
      SUCCESS_POWER_OFF_DEVICE_POPUP: '//div[contains(., "Please press Power / Home button or tap on screen to wake up device.")]'
    }
  }

  closeItaGuardrail = async () => {
    try {
      // Close ita guardrail
      // We ignore the error throwing from closing ita guardrail failed
      // because ita guardrail is just available for specific users
      await this._page.click(this._css.CLOSE_ITA_GUARDRAIL_BUTTON)
      await this._page.waitForLoading()
    }
    catch (ignored) {}
  }

  waitForSessionStarted = async () => {
    try {
      // Make sure launching page is fully loaded
      await this._page.waitForLoading(60000)
      const txt = await this._page.getText(this._css.SESSION_TIMER)
      if (txt === 0) {
        throw new Error('Manual session can not start')
      }
    }
    catch (err) {
      throw new Error('SESSION_NOT_START')
    }
  }


  rotateScreen = async () => {
    try {
      const [height, width] = await this._page.$eval(
        this._css.DEVICE_CANVAS, el => [el.height, el.width])

      await this._page.click(this._css.ROTATE_BUTTON)
      await this._page.waitForLoading(30000)

      const [rotatedHeight, rotatedWidth] = await this._page.$eval(
      this._css.DEVICE_CANVAS, el => [el.height, el.width])
      await this._page.waitForLoading()

      if (rotatedHeight === width && rotatedWidth === height) {
        await this._commonPage.writeLog(`${logType.infor}: Device rotate screen successfully \n`)
      }
      else {
        await this._commonPage.writeLog(`${logType.error}: Manual sesion error with device couldn't rotate the screen \n`)
      }
    }
    catch (err) {
      throw new Error('ROTATE_SCREEN_FAILED')
    }
  }


  exitSession = async () => {
    try {
      await this._page.click(this._css.OPEN_EXIT_SESSION_MODAL_BUTTON)
      await this._page.waitForLoading(this._css.EXIT_SESSION_BUTTON)
      await this._page.click(this._css.EXIT_SESSION_BUTTON)
      await this._page.waitingForLoadingNewPage()
      await this._commonPage.writeLog(`${logType.infor}: Exit session \n`)
    }
    catch (ignored) {}
  }
}
