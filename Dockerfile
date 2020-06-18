FROM node:14

# Create app directory
WORKDIR /app

# Install Nest CLI
RUN yarn global add @nestjs/cli

# Install TypeORM
RUN yarn global add typeorm

# Install app dependencies
COPY package.json yarn.lock ./
RUN yarn

# Copy app
COPY . .

EXPOSE 3000

# Run app
CMD ["yarn", "start:dev"]