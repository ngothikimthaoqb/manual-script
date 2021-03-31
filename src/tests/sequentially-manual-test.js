import Page from '../services/test-framework.js'
import CommonPage from '../portal-page-object/common-page.js'
import LoginPage from '../portal-page-object/login-page.js'
import DeviceListPage from '../portal-page-object/device-list-page.js'
import DeviceLaunchingPage from '../portal-page-object/device-launching-page.js'
import {SITE_CONFIG} from '../config.js'

export async function main(udid) {
  const page = new Page()
  const commonPage = new CommonPage(page)
  const loginPage = new LoginPage(page)
  const deviceListPage = new DeviceListPage(page)
  const deviceLaunchingPage = new DeviceLaunchingPage(page)

  await page.start()
  await commonPage.accessToSite(page, SITE_CONFIG.URL)
  await loginPage.login(SITE_CONFIG.USER_NAME, SITE_CONFIG.PASSWORD)
  await deviceListPage.goDeviceListView()

  let errorMessages = []
  
  const launchDevice = async (udid) => {
    try {
      await deviceListPage.launchDevice(udid)
    }
    catch (err) {
      errorMessages.push(err.message)
    }
  }

  const performManualSteps = async () => {
    try {
      try {
        await deviceLaunchingPage.waitForSessionStarted()
      }
      catch (err) {
        console.log('waiting device error')
      }
      try {
        await deviceLaunchingPage.rotateScreen()
      }
      catch (err) {
        console.log('rotate screen error')
      }
    }
    finally {
      await deviceLaunchingPage.exitSession()
    }
  }

  try {
    var i = 0
    while(i < SITE_CONFIG.ANDROIDUDIDS.length) {
      try {
        await launchDevice(udid)
        await performManualSteps()
      }
      catch(err) {
        console.log(err)
      }
      i++
    }
  }
  catch (err) {
    console.log(err)
  }
  finally {
    await this._page.close()
  }
}

main()

