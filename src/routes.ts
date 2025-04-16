import {
  RouteLocation,
  Route,
  Routes,
  GetParams,
  PushHistory,
  RouteWithLocation,
  RouteType,
} from './types';
import {
  BrowserRouteType,
  DefaultNestedLevel,
  HashRouteType,
  DefaultRoute,
} from './constant';

class RouterManagement implements RouterManagement {
  #location: RouteLocation = {
    pathname: '/',
    params: {},
    search: {},
    hash: '',
  };
  #routes: Record<string, Route> = DefaultRoute;
  #disposeCb: Record<string, () => void> = {};
  routeType: RouteType = BrowserRouteType;

  getRoutes() {
    return this.#routes;
  }

  #splitPath(path: string) {
    return path.split('/').slice(2);
  }

  #setParamsKeys(paramsKey: string[]) {
    return paramsKey.reduce((obj, key) => ({ ...obj, [key]: '' }), {});
  }

  #setParamsValues({
    paramsKey,
    paramsValue,
  }: {
    paramsKey: string[];
    paramsValue: string[];
  }) {
    return paramsKey.reduce(
      (obj, key, index) => ({ ...obj, [key]: paramsValue[index] ?? '' }),
      {}
    );
  }

  #getQueryString(path: string) {
    const pathWithoutHash = this.#removeHash(path);
    const str = pathWithoutHash.indexOf('?');
    if (str > -1) {
      const queryString = pathWithoutHash.slice(str + 1);
      const queryStringArr = queryString.split('&');

      return queryStringArr.reduce((obj, queryParams) => {
        const [key, value] = queryParams.split('=');

        return { ...obj, [key as string]: value };
      }, {});
    }
    return {};
  }

  #getHash(path: string) {
    const str = path.lastIndexOf('#');
    return str > -1 ? path.slice(str) : '';
  }

  #getParams({ pathname, searchedPathname }: GetParams) {
    const routeInfo = this.#routes[pathname]!;

    const paramsValue = this.#splitPath(searchedPathname);
    const paramsKey = Object.keys(routeInfo.params);

    return this.#setParamsValues({
      paramsKey,
      paramsValue,
    });
  }

  #getPath(inputStr: string) {
    // Define a regular expression pattern to match the desired string
    const pattern = /^\/[a-zA-Z0-9\\-]*|[\\/]/;

    // Find the first match in the input string
    const match = inputStr.match(pattern);

    return match?.[0];
  }

  #checkEqualPath({
    searchedPathname,
    pathname,
  }: {
    searchedPathname: string;
    pathname: string;
  }) {
    const searchPathnameArr =
      this.#removeQueryParamsAndHash(searchedPathname).split('/');
    const pathnameArr = pathname.split('/');
    if (searchPathnameArr.length === pathnameArr.length) {
      return pathnameArr.every(
        (path, index) =>
          path.indexOf(':') >= 0 ||
          (path.indexOf(':') < 0 && searchPathnameArr[index] === path)
      );
    }
    return false;
  }

  #removeQueryParams(path: string) {
    const paramsPos = path.indexOf('?');
    return paramsPos > -1 ? path.slice(0, paramsPos) : path;
  }
  #removeHash(path: string) {
    const hashPosition = path.indexOf('#');
    return hashPosition > -1 ? path.slice(0, hashPosition) : path;
  }
  #removeQueryParamsAndHash(path: string) {
    const pathWithoutHash = this.#removeHash(path);
    return this.#removeQueryParams(pathWithoutHash);
  }

  #getRoute(searchedPathname: string): RouteWithLocation {
    const searchedPath = this.#getPath(searchedPathname);

    let routeData = this.#routes['*']!;
    let pathInfo = '*';

    for (const pathname in this.#routes) {
      const routeInfo = this.#routes[pathname]!;
      const path = this.#getPath(pathname);

      if (!this.#checkEqualPath({ searchedPathname, pathname })) {
        continue;
      }

      pathInfo = pathname;
      if (pathname === searchedPathname) {
        routeData = routeInfo;
        break;
      }

      if (!searchedPath || path === searchedPath) {
        routeData = {
          ...routeInfo,
          params: this.#getParams({
            pathname,
            searchedPathname: this.#removeQueryParamsAndHash(searchedPathname),
          }),
        };
        break;
      }
    }

    return {
      ...routeData,
      pathname: pathInfo,
      search: this.#getQueryString(searchedPathname),
      hash: this.#getHash(searchedPathname),
    };
  }

  #directRoute(routeRenderEle: Element[], routeData: RouteWithLocation) {
    const { nestedLevel } = routeData;
    const routeEle = routeRenderEle[nestedLevel];
    if (routeEle) {
      routeEle.innerHTML = '';
      const element = routeData.element();
      if (element instanceof Promise) {
        element
          .then(el => {
            routeEle?.appendChild(el);
            this.addRouteListeners();
          })
          .catch(err => console.error(err));
      } else {
        routeEle?.appendChild(element);
        this.addRouteListeners();
      }
    }
  }

  #directNestedRoute(searchPathname: string, routeData: RouteWithLocation) {
    console.log('DirectNestedRoute:', { searchPathname, routeData });

    // Otteniamo prima tutti i segmenti del path
    const pathSegments = this.#removeQueryParamsAndHash(searchPathname).split('/').filter(Boolean);
    console.log('Path segments:', pathSegments);

    // Troviamo o creiamo gli outlet necessari
    let currentOutlet = document.querySelector('[data-vanilla-route-ele="router-wrap"]');
    let currentPath = '';

    // Iteriamo attraverso i segmenti del path
    for (let i = 0; i < pathSegments.length; i++) {
      if (!currentOutlet) break;

      currentPath += '/' + pathSegments[i];
      console.log('Processing path:', currentPath);

      const currentRoute = this.#getRoute(currentPath);
      console.log('Current route:', currentRoute);

      // Se siamo all'ultimo segmento, renderizziamo la route corrente
      if (i === pathSegments.length - 1) {
        console.log('Rendering final route in:', currentOutlet);
        // Ripristiniamo il contenuto della rotta parent
        const parentPath = this.#getParentPath(searchPathname, i - 1);
        const parentRoute = this.#getRoute(parentPath);
        const parentElement = parentRoute.element();

        // Svuotiamo l'outlet corrente
        currentOutlet.innerHTML = '';

        // Renderizziamo prima il parent
        if (parentElement instanceof Promise) {
          parentElement
            .then(el => {
              if (currentOutlet) {
                currentOutlet.appendChild(el);
                // Dopo aver renderizzato il parent, renderizziamo la route corrente
                const element = routeData.element();
                if (element instanceof Promise) {
                  element
                    .then(childEl => {
                      const nextOutlet = document.querySelectorAll('[data-vanilla-route-ele="router-wrap"]')[i];
                      if (nextOutlet) {
                        nextOutlet.innerHTML = '';
                        nextOutlet.appendChild(childEl);
                        this.addRouteListeners();
                      }
                    })
                    .catch(err => console.error(err));
                } else {
                  const nextOutlet = document.querySelectorAll('[data-vanilla-route-ele="router-wrap"]')[i];
                  if (nextOutlet) {
                    nextOutlet.innerHTML = '';
                    nextOutlet.appendChild(element);
                    this.addRouteListeners();
                  }
                }
              }
            })
            .catch(err => console.error(err));
        } else {
          currentOutlet.appendChild(parentElement);
          // Dopo aver renderizzato il parent, renderizziamo la route corrente
          const element = routeData.element();
          if (element instanceof Promise) {
            element
              .then(childEl => {
                const nextOutlet = document.querySelectorAll('[data-vanilla-route-ele="router-wrap"]')[i];
                if (nextOutlet) {
                  nextOutlet.innerHTML = '';
                  nextOutlet.appendChild(childEl);
                  this.addRouteListeners();
                }
              })
              .catch(err => console.error(err));
          } else {
            const nextOutlet = document.querySelectorAll('[data-vanilla-route-ele="router-wrap"]')[i];
            if (nextOutlet) {
              nextOutlet.innerHTML = '';
              nextOutlet.appendChild(element);
              this.addRouteListeners();
            }
          }
        }
      }
      // Altrimenti, renderizziamo il parent e troviamo il prossimo outlet
      else {
        if (currentOutlet.children.length === 0) {
          console.log('Rendering parent route');
          const element = currentRoute.element();
          if (element instanceof Promise) {
            element
              .then(el => {
                if (currentOutlet) {
                  currentOutlet.appendChild(el);
                  this.addRouteListeners();
                }
                // Aggiorniamo currentOutlet dopo che il parent è stato renderizzato
                const nextOutlet = document.querySelectorAll('[data-vanilla-route-ele="router-wrap"]')[i + 1];
                currentOutlet = nextOutlet || null;
              })
              .catch(err => console.error(err));
          } else {
            currentOutlet.appendChild(element);
            this.addRouteListeners();
            // Aggiorniamo currentOutlet dopo che il parent è stato renderizzato
            const nextOutlet = document.querySelectorAll('[data-vanilla-route-ele="router-wrap"]')[i + 1];
            currentOutlet = nextOutlet || null;
          }
        } else {
          // Se il parent è già renderizzato, troviamo il prossimo outlet
          const nextOutlet = document.querySelectorAll('[data-vanilla-route-ele="router-wrap"]')[i + 1];
          currentOutlet = nextOutlet || null;
        }
      }
    }
  }

  #getParentPath(path: string, level: number): string {
    const parts = this.#removeQueryParamsAndHash(path).split('/').filter(Boolean);
    return '/' + parts.slice(0, level + 1).join('/');
  }

  #updateHistory({
    addToHistory,
    replaceState,
    state,
    pathname,
  }: PushHistory & {
    pathname: string;
    replaceState?: boolean;
  }) {
    if (replaceState) {
      history.replaceState(state, '', pathname);
    } else if (addToHistory) {
      history.pushState({ ...state, pathname }, '', pathname);
    }
  }

  #unMount() {
    const { pathname: closingRoutePath } = this.getLocation();
    this.#disposeCb[closingRoutePath]?.();
    delete this.#disposeCb[closingRoutePath];
  }

  #isNotSameRoute(searchPathname: string) {
    const { pathname: closingRoutePath } = this.getLocation();
    return closingRoutePath === '/' || closingRoutePath !== searchPathname;
  }

  #routePath(pathname: string) {
    if (this.routeType === HashRouteType) {
      return pathname.slice(2);
    }
    return pathname;
  }

  #push(searchPathname: string, options?: PushHistory, replaceState = false) {
    const routePath = this.#routePath(searchPathname);
    if (this.#isNotSameRoute(routePath)) {
      console.log('Push:', { routePath, searchPathname });

      const { state = {}, addToHistory = true } = options ?? {};
      const routeData = this.#getRoute(routePath);
      const { params, search, hash, pathname } = routeData;

      this.#unMount();

      this.#setLocation({ pathname: routePath, params, search, hash });

      this.#updateHistory({
        addToHistory,
        replaceState,
        state,
        pathname: searchPathname,
      });

      const routeRenderEle = [
        ...document.querySelectorAll('[data-vanilla-route-ele="router-wrap"]'),
      ];

      console.log('Route data:', routeData);

      if (routeData.isSubRoute) {
        this.#directNestedRoute(routePath, routeData);
      } else {
        // Se non è una subroute, pulisci tutti gli outlet e renderizza nella root
        routeRenderEle.forEach(ele => {
          ele.innerHTML = '';
        });
        const rootOutlet = routeRenderEle[0];
        if (rootOutlet) {
          const element = routeData.element();
          if (element instanceof Promise) {
            element
              .then(el => {
                rootOutlet.appendChild(el);
                this.addRouteListeners();
              })
              .catch(err => console.error(err));
          } else {
            rootOutlet.appendChild(element);
            this.addRouteListeners();
          }
        }
      }

      window.scrollTo(0, 0);
    }
  }

  #removeListeners() {
    const links = document.querySelectorAll('a[data-vanilla-route-link="spa"]');
    if (links) {
      links.forEach(link => {
        link.removeEventListener('click', this.#handleClick);
      });
    }
  }

  #handleClick = (event: Event) => {
    event.preventDefault();
    const target = event.target as Element;
    const link = target.closest('a[data-vanilla-route-link="spa"]');
    const href = link?.getAttribute('href') ?? '';
    this.go(href);
  };

  addRouteListeners() {
    this.#removeListeners();
    const links = document.querySelectorAll('a[data-vanilla-route-link="spa"]');
    if (links) {
      links.forEach(link => {
        link.addEventListener('click', this.#handleClick);
      });
    }
  }

  #onRouteChange(pathname: string) {
    const event = new CustomEvent('routeChange', { detail: { pathname } });
    window.dispatchEvent(event);
    // Riattacca i listener dopo il cambio di route
    this.addRouteListeners();
  }

  // route change
  go(searchPathname: string, options?: PushHistory) {
    if (this.routeType === HashRouteType && !searchPathname.startsWith('/#')) {
      searchPathname = `/#` + searchPathname;
    }

    this.#onRouteChange(searchPathname);

    this.#push(searchPathname, options);
  }

  dispose<T extends () => void>(cb: T) {
    if (cb) {
      const { pathname } = this.getLocation();
      this.#disposeCb[pathname] = cb;
    }
  }

  #setLocation(obj: RouteLocation) {
    this.#location = obj;
  }
  getLocation() {
    return this.#location;
  }

  addRouteChangeListener(listener: (pathname: string) => void) {
    window.addEventListener('routeChange', (event: Event) => {
      const routeChangeEvent = event as CustomEvent<{ pathname: string }>;
      listener(routeChangeEvent.detail.pathname);
    });
  }

  back() {
    window.history.back();
  }
  forward() {
    window.history.forward();
  }
  refresh() {
    window.location.reload();
  }
  replace(searchPathname: string, state?: PushHistory['state']) {
    let pathname = searchPathname;
    if (this.routeType === HashRouteType) {
      pathname = `/#${searchPathname}`;
    }
    this.#push(pathname, { state, addToHistory: false }, true);
  }

  #routeConfig(
    routeData: Routes[],
    basePath = '',
    nestedLevel = DefaultNestedLevel
  ) {
    routeData.forEach(routeInfo => {
      const pathname = `${basePath}${routeInfo.pathname}`;
      const paramsKey = this.#splitPath(pathname.replaceAll(':', ''));
      this.#routes[pathname] = {
        element: routeInfo.element,
        params:
          pathname.indexOf(':') >= 0 ? this.#setParamsKeys(paramsKey) : {},
        isSubRoute: Boolean(basePath),
        nestedLevel,
      };
      if (routeInfo.children) {
        this.#routeConfig(routeInfo.children, pathname, nestedLevel + 1);
      }
    });
  }

  // route config
  config(routeData: Routes[], basePath = '') {
    this.#routeConfig(routeData, basePath);
  }

  registerRouteLink(elements: HTMLAnchorElement | HTMLAnchorElement[] | NodeListOf<HTMLAnchorElement>) {
    if (elements instanceof NodeList || Array.isArray(elements)) {
      elements.forEach(link => link.addEventListener('click', this.#handleClick));
    } else {
      elements.addEventListener('click', this.#handleClick);
    }
  }
}

class RouterSetup extends RouterManagement {
  #routeSetup: boolean = false;

  // initialize the router
  #init(routeType: RouteType, routeData: Routes[]) {
    this.routeType = routeType;
    this.#checkRouteSetup();
    this.config(routeData);
    this.#backListener();
    this.addRouteListeners();
  }

  // take the user on the previous route on using the the browser back functionality
  #backListener() {
    window.addEventListener('popstate', (event: PopStateEvent) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const { pathname = '' } = event.state || {};
      if (pathname) {
        this.go(pathname as string, { state: {}, addToHistory: false });
      }
    });
  }

  #checkRouteSetup() {
    if (this.#routeSetup) {
      this.go('/404');
      throw new Error(
        'In the application you can only have 1 Route setup using either browserRoute() or hashRoute().'
      );
    }
    this.#routeSetup = true;
  }

  #appendHash() {
    const links: NodeListOf<HTMLAnchorElement> = document.querySelectorAll(
      'a[data-vanilla-route-link="spa"]'
    );
    if (links) {
      links.forEach(link => {
        const pathname = link.href.slice(link.origin.length);
        link.href = `/#${pathname}`;
      });
    }
  }

  // initial browser route
  browserRoute(routeData: Routes[]) {
    const { origin, href } = new URL(window.location.href);
    this.#init(BrowserRouteType, routeData);
    const pathname = href.slice(origin.length);
    // Should render route html after the this.#routes is set.
    this.go(pathname);
  }

  // initial hash route
  hashRoute(routeData: Routes[]) {
    const { origin, href } = new URL(window.location.href);
    this.#init(HashRouteType, routeData);
    let pathname = href.slice(origin.length);
    this.#appendHash();
    if (!pathname.startsWith('/#')) {
      pathname = `/#${pathname}`;
      window.location.href = `${origin}${pathname}`;
    }
    // Should render route html after the this.#routes is set.
    this.go(pathname);
  }
}

const Router = new RouterSetup();

const BrowserRoute = (routes: Routes[]) => Router.browserRoute(routes);

const HashRoute = (routes: Routes[]) => Router.hashRoute(routes);

const routeLocation = () => Router.getLocation();

const router = () => Router.getRoutes();

export { BrowserRoute, HashRoute, Router, routeLocation, router };