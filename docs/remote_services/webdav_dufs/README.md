# dufs WebDAV

## Get the server ready

Download a current dufs release from <https://github.com/sigoden/dufs/releases> and save it in a folder. Add its path to the environment.

## Start dufs

Run the server from a terminal. You can change the example address (`127.0.0.1`), username (`user1`), and password (`pass1`) as needed:

```bash
dufs -A --enable-cors --bind 127.0.0.1 --port 8080 --auth user1:pass1@/:rw
```

## Connect from Remotely Sync

Select WebDAV in Remotely Sync settings and enter the server address, account, and **WebDAV password** (not your account password). Click **Check Connectivity**, then sync.
