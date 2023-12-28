import test from 'ava'; // eslint-disable-line
import matchRoute from '../src/matchRoute.mjs';

test('1', (t) => {
  t.throws(() => {
    matchRoute([])('/aaa');
  });
  const step1 = matchRoute([
    {
      pathname: '/aaa',
      urlMatch: () => true,
      match: () => false,
    },
  ])('/aaa');
  t.is(typeof step1, 'function');

  t.throws(() => {
    step1({
      pathname: '/aaa',
    });
  });

  t.deepEqual(matchRoute([
    {
      pathname: '/aaa',
      urlMatch: () => true,
      match: () => true,
    },
  ])('/aaa')({
    pathname: '/aaa',
    method: 'GET',
    headers: {},
  }), {
    pathname: '/aaa',
    params: {},
    onPre: undefined,
    onRequest: undefined,
    onPost: undefined,
    onResponse: undefined,
  });

  t.deepEqual(matchRoute([
    {
      pathname: '/aaa',
      urlMatch: () => true,
    },
    {
      pathname: '/bbb',
      urlMatch: () => true,
    },
  ])('/aaa')({
    pathname: '/aaa',
    method: 'GET',
    headers: {},
  }), {
    pathname: '/aaa',
    params: {},
    onPre: undefined,
    onRequest: undefined,
    onPost: undefined,
    onResponse: undefined,
  });
});
