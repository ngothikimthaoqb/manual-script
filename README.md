# A. Overview

This folder contains the script to run manual sessions in a period of time

Install Docker

- If the host machine is macOS or Windows, install [Docker Desktop on Mac](https://docs.docker.com/docker-for-mac/install/) (the Windows installer is on that link)
- If the host machine is Linux
  - Install [Docker Engine](https://docs.docker.com/engine/)
  - Install [Docker Compose](https://docs.docker.com/compose/)

# B. How to run script
In config.js file change the SITE_CONFIG
    USER_NAME
    PASSWORD
    URL
    ANDROIDUDIDS
    ADROIDAPPS
    IOSAPPS
    IOSUDIDS

  1. Run maunal the commands
      ```
      npm install
      cd ml-manual-script/src/tests
      node sequentially-manual-test
      ```
  2. Run automation

      Build Image
      ```
      docker build -t manual-logs:latest .
      ```
      Run image
      ```
      docker-compose up -d
      ```

# C. Get report

  `ml-manual-script\logs\log.txt`

