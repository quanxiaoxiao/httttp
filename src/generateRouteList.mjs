import { match } from 'path-to-regexp';
// @ts-expect-error
import compare from '@quanxiaoxiao/compare';

/**
 * @typedef {Object} RouteItem
 * @property {Object<string, Object>|Array<Object>} [match]
 * @property {() => Promise<void>} [onPre]
 * @property {() => Promise<void>} [onRequest]
 * @property {() => Promise<void>} [onResponse]
 * @property {() => Promise<void>} [onPost]
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
      /**
        * @type {{
        *   pathname: string,
        *   urlMatch: (a: string) => Object,
        *   match?: (req: Object) => boolean,
        *   onPre?: (req: Object) => Promise<void>,
        *   onRequest?: (req: Object) => Promise<void>,
        *   onResponse?: (req: Object, res: Object) => Promise<void>,
        *   onPost?: (req: Object, res: Object) => Promise<void>,
        * }}
       */
      const routeItem = {
        pathname,
        urlMatch: match(pathname),
        match: d.match ? compare(d.match) : null,
        onPre: d.onPre,
        onRequest: d.onRequest,
        onResponse: d.onResponse,
        onPost: d.onPost,
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
