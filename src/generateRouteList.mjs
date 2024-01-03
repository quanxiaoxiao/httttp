import { match } from 'path-to-regexp';
// @ts-expect-error
import compare from '@quanxiaoxiao/compare';

/**
 * @typedef {{
 *   pathname: string,
 *   urlMatch: (a: string) => null | Object,
 *   match?: (req: Object) => boolean,
 * }} RouteHandler
 */

/**
 * @typedef {Object} RouteItem
 * @property {Object<string, Object>|Array<Object>} [match]
 */

/**
 * @param {Object<string, RouteItem>} data
 */
export default (data) => {
  const pathnameList = Object.keys(data);
  const result = [];
  for (let i = 0; i < pathnameList.length; i++) {
    const pathname = pathnameList[i];
    if (pathname[0] !== '/') {
      console.warn(`route path \`${pathname}\` invalid`);
      continue;
    }
    const d = data[pathname];
    try {
      /** @type {RouteHandler} */
      const routeItem = {
        ...d,
        pathname,
        urlMatch: match(pathname),
        match: d.match ? compare(d.match) : null,
      };
      result.push(routeItem);
    } catch (error) {
      // @ts-expect-error
      console.warn(`parse route fail, ${error.message}`);
      continue;
    }
  }
  return result;
};
