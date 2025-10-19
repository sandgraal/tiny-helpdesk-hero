import test from 'node:test';
import assert from 'node:assert/strict';

import { createToastManager } from '../src/ui/toast.mjs';

function createContainer() {
  const children = [];
  const doc = {
    createElement(tag) {
      return {
        tagName: tag.toUpperCase(),
        className: '',
        dataset: {},
        attributes: new Map(),
        setAttribute(name, value) {
          this.attributes.set(name, value);
        },
        parentNode: null,
        textContent: '',
      };
    },
  };
  return {
    ownerDocument: doc,
    children,
    appendChild(node) {
      node.parentNode = this;
      children.push(node);
      return node;
    },
    removeChild(node) {
      const index = children.indexOf(node);
      if (index >= 0) {
        children.splice(index, 1);
      }
      node.parentNode = null;
      return node;
    },
  };
}

test('creates toast nodes inside the container', () => {
  const container = createContainer();
  const manager = createToastManager({ container });

  manager.show('System preference updated', { tone: 'info', duration: Infinity });

  assert.equal(container.children.length, 1);
  const toast = container.children[0];
  assert.equal(toast.className.includes('toast'), true);
  assert.equal(toast.textContent, 'System preference updated');
  assert.equal(toast.attributes.get('role'), 'status');
});

test('dismisses toast after duration elapses', async () => {
  const container = createContainer();
  const manager = createToastManager({ container, defaultDuration: 5 });

  manager.show('Short toast', { duration: 10 });

  assert.equal(container.children.length, 1);

  await new Promise((resolve) => {
    setTimeout(resolve, 25);
  });

  assert.equal(container.children.length, 0);
});

test('dispose clears active toasts', () => {
  const container = createContainer();
  const manager = createToastManager({ container, defaultDuration: Infinity });

  manager.show('First');
  manager.show('Second');
  assert.equal(container.children.length, 2);

  manager.dispose();

  assert.equal(container.children.length, 0);
});
