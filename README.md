# Laraberg JS

This package is a Work In Progress. It aims to seperate the Javascript frontend from Laraberg so it can be maintained seperately, and maybe serve as a starting point for other backend implementations.

## Usage

To use the editor simply create a input or textarea element and use it to initalize it like this:

```js
import { initializeLaraberg } from 'mauricewijnia/laraberg-js'

const element = document.querySelector('#content')
initializeLaraberg(element)
```