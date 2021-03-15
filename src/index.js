import Page from './services/test-framework.js'
import CommonPage from './portal-page-object/common-page.js'
import LoginPage from './portal-page-object/login-page.js'
import DeviceListPage from './portal-page-object/device-list-page.js'
import DeviceLaunchingPage from './portal-page-object/device-launching-page.js'

export default async function main() {
  const page = new Page()
  const commonPage = new CommonPage(page)
  const loginPage = new LoginPage(page)
  const deviceListPage = new DeviceListPage(page)
  const deviceLaunchingPage = new DeviceLaunchingPage(page)

  const username = 'huyendo'
  const password = 'Kobiton@2020'
  const url = 'https://portal-test.kobiton.com/'
  const udids = ['00008030-00142D382188802E','601e61ce']


  await page.start()
  await commonPage.accessToSite(page, url)
  await loginPage.login(username, password)
  await deviceListPage.goDeviceListView()

  let errorMessages = []
  
  const launchDevice = async (udid) => {
    try {
      await deviceListPage.launchDevice(udid)
    }
    catch (err) {
      console.log('error device list')
      throw err
    }
  }

  const performManualSteps = async () => {
    try {
      try {
        await deviceLaunchingPage.waitForSessionStarted()
      }
      catch (err) {
        console.log('waiting device error')
        errorMessages.push(err.message)
        throw err
      }
      
      try {
        await deviceLaunchingPage.closeItaGuardrail()
      }
      catch (err) {
        console.log('close ita guardrail')
        errorMessages.push(err.message)
        throw err
      }
     

      try {
        await deviceLaunchingPage.rotateScreen()
      }
      catch (err) {
        console.log('rotate screen error')
        errorMessages.push(err.message)
        throw err
      }
    }
    finally {
      await deviceLaunchingPage.exitSession()
    }

    console.log(errorMessages, 'errorMessages')
    if (errorMessages !== []) {
      let error = errorMessages.join(', ')
      throw new Error(error)
    }
  }

  try {
    var i = 0
    while(i < 2) {
      await launchDevice(udids[i])
      await performManualSteps()
      i++
    }
  }
  catch (err) {
    console.log(err)
  }
}
main()
  