import BPromise from 'bluebird'
import {messages, logType} from '../enums/index.js'
import CommonPage from './common-page.js'
import {SITE_CONFIG} from '../config.js'

export default class LoginPage {
  constructor(page) {
    this._page = page
    this._commonPage =  new CommonPage(page)
    this._element = {
      USERNAME_ELEMENT: 'input[name="emailOrUsername"]',
      PASSWORD_ELEMENT: 'input[name="password"]',
      LOGIN_ELEMENT: 'button[class*="login__LoginButton-jtgLak"]',
      DEVICE_LIST: 'div[class*="heimdall-device-list"]'

    }
    this.errorMessage = {
      INVALID_EMAIL_OR_PASS: 'Invalid email and/or password'
    }
  }

  login = async (username, password) => {
    try {
      await this._page.setText(this._element.USERNAME_ELEMENT, username)
      await this._page.setText(this._element.PASSWORD_ELEMENT, password)
      await this._page.click(this._element.LOGIN_ELEMENT)

      // Ensure the device list is fully loaded
      await this._page.waitForLoading(30000)
      const url = await this._page.getUrl()

      if (url === SITE_CONFIG.URL.concat('devices')) {
        this._commonPage.writeLog(`${logType.infor}: ${messages.LOGIN_SUCCESS}\n`)
      }
      else {
        this._commonPage.writeLog(`${logType.error}: ${messages.LOGIN_FAILED}\n`)
        throw new Error(messages.LOGIN_FAILED)
      }
    }
    catch (err) {
      this._commonPage.writeLog(`${logType.error}: ${messages.LOGIN_FAILED}\n`)
      throw new Error(messages.LOGIN_FAILED)
    }
  }
}
