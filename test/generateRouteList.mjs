import test from 'ava'; // eslint-disable-line
import generateRouteList from '../src/generateRouteList.mjs';

test('1', (t) => {
  t.is(generateRouteList({
    '/aa': {
    },
    '/bb': {
    },
    cc: {
    },
    '/dd': {
      match: 'xxx',
    },
  }).length, 2);
  t.is(generateRouteList({
    '/aa': {
    },
    '/bb': {
    },
    cc: {
    },
    '/dd': {
      match: {},
    },
  }).length, 3);
  t.is(generateRouteList({
    '/aa': {
    },
    '/bb': {
    },
    cc: {
    },
    '/dd': {
      match: {
        method: 'GET',
      },
    },
  }).length, 3);
  t.is(generateRouteList({
    '/aa': {
    },
    '/bb': {
    },
    cc: {
    },
    '/dd': {
      match: [{
        method: 'GET',
      }],
    },
  }).length, 3);
});
