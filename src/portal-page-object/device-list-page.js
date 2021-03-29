import * as fs from 'fs'
import CommonPage from './common-page.js'
import {deviceTypes, deviceState, logType, messages} from '../enums/index.js'
import {SYSTEM_LOADING_TIMEOUT} from '../config.js'

export default class DeviceListPage {
  constructor(page) {
    this._page = page
    this._common = new CommonPage(page)
    this._element = {
      LIST_VIEW: 'div[class*="change-view-type-button__ListViewButton-eYcAYq"]',
      CLOUD_DEVICE_TAB_BAR: 'div[class*="heimdall-CLOUD"]',
      LOCAL_DEVICE_TAB_BAR: 'div[class*="heimdall-IN_HOUSE"]',
      SEARCH_FIELD: 'input[placeholder*="Search devices"]',
      LAUNCH_BUTTON: 'button[class*="square-button__Wrapper-jHQvMl hdovSe"]',
      DEVICE_SUGGEST: 'div[id="suggestion-item-actived"]',
      DEVICE_STATUS: 'div[class*="status-label__Status-iqjkcz"]'
    }
  }

  goDeviceListView = async (deviceGroup='in-house') => {
    // We have to wait for the whole device list totally loaded
    try {
      await this._page.waitForLoading(10000)
      await this._page.click(this._element.LIST_VIEW, {visibile: true})

      // Switch to specific device tab
      if (deviceGroup === deviceTypes.cloud) {
        await this._page.click(this._element.CLOUD_DEVICE_TAB_BAR, {visibile: true})
      }
      else if (deviceGroup === deviceTypes.inHouse) {
        await this._page.click(this._element.LOCAL_DEVICE_TAB_BAR, {visibile: true})
      }
    }
    catch(err) {
      console.log(err,'device list')
    }
    
  }

  launchDevice = async (deviceUdid) => {
    // Search devcie by udid
    await this._page.setText(this._element.SEARCH_FIELD, deviceUdid)
    try {
      const deviceSuggestElement = await this._page.isExistingElement(this._element.DEVICE_SUGGEST)
      if (deviceSuggestElement) {
        const deviceUdidSuggest = await this._page.getText(this._element.DEVICE_SUGGEST)
        if (deviceUdidSuggest.includes(deviceUdid)) {
          await this._page.click(this._element.DEVICE_SUGGEST)
          const deviceStatus = await this._page.getText(this._element.DEVICE_STATUS)
          if (deviceStatus === deviceState.utilizing || deviceStatus === deviceState.offline) {
            await this._common.writeLog(`${logType.warn}: ${messages.DEVICE_NOT_AVAILABLE} \n`)
            throw new Error(messages.DEVICE_NOT_AVAILABLE)
          }
          else {
            await this._page.click(this._element.LAUNCH_BUTTON, { visibile: true })
            await this._common.writeLog(`${logType.infor}: Manual sesion start with udid ${deviceUdid} \n`)
          }
        }
        else {
          await this._common.writeLog(`${logType.error}: ${messages.DEVICE_NOT_FOUND} \n`)
          throw new Error(messages.DEVICE_NOT_FOUND)
        }
      }
    }
    catch (err) {
      await this._common.writeLog(`${logType.error}: ${messages.DEVICE_NOT_FOUND} \n`)
      throw new Error(messages.DEVICE_NOT_FOUND)
    }
  }
}
