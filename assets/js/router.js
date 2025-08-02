/**
 * Router berbasis hash sederhana
 * - Mendengarkan perubahan hash
 * - Mem-parsing path dan query
 * - Memanggil callback render(route)
 */

const listeners = [];
let currentRoute = { path: "/", query: {}, hash: "" };

function parseLocation() {
  const raw = location.hash || "#/";
  const [pathPart, queryPart] = raw.slice(1).split("?");
  const path = pathPart || "/";
  const query = {};
  if (queryPart) {
    queryPart.split("&").forEach(pair => {
      const [k, v] = pair.split("=");
      if (!k) return;
      query[decodeURIComponent(k)] = decodeURIComponent(v || "");
    });
  }
  currentRoute = { path, query, hash: raw };
  return currentRoute;
}

function onHashChange() {
  const route = parseLocation();
  listeners.forEach(fn => fn(route));
}

export function initRouter(renderCallback) {
  if (typeof renderCallback === "function") {
    listeners.push(renderCallback);
  }
  window.addEventListener("hashchange", onHashChange);
}

export function navigate(path, query = {}) {
  const qs = Object.keys(query).length
    ? "?" + Object.entries(query).map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join("&")
    : "";
  const target = `#${path.startsWith("/") ? path : `/${path}`}${qs}`;
  if (location.hash === target) {
    // Paksa trigger jika rute sama
    onHashChange();
  } else {
    location.hash = target;
  }
}

export function getCurrentRoute() {
  // Pastikan currentRoute selaras dengan URL saat ini
  if (!location.hash && currentRoute.path !== "/") {
    currentRoute = { path: "/", query: {}, hash: "#/" };
  }
  if ((location.hash || "#/") !== currentRoute.hash) {
    parseLocation();
  }
  return currentRoute;
}