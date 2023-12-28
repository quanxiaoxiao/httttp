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
   *   onPre?: (req: Request) => Promise<void>,
   *   onRequest?: (req: Request) => Promise<void>,
   *   onResponse?: (req: Request, res: Object) => Promise<void>,
   *   onPost?: (req: Request, res: Object) => Promise<void>,
   *   params: Object,
   * }} MatchedHandler
   */

  /** @type {Array<MatchedHandler>} */
  const pathnameMatchedList = [];
  for (let i = 0; i < routeList.length; i++) {
    const item = routeList[i];
    const base = {
      pathname: item.pathname,
      match: item.match,
      onPre: item.onPre,
      onRequest: item.onRequest,
      onResponse: item.onResponse,
      onPost: item.onPost,
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
   *   onPre?: (req: Request) => Promise<void>,
   *   onRequest?: (req: Request) => Promise<void>,
   *   onResponse?: (req: Request, res: Object) => Promise<void>,
   *   onPost?: (req: Request, res: Object) => Promise<void>,
   *   params: Object,
   * }}
   */
  return (request) => {
    for (let i = 0; i < pathnameMatchedList.length; i++) {
      const pathnameMatchedItem = pathnameMatchedList[i];
      const handler = {
        pathname: pathnameMatchedItem.pathname,
        params: pathnameMatchedItem.params,
        onPre: pathnameMatchedItem.onPre,
        onRequest: pathnameMatchedItem.onRequest,
        onResponse: pathnameMatchedItem.onResponse,
        onPost: pathnameMatchedItem.onPost,
      };
      if (!pathnameMatchedItem.match) {
        return handler;
      }
      if (pathnameMatchedItem.match(request)) {
        return handler;
      }
    }
    throw createError(404);
  };
};
