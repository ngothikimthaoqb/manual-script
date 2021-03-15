import BPromise from 'bluebird'

export default class LoginPage {
  constructor(page) {
    this._page = page

    this._css = {
      USERNAME_ELEMENT: 'input[name="emailOrUsername"]',
      PASSWORD_ELEMENT: 'input[name="password"]',
      LOGIN_ELEMENT: 'span[tabindex="5"]',
    }
  }

  login = async (username, password) => {
    try {
      await this._page.setText(this._css.USERNAME_ELEMENT, username)
      await this._page.setText(this._css.PASSWORD_ELEMENT, password)
      await this._page.click(this._css.LOGIN_ELEMENT)

      // Ensure the device list is fully loaded
      await this._page.waitForLoading()
      await BPromise.delay(5000)
    }
    catch (err) {
      throw new Error('LOGIN_FAILED')
    }
  }
}
