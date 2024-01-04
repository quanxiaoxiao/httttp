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
  });
  t.deepEqual(matchRoute([
    {
      pathname: '/aaa',
      urlMatch: () => true,
      ccc: 'eee',
    },
    {
      pathname: '/bbb',
      urlMatch: () => true,
      ccc: 'aaa',
    },
  ])('/aaa')({
    pathname: '/aaa',
    method: 'GET',
    headers: {},
  }), {
    pathname: '/aaa',
    params: {},
    ccc: 'eee',
  });
});

test('params 1', (t) => {
  t.plan(5);
  const routeMatch = matchRoute([
    {
      pathname: '/bbb',
      urlMatch: (pathname) => {
        t.is(pathname, '/aaa');
        return true;
      },
      match: (d) => {
        t.deepEqual(d.params, {});
        return false;
      },
      ccc: 'ddd',
    },
    {
      pathname: '/aaa',
      urlMatch: () => {
        t.fail();
        return false;
      },
      match: (d) => {
        t.deepEqual(d.params, {});
        return true;
      },
      ccc: 'eee',
    },
    {
      pathname: '/ccc',
      urlMatch: (pathname) => {
        t.is(pathname, '/aaa');
        return false;
      },
      ccc: 'fff',
    },
  ]);
  const matched = routeMatch('/aaa')({
    pathname: '/111',
    method: 'GET',
  });
  t.deepEqual(matched, {
    pathname: '/aaa',
    params: {},
    ccc: 'eee',
  });
});

test('2', (t) => {
  t.plan(3);
  const routeMatch = matchRoute([
    {
      pathname: '/bbb',
      urlMatch: (pathname) => {
        t.is(pathname, '/aaa');
        return true;
      },
      ccc: 'ddd',
    },
    {
      pathname: '/aaa',
      urlMatch: () => {
        t.fail();
        return false;
      },
      match: () => {
        t.fail();
        return true;
      },
      ccc: 'eee',
    },
    {
      pathname: '/ccc',
      urlMatch: (pathname) => {
        t.is(pathname, '/aaa');
        return false;
      },
      ccc: 'fff',
    },
  ]);
  const matched = routeMatch('/aaa')({
    pathname: '/111',
    method: 'GET',
  });
  t.deepEqual(matched, {
    pathname: '/bbb',
    params: {},
    ccc: 'ddd',
  });
});

test('3', (t) => {
  t.plan(3);
  const routeMatch = matchRoute([
    {
      pathname: '/ccc',
      urlMatch: () => {
        t.pass();
        return true;
      },
      match: () => {
        t.pass();
        return false;
      },
      ccc: 'ddd',
    },
  ]);
  const match = routeMatch('/bbb');
  try {
    match({
      pathname: '/bbb',
      method: 'GET',
    });
    t.fail();
  } catch (error) {
    t.is(error.statusCode, 405);
  }
});

test('4', (t) => {
  t.plan(2);
  const routeMatch = matchRoute([
    {
      pathname: '/bbb',
      urlMatch: () => {
        t.fail();
        return true;
      },
      match: () => {
        t.pass();
        return false;
      },
      ccc: 'ddd',
    },
  ]);
  const match = routeMatch('/bbb');
  try {
    match({
      pathname: '/bbb',
      method: 'GET',
    });
    t.fail();
  } catch (error) {
    t.is(error.statusCode, 405);
  }
});

test('5', (t) => {
  const routeMatch = matchRoute([
    {
      pathname: '/bbb',
      urlMatch: () => false,
    },
  ]);
  try {
    routeMatch('/aaa');
    t.fail();
  } catch (error) {
    t.is(error.statusCode, 404);
  }
});
