# Mobile Web Specialist Certification Course
---
## _Three Stage Course Material Project - Restaurant Reviews: Stage 2_

Developed by [Melanie Archer](https://github.com/mejarc/mws-restaurant-stage-2.git).

A static webpage incrementally converted to a mobile-ready web application.

In **Stage One**, the enhancements included:
* conversion to responsive design
* screen reader accessibility features
* adding a service worker to cache content.

### Installation and usage
* [Clone or download the data client repo](https://github.com/mejarc/mws-restaurant-stage-2.git)

*In a console or terminal, go to the folder on your local computer where you have placed the code, and type

```shell
npm install
```
and then
```shell
grunt
```
to complete installation.

----

Now you will start an HTTP server on your local computer. 
* First, go to the appropriate folder in the code:
````shell
cd ./src
````
One method to start the server is to use a simple Python tool that you probably already have installed on your computer. Try the following:

  * In a console or terminal, check the version of Python you have: 
```shell
python -V
```
  * If you have Python 2.x, start the server by typing this into the console window:
```shell
python -m SimpleHTTPServer 8000
``` 
  * If you have Python 3.x, type:
```shell
python3 -m http.server 8000
```
  * If you don't have Python installed, go to the Python [website](https://www.python.org/) to download and install the software.

----

Now you will handle the data server. 
* Start by [cloning or downloading the data server repo](https://github.com/udacity/mws-restaurant-stage-2.git).


* In a console or terminal, go to the folder on your local computer where you have placed the code, and type

```shell
npm install
```
and then
```shell
npm install sails -g 
```
to complete installation.

* Start the data server by typing:
````shell
node server
````

----

With both of these servers running, visit the site: [http://localhost:8000](http://localhost:8000).
