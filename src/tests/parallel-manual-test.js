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
const firedTime = 6 * 60 * 1000
let count = 1
let startTime = new Date().getTime()
const time = 3 * 24 * 60 * 60 * 1000 

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
        await deviceLaunchingPage.rotateScreen(udid)
        await page.waitForLoading(30000)
        await deviceLaunchingPage.rotateScreen(udid)
      }
      catch (err) {
        console.log('rotate screen error')
      }
    }
    finally {
      await deviceLaunchingPage.exitSession(udid)
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

  console.log(numCPUs, 'numCPUs')
  if (cluster.isMaster ) {
    console.log(`Master ${process.pid} is running`);
    
    if (numCPUs >= MAXIMUM_DEVICE && count===1) {
      console.log('aaaaaa')
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
      res.end('Current process\n')
    }).listen(8000)
    let i = 0
    setInterval(async function () {
      await commonPage.writeLog(`Iteration ${count}\n`)
      while (i < MAXIMUM_DEVICE) {
        console.log(cluster.worker.id, 'cluster.worker.id')
        if (cluster.worker.id === i+1) {
          runManual(SITE_CONFIG.ANDROIDUDIDS[i])
        }
        i++
      }
      if (i >= MAXIMUM_DEVICE) {
        i = 0
      }

      if (new Date().getTime() - startTime >  time) {
        process.exit(1)
      }

      count++
    }, firedTime)
  
    console.log(`Worker ${process.pid} started ${cluster.worker.id}`)
  }
}

main()


