import React, { createElement } from 'react';
import ReactDOM, {
  render,
  unmountComponentAtNode,
} from 'react-dom';
import uuid from 'uuid/v4';

const appendedElements = {};
let appendElementContainer = null;

function getAppendedElements() {
  return Object.keys(appendedElements).map(key => appendedElements[key]);
}

function updateAppendedElements() {
  const appendedElements = getAppendedElements();

  if (appendedElements.length > 0 && !appendElementContainer) {
    appendElementContainer = document.createElement('div');
    document.body.append(appendElementContainer);
  } else if (appendedElements.length === 0 && appendElementContainer) {
    appendElementContainer.remove();
    unmountComponentAtNode(appendElementContainer);
    appendElementContainer = null;
  }

  if (appendedElements.length) {
    render(<span>{appendedElements}</span>, appendElementContainer);
  }

  window.appendedElements = appendedElements;
}

function addElement(uuid, Component) {
  appendedElements[uuid] = Component;

  updateAppendedElements();
}

function removeElement(uuid) {
  delete appendedElements[uuid];

  updateAppendedElements();
}

function appendBody(WrappedComponent) {
  const wrappedComponentName = WrappedComponent.displayName
    || WrappedComponent.name
    || 'Component';

  class AppendBodyWrapper extends React.Component {
    constructor(props) {
      super(props);

      this.appendedId = uuid();
    }

    componentDidMount() {
      addElement(this.appendedId, createElement(WrappedComponent, Object.assign({}, this.props, { key: `append-body-${this.appendedId}` })));
    }

    componentWillUnmount() {
      removeElement(this.appendedId);
    }

    render() {
      return null;
    }
  }

  AppendBodyWrapper.displayName = `AppendBody(${wrappedComponentName})`;

  return AppendBodyWrapper;
}

export default appendBody;
