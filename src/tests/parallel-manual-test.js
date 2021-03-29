import cluster from 'cluster'
import http from 'http'
import os from 'os'
import Page from '../services/test-framework.js'
import CommonPage from '../portal-page-object/common-page.js'
import LoginPage from '../portal-page-object/login-page.js'
import DeviceListPage from '../portal-page-object/device-list-page.js'
import DeviceLaunchingPage from '../portal-page-object/device-launching-page.js'
import {SITE_CONFIG} from '../config.js'

const MAXIMUM_DEVICE = 4
const page = new Page()
const commonPage = new CommonPage(page)

async function runManual(udid) {
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
      await deviceLaunchingPage.closeItaGuardrail()
    }
    catch (err) {
      console.log('close ita guardrail')
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
    await launchDevice(udid)
    await performManualSteps()
  }
  catch (err) {
    console.log(err)
  }
  finally {
    await page.close()
  }
}

async function main () {
  const numCPUs = os.cpus().length

  if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);
    
    if (numCPUs >= MAXIMUM_DEVICE) {
      let i = 0 
      while (i < MAXIMUM_DEVICE) {
        cluster.fork()
        i++
      }
    }
    cluster.on('exit', (worker) => {
      console.log(`Worker ${worker.process.pid} died.`)
  })

  cluster.on('online', (worker) => {
      console.log(`Worker ${worker.process.pid} is online.`)
  })

  process.on('SIGINT', () => {
    for(const id in cluster.workers) {
      cluster.workers[id].kill('SIGINT')
    }
  })
  } else {
    // Workers can share any TCP connection
    // In this case it is an HTTP server
    http.createServer((req, res) => {
      res.writeHead(200)
      res.end('hello world\n')
    }).listen(8000)
    let i = 0
    while (i < MAXIMUM_DEVICE) {
      if (cluster.worker.id === i+1) {
        runManual(SITE_CONFIG.ANDROIDUDIDS[i])
      }
      i++
    }
    console.log(`Worker ${process.pid} started ${cluster.worker.id}`)
  }
}
// main()
const firedTime = 25 * 60 * 1000
let count = 1
setInterval(async function () {
  await commonPage.writeLog(`Iteration ${count}\n`)
  main()
  count++
}, firedTime)




