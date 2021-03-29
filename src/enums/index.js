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

export const messages = {
  LOGIN_FAILED: 'Fail to login to portal',
  LOGIN_SUCCESS: 'Login successfully',
  ACCESS_FAILED: 'Fail to access to portal',
  WRITE_LOGS_FAILED: 'Fail to write log',
  DEVICE_NOT_AVAILABLE: 'Device not available',
  DEVICE_NOT_FOUND: 'No device matching',
  SESSION_NOT_START: 'Session can not start',
  ROTATE_SCREEN_FAILED: 'Manual sesion error with device could not rotate the screen',
  ROTATE_SCREEN_SUCCESS: 'Device rotate screen successfully',
  EXIT_SESSION_ERROR: 'Exit session error',
  EXIT_SESSION_SUCCESS: 'Exit session successfully'

}
export const deviceTypes = {
  cloud: 'cloud',
  inHouse: 'in-house'
}

export const DEVICE_CHECKUP_CHROME_EXECUTABLE_PATH = '/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome'
// export const DEVICE_CHECKUP_CHROME_EXECUTABLE_PATH = '/usr/bin/google-chrome'

export const platformNames = {
  android: 'Android',
  ios: 'iOS'
}

export const BROWSER_TYPES = {
  CHROME: 'chrome',
  SAFARI: 'safari'
}

export const DEVICE_GROUP_TYPES = {
  KOBITON: 'KOBITON',
  ORGANIZATION: 'ORGANIZATION'
}

export const PORTAL_SELECTOR = {
  USERNAME_ELEMENT: 'input[name="emailOrUsername"]',
  PASSWORD_ELEMENT: 'input[name="password"]',
  LOGIN_ELEMENT: 'button[tabindex="0"]'
}
