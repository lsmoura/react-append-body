import React, { createElement, cloneElement } from 'react';
import {
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
      this.element = null;
      this.key = `append-body-${this.appendedId}`;
    }

    componentWillReceiveProps(nextProps) {
      this.element = cloneElement(this.element, { ...nextProps, key: this.key });
      addElement(this.appendedId, this.element);
    }

    componentDidMount() {
      this.element = createElement(WrappedComponent, Object.assign({}, this.props, { key: this.key }));
      addElement(this.appendedId, this.element);
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
