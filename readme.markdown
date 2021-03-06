# react-append-body

[![NPM Version](https://img.shields.io/npm/v/react-append-body.svg?maxAge=2592000)](https://www.npmjs.com/package/react-append-body)

Appends a component outside of the current react tree.

This module modifies an existing React Component to make it render outside
of the current app root dom tree, allowing to easily create modals or other
necessary interfaces.

## Usage

You can simply export the class altered by the `appendBody()` function.

```javascript
import React from 'react';
import appendBody from 'react-append-body';

class HelloWorld extends React.Component {
  render() {
    return (
      <div className="hello-world">
        Hello {this.props.name ? this.props.name : 'World'}
      </div>
    );
  }
}

export default appendBody(HelloWorld);

```

# Author

Sergio Moura

# License

MIT
