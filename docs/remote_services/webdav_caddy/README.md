# Caddy with the `http.handlers.webdav` module

> Adapted from @cyruz-git's [upstream project instructions](https://github.com/remotely-save/remotely-save/issues/825).

## Prerequisites

Download Caddy with the WebDAV module from <https://caddyserver.com/download?package=github.com%2Fmholt%2Fcaddy-webdav>, or install Caddy and then install the plugins. Create a directory for the files, such as `/usr/local/mywebdav`.

## Configure Caddy

Create a file named `Caddyfile` with this configuration:

```caddy
:8080 {
	route /dav/* {
		root /usr/local/mywebdav
		basicauth {
			# Username "Bob", password "hiccup"
			Bob $2a$14$Zkx19XLiW6VYouLHR5NmfOFU0z2GTNmpkT/5qqR7hx4IjWJPDhjvG
		}
		uri strip_prefix /dav
		webdav
	}
}
```

The password hash is generated as described in the [Caddy basic_auth documentation](https://caddyserver.com/docs/caddyfile/directives/basic_auth).

## Connect and verify

Enter the following in Remotely Sync:

- Address: `http://localhost:8080/dav/`
- Username: `Bob`
- Password: `hiccup`
- Auth type: `basic`

Check the connection and sync.
