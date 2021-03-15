import * as fs from 'fs'
import CommonPage from './common-page.js'
import {deviceTypes, deviceState, logType} from '../enums/index.js'

export default class DeviceListPage {
  constructor(page) {
    this._page = page
    this._common = new CommonPage(page)
    this._css = {
      LIST_VIEW: 'div[class*="change-view-type-button__ListViewButton-eYcAYq"]',
      CLOUD_DEVICE_TAB_BAR: 'div[class*="heimdall-CLOUD"]',
      LOCAL_DEVICE_TAB_BAR: 'div[class*="heimdall-IN_HOUSE"]',
      SEARCH_FIELD: 'input[placeholder*="Search devices"]',
      LAUNCH_BUTTON: 'button[class*="square-button__Wrapper-jHQvMl hdovSe"]',
      DEVICE_SUGGEST: 'div[id="suggestion-item-actived"]',
      DEVICE_STATUS: 'div[class*="status-label__Status-iqjkcz"]'
    }
  }

  goDeviceListView = async (deviceGroup='cloud') => {
    // We have to wait for the whole device list totally loaded
    await this._page.waitForLoading(5000)
    await this._page.click(this._css.LIST_VIEW, {visibile: true})

    // Switch to specific device tab
    if (deviceGroup === deviceTypes.cloud) {
      await this._page.click(this._css.CLOUD_DEVICE_TAB_BAR, {visibile: true})
    }
    else if (deviceGroup === deviceTypes.inHouse) {
      await this._page.click(this._css.LOCAL_DEVICE_TAB_BAR, {visibile: true})
    }
  }

  launchDevice = async (deviceUdid) => {
    // Search devcie by udid
    await this._page.setText(this._css.SEARCH_FIELD, deviceUdid)
    try {
      const deviceUdidSuggest = await this._page.getText(this._css.DEVICE_SUGGEST)
      if (deviceUdidSuggest === deviceUdid) {
        await this._page.click(this._css.DEVICE_SUGGEST)
        const deviceStatus = await this._page.getText(this._css.DEVICE_STATUS)
        if (deviceStatus === deviceState.utilizing || deviceStatus === deviceState.offline) {
          await this._common.writeLog(`${logType.warn}: Device not available \n`)
          throw new Error('Device not available')
        }
        else {
          await this._page.click(this._css.LAUNCH_BUTTON, { visibile: true })
          await this._common.writeLog(`${logType.infor}: Manual sesion start with udid ${deviceUdid} \n`)
        }
      }
      else {
        await this._common.writeLog(`${logType.error}: No device matching \n`)
        throw new Error('No device matching')
      }
    }
    catch (err) {
      await this._common.writeLog(`${logType.error}: No device matching \n`)
      console.log(err, 'No device matching')
      throw new Error('No device matching')
    }
  }
}
