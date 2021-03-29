# setting base image
FROM selenium/standalone-chrome
USER root
# Set the working directory to /tin_fe
WORKDIR /app
#Access to the project within docker container - Bundle app source
COPY . /app
# Install nvm
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
# Install Node.js
RUN apt-get update
RUN apt-get install --yes curl
#configuring nodeSource repository to get enough version of nodejs
RUN curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
RUN apt-get install -y nodejs
#configuring debian package repository
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
#installing yarn
RUN apt-get update && apt-get install -y yarn
#installing binary git package
RUN apt-get update
RUN apt-get install -y git
