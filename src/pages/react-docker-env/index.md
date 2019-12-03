---
title: Passing environment variables from docker run to a react app
date: "2019-12-03"
---

### The problem
The output of building react app is html and javascript that lives on the browser, thus, it can't access system's environment variables. You can only access them at build time thanks to the bundler (which runs on node.js).

The problem comes when you want to pass environment variables, like the api url, when spinning a docker container of the app (at runtime). Something like this:

`docker run -e "REACT_APP_API_URL=http://my.todo.api" todoapp`

Which will not work even if you use `process.env.API_URL` in your react project.

> process.env.API_URL will store the build time value, not the runtime one

### The solution
Why not attatch these environment variables to the `window` object, which is accessible by browser's javascript, each time we spin up a container ?

We will do it with a shell script that creates a file `env.js`, attach the system environment variables to the `window` object in this file.

And then we link this script `env.js` in react's `index.html`.

#### Step 1
Let's create the shell script that will read environment variables and write them to `env.js`

```bash
#!/bin/sh

# Since I am going to use nginx image to serve my app, env.js should exists in /usr/share/nginx/html
# This path points to where index.html will exist
ENV_FILE_PATH=/usr/share/nginx/html


# Clear previously created env.js file
rm -rf $ENV_FILE_PATH

# Create it again
touch $ENV_FILE_PATH

## In this file, let's attatch an object called `__ENV__` to the window object
## We don't close the object with } because we will put environment variables in it
echo "window.__ENV__ = {" >> $ENV_FILE_PATH 

# For variable in system environment variables
for line in `env`
do
  # If it starts with `REACT_APP` (because we don't want to expose all environment variables)
  if [ ! -z `echo $line | grep REACT_APP` ];
  then
    # Because SH does not support arrays I can't split the environment variables by '='
    # So I remove '=' and everything after it to get the name, e.x `REACT_APP_API_URL`
    # And I remove '=' and everything before it to get the value, e.x `http://api.todo.com`
    name=`echo $line | sed 's/=.*//'`
    value=`echo $line | sed 's/.*=//'`

    ## Print the name and the value in our __ENV__ object
    ## e.x REACT_APP_API_URL: "http://api.todo.com",
    echo "$name: '$value'," >> $ENV_FILE_PATH
  fi
done

## Finally, close the __ENV__ object in env.js

echo "};" >> $ENV_FILE_PATH

```

Suppose our env is something like this:

```
$ env
SECRET_KEY=securityisamust
REACT_APP_COLOR=red
REACT_APP_MODE=light
DO_NOT_EXPOSE=verysecurepassword
```

The resulting `env.js` after running the script above would be like:

```js
window.__ENV__ = {
REACT_APP_COLOR:"red",
REACT_APP_MODE:"light",
};
```

Now link this `env.js` file in your `index.html`

`<script src="%PUBLIC_URL%/env.js"></script>`

And start using `window.__ENV__` instead of `process.env`.

#### Step 2
Run the shell script each time you spin up the container.

```docker
FROM node:10-alpine as builder

WORKDIR /app
COPY . .

## Build the app
RUN yarn install && yarn build

FROM nginx:alpine as server

## Copy your react app to nginx image
COPY --from=builder /app/build /usr/share/nginx/html

## Copy the script we've written above to /tmp
COPY --from=builder /app/resolve-env.sh /tmp

## Give it permission to be executed
RUN chmod +x /tmp/resolve-env.sh

## Run the shell script each time you spin up the container and then run nginx
CMD ["/bin/sh", "-c", "/tmp/resolve-env.sh && nginx -g \"daemon off;\""]
```

Now try `docker run -e "REACT_APP_API_URL=http://my.todo.api" todoapp` and whish me happy days like the one you've just had.