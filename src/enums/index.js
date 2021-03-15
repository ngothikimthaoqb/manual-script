export const deviceState = {
  online: 'Online',
  offline: 'Offline',
  utilizing: 'Utilizing'
}

export const logType = {
  infor: 'infor',
  error: 'error',
  warn: 'warn'
}


export const deviceTypes = {
  cloud: 'cloud',
  inHouse: 'in-house'
}

export const DEVICE_CHECKUP_CHROME_EXECUTABLE_PATH = '/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome'
export const BROWSER_TYPES = {
  CHROME: 'chrome',
  SAFARI: 'safari'
}

export const DEVICE_GROUP_TYPES = {
  KOBITON: 'KOBITON',
  ORGANIZATION: 'ORGANIZATION'
}

export const DEVICE_CHECKUP_FAILURE_TYPES = {
  SYSTEM_ISSUE: {
    ACCESS_FAILED: 'Fail to access to portal',
    LOGIN_FAILED: 'Fail to login to portal'
  },
  LAUNCH_DEVICE_FAILED: {
    DEVICE_IS_UTILIZING: 'Fail to launch device because it is utilizing',
    UNKNOWN: 'Fail to launch device'
  },
  MANUAL_SESSION_FAILTURE_TYPE: {
    SESSION_NOT_START: 'It took too long to start session',
    INSTALL_APP_TIMEOUT: 'It took too long to install application',
    INSTALL_APP_FAILED: 'Fail to install application',
    ROTATE_SCREEN_FAILED: 'Fail to rotate the screen',
    POWER_FAILED: 'Fail to turn off/on the screen'
  },
  AUTO_SESSION_FAILURE_TYPES: {
    DRIVER_NOT_INIT: 'Fail to init driver',
    ACCESS_INTERNET_FAILED: 'Fail to access to internet',
    DRIVER_NOT_QUIT: 'Fail to quit driver'
  }
}

export const PORTAL_SELECTOR = {
  USERNAME_ELEMENT: 'input[name="emailOrUsername"]',
  PASSWORD_ELEMENT: 'input[name="password"]',
  LOGIN_ELEMENT: 'button[tabindex="0"]'
}
