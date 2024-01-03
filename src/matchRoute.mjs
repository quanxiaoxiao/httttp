// @ts-expect-error
import createError from 'http-errors';

/** @typedef {import('./generateRouteList.mjs').RouteHandler} RouteHandler */

/**
 * @typedef {{
 *   pathname: string,
 *   method: string,
 *   query: Object,
 *   headers: Object<string, string | number | Array<string>>,
 * }} Request
 */

/**
 * @param {Array<RouteHandler>} routeList
 */
export default (routeList) => (/** @type {string} */ pathname) => {
  /**
   * @typedef {{
   *   pathname: string,
   *   match?: (req: Request) => boolean,
   *   params: Object,
   * }} MatchedHandler
   */

  /** @type {Array<MatchedHandler>} */
  const pathnameMatchedList = [];
  for (let i = 0; i < routeList.length; i++) {
    const item = routeList[i];
    const base = {
      ...item,
      pathname: item.pathname,
      match: item.match,
      params: {},
    };
    if (item.pathname === pathname) {
      pathnameMatchedList.push(base);
    } else {
      const matched = item.urlMatch(pathname);
      if (matched) {
        // @ts-expect-error
        base.params = matched.params || {};
        pathnameMatchedList.push(base);
      }
    }
  }

  if (pathnameMatchedList.length === 0) {
    throw createError(404);
  }

  /**
   * @param {Request} request
   * @returns {{
   *   pathname: string,
   *   params: Object,
   * }}
   */
  return (request) => {
    for (let i = 0; i < pathnameMatchedList.length; i++) {
      const pathnameMatchedItem = pathnameMatchedList[i];
      const keys = Object.keys(pathnameMatchedItem);
      if (!pathnameMatchedItem.match) {
        return {
          pathname: pathnameMatchedItem.pathname,
          params: pathnameMatchedItem.params,
          ...keys.reduce((acc, key) => {
            if (key === 'pathname'
              || key === 'match'
              || key === 'params'
              || key === 'urlMatch'
            ) {
              return acc;
            }
            return {
              ...acc,
              // @ts-expect-error
              [key]: pathnameMatchedItem[key],
            };
          }, {}),
        };
      }
      if (pathnameMatchedItem.match({
        ...request,
        // @ts-expect-error
        params: pathnameMatchedItem.params,
      })) {
        return {
          pathname: pathnameMatchedItem.pathname,
          params: pathnameMatchedItem.params,
          ...keys.reduce((acc, key) => {
            if (key === 'pathname'
              || key === 'match'
              || key === 'params'
              || key === 'urlMatch'
            ) {
              return acc;
            }
            return {
              ...acc,
              // @ts-expect-error
              [key]: pathnameMatchedItem[key],
            };
          }, {}),
        };
      }
    }
    throw createError(404);
  };
};
