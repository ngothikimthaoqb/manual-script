import BPromise from 'bluebird'
import CommonPage from './common-page.js'
import {messages, logType} from '../enums/index.js'
import {SYSTEM_LOADING_ELEMENT_TIMEOUT} from '../config.js'

export default class DeviceLaunchingPage {
  constructor(page) {
    this._page = page
    this._commonPage = new CommonPage(page)

    this._css = {
      CLOSE_ITA_GUARDRAIL_BUTTON: 'svg[id="ita-guardrail-close-button"]',
      SESSION_TIMER: 'div[class*="heimdall-session-timer"]',
      OPEN_INSTALL_APP_MODAL_BUTTON: 'button[class*="install-app-button"]',
      INSTALL_FROM_URL_BUTTON: 'div[class*="marketing-manual-session-install-app heimdall-manual-session-install-app"]',
      APP_URL_INPUT: 'input[placeholder="App URL"]',
      CLOSE_INSTALL_APP_MODAL_BUTTON: 'div[class*="kobiton popup-holder"] > div',
      DEVICE_CANVAS: 'canvas[tabindex="10000"]',
      SESSION_TOOLBAR: 'div[class*="heimdall-session-toolbar"]',
      ROTATE_BUTTON: 'span[class*="toolbar-rotate-screen"] svg',
      POWER_BUTTON: 'span[class*="toolbar-power"]',
      OPEN_EXIT_SESSION_MODAL_BUTTON: 'svg[class*="top-bar-icon"]',
      EXIT_SESSION_BUTTON: 'button[class*="heimdall-exit-current-session-confirm-button"]',
      ALERT_CLOSE_BUTTON: 'span[class*="heimdall-alert-close-button"]',
      CAN_NOT_ROTATE_SCREEN_POPUP: 'div[class*="notification-alert__Content-lfSJGi imqyHy"]'
    }
    this._rotateScreenPopup = 'This screen is unable to rotate because the application does not support landscape mode.'
  }

  closeItaGuardrail = async () => {
    try {
      // Close ita guardrail
      // We ignore the error throwing from closing ita guardrail failed
      // because ita guardrail is just available for specific users
      await this._page.waitForLoading(SYSTEM_LOADING_ELEMENT_TIMEOUT)
      await this._page.click(this._css.CLOSE_ITA_GUARDRAIL_BUTTON)
    }
    catch (ignored) {
      console.log(ignored, 'ignored')
    }
  }

  waitForSessionStarted = async () => {
    try {
      // Make sure launching page is fully loaded
      await this._page.waitForLoading(10000)
      const txt = await this._page.getText(this._css.SESSION_TIMER)
      if (txt === 0) {
        await this._commonPage.writeLog(`${logType.infor}: ${messages.SESSION_NOT_START} \n`)
        throw new Error(messages.SESSION_NOT_START)
      }
    }
    catch (err) {
      await this._commonPage.writeLog(`${logType.infor}: ${messages.SESSION_NOT_START} \n`)
      throw new Error(messages.SESSION_NOT_START)
    }
  }

  rotateScreen = async () => {
    try {
      const [height, width] = await this._page.$eval(
        this._css.DEVICE_CANVAS, el => [el.height, el.width])
      await this._page.hover(this._css.ROTATE_BUTTON)
      await this._page.click(this._css.ROTATE_BUTTON)
      await this._page.waitForLoading(15000)
      const rotateScreenPopup =  await this._page.isExistingElement(this._css.CAN_NOT_ROTATE_SCREEN_POPUP)
      const rotateScreenPopupMessage = rotateScreenPopup && 
      await this._page.getText(this._css.CAN_NOT_ROTATE_SCREEN_POPUP)
      const isCanNotRotate =  rotateScreenPopupMessage && rotateScreenPopupMessage.includes(this._rotateScreenPopup)
      await this._page.waitForLoading(15000)
      const [rotatedHeight, rotatedWidth] = await this._page.$eval(
      this._css.DEVICE_CANVAS, el => [el.height, el.width])
    
      if ((rotatedHeight === width && rotatedWidth === height) || isCanNotRotate) {
        await this._commonPage.writeLog(`${logType.infor}: ${messages.ROTATE_SCREEN_SUCCESS} \n`)
      }
      else {
        await this._commonPage.writeLog(`${logType.error}: ${messages.ROTATE_SCREEN_FAILED} \n`)
        throw new Error(messages.ROTATE_SCREEN_FAILED)
      }
    }
    catch (err) {
      await this._commonPage.writeLog(`${logType.error}: ${messages.ROTATE_SCREEN_FAILED} \n`)
      throw new Error(messages.ROTATE_SCREEN_FAILED)
    }
  }


  exitSession = async () => {
    try {
      await this._page.click(this._css.OPEN_EXIT_SESSION_MODAL_BUTTON)
      await this._page.waitForLoading(this._css.EXIT_SESSION_BUTTON)
      await this._page.click(this._css.EXIT_SESSION_BUTTON)
      await this._page.waitingForLoadingNewPage()
      await this._commonPage.writeLog(`${logType.infor}: ${messages.EXIT_SESSION_SUCCESS} \n`)
    }
    catch (error) {
      await this._commonPage.writeLog(`${logType.error}: ${messages.EXIT_SESSION_ERROR} \n`)
      throw new Error(messages.EXIT_SESSION_ERROR)
    }
  }
}
