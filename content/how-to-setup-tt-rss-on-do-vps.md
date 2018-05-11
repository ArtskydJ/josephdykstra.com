---
title: How to set up Tiny Tiny RSS on a Digital Ocean VPS
date: 2018-05-07
---

Setting up [Tiny Tiny RSS](https://tt-rss.org/) can be a bit tricky, even if you have some technical knowledge. I ran into a few issues when I set it up, and found solutions which I thought might come in handy for others who try to set up Tiny Tiny RSS.

## What you need:

- [Digital Ocean](https://www.digitalocean.com/) account
- SSH Client - I use [PuTTY](https://putty.org/) (Windows)

## Create the VPS

Log into your [Digital Ocean](https://www.digitalocean.com/) account, and create a new droplet. Choose the One-Click App called **LAMP on 16.04**.

![Lamp on 16.04](./how-to-setup-ttrss/01-lamp.PNG)

I chose the cheapest, smallest server.

![cheapest server](./how-to-setup-ttrss/02-size.PNG)

Hit **Create**!

## Login to the VPS

Open your SSH client, and log into your new VPS. You will need to copy the IP address from the Digital Ocean dashboard. If you did not add any SSH keys, then you will have to wait for the root password in an email. In my experience, this email can come 30 minutes after creating the server.

Login with the VPS's IP and the username **root**.

![Login to VPS](./how-to-setup-ttrss/05-putty.PNG)

On your first login, you might have to accept the key fingerprint.

![Confirm fingerprint](./how-to-setup-ttrss/06-putty-confirm-fingerprint.PNG)

## Install MySQL

Get the MySQL password by running `cat .digitalocean_password`.

Copy the password. In PuTTY, selecting the text copies it to the clipboard.

![cat digitalocean_password](./how-to-setup-ttrss/07-cat-do-pw.PNG)

Install MySQL by running `mysql_secure_installation --use-default`. When the password prompt pops up, paste the password. (In PuTTY, just right click to paste. You won't see the screen change.) Then press <kbd>Enter</kbd>.

## Set Up MySQL

```bash
mysql --user=root --password=[Your copied password]
mysql> CREATE DATABASE ttrss;
mysql> exit
```

![Create Database](./how-to-setup-ttrss/08-mysql-create-db.PNG)

## Install PHP Plugins

Paste the following commands into the console:

```bash
apt-get update
apt-get install php-mbstring -y
apt-get install php-xml -y
apt-get install php-curl -y
service apache2 restart
```

## Install Tiny Tiny RSS

```bash
cd /var/www/html
git clone https://tt-rss.org/git/tt-rss.git tt-rss
chmod -R 777 tt-rss
```

Visit **[IP]/tt-rss/install/** in your browser, and fill in the fields:

1. Database type is **MySQL**.
2. Username is **root**.
3. Password is the one you copied earlier.
4. Database name is whatever you put after the `CREATE DATABASE` command, in this case **ttrss**.
5. Leave Host name empty. (This is the host name for the database server, which defaults to **localhost**.)
6. Port is **3306**.
7. Tiny Tiny RSS URL should be left as-is.

![Install TTRSS](./how-to-setup-ttrss/09-ttrss-install.PNG)

Press **Test configuration**. I got a minor warning about internationalized domain names, which I ignored.

Press **Initialize database**.

![Init db](./how-to-setup-ttrss/14-ttrss-initialize-db2.PNG)

Press **Save configuration**.

Visit **[IP]/tt-rss/** in your browser.

1. Login is **admin**.
2. Password is **password**.

![Login](./how-to-setup-ttrss/15-login.PNG)

Change the password when you log in!
