## Website Performance Optimization portfolio project

### index.html

www.jasonzhai.me/frontend-nanodegree-mobile-portfolio

- async javascript
- css media query and inline css
- load google fonts with javascript
- minification of css, js, html and images

### views/js/main.js

www.jasonzhai.me/frontend-nanodegree-mobile-portfolio/views/pizza.html

#### reduce scripting

- optimize calculating variables inside the For loops
- limit number of animated pizzas to 30
- put all animated pizzas into an array. no need to querySelect them every time.


#### reduce the paint time

in the CSS for the "mover" class.  
  ``` bash
  transform: translateZ(0);
  transform: translate3d(0,0,0);
  ```
to force elements into their own composite layer. the browser will only repaint the pixels that are affected by the moving pizza.
  
