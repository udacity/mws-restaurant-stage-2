FROM node:6.11.2

RUN mkdir /app

# Set the working directory to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
ADD . /app

EXPOSE 1337

# Install project dependancies
RUN npm i

# Install Sails.js globally
RUN npm i sails -g

# Start the server when the container launches
CMD ["node", "server"]
