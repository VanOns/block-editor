# Block Editor

This package is a Work In Progress. It aims to seperate the Javascript frontend from [Laraberg](https://github.com/VanOns/laraberg) so it can be maintained seperately, and maybe serve as a starting point for other backend implementations.

## Usage

To use the editor simply create a input or textarea element and use it to initalize it like this:

```js
import { initializeEditor } from 'mauricewijnia/block-editor'

const element = document.querySelector('#content')
initializeEditor(element)
```