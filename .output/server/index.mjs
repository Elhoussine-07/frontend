globalThis.__nitro_main__ = import.meta.url;
import { n as HTTPError, r as defineLazyEventHandler, t as H3Core } from "./_libs/h3+rou3+srvx.mjs";
import { t as HookableCore } from "./_libs/hookable.mjs";
import { r as FastResponse } from "./_libs/h3-v2+rou3+srvx.mjs";
//#region #nitro-vite-setup
function lazyService(loader) {
	let promise, mod;
	return { fetch(req) {
		if (mod) return mod.fetch(req);
		if (!promise) promise = loader().then((_mod) => mod = _mod.default || _mod);
		return promise.then((mod) => mod.fetch(req));
	} };
}
var services = { ["ssr"]: lazyService(() => import("./_ssr/ssr.mjs")) };
globalThis.__nitro_vite_envs__ = services;
//#endregion
//#region #nitro/virtual/public-assets-data
var public_assets_data_default = {
	"/favicon.ico": {
		"type": "image/vnd.microsoft.icon",
		"etag": "\"4f95-3RXc3p2mhEAs1WBwaIvE0Y0uu0Y\"",
		"mtime": "2026-08-03T22:11:48.284Z",
		"size": 20373,
		"path": "../public/favicon.ico"
	},
	"/robots.txt": {
		"type": "text/plain; charset=utf-8",
		"etag": "\"a0-CKGXSIe7TSsqDTmGm/nY1t/o5d0\"",
		"mtime": "2026-08-03T22:11:48.284Z",
		"size": 160,
		"path": "../public/robots.txt"
	},
	"/assets/ActionModal-C7skwSsP.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1d6e-TwU7o7c2x8+ZgceQaX1zNgHMmqg\"",
		"mtime": "2026-08-03T22:11:47.259Z",
		"size": 7534,
		"path": "../public/assets/ActionModal-C7skwSsP.js"
	},
	"/assets/Blocks-BzH4MbVd.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"114c-qIYB6MiQiwJFmGNscfhz22AlbzY\"",
		"mtime": "2026-08-03T22:11:47.259Z",
		"size": 4428,
		"path": "../public/assets/Blocks-BzH4MbVd.js"
	},
	"/assets/DashboardShell-Bl0CR2-t.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"79b3-CsLic01V0oqI38nk3rjLsiFsD6A\"",
		"mtime": "2026-08-03T22:11:47.259Z",
		"size": 31155,
		"path": "../public/assets/DashboardShell-Bl0CR2-t.js"
	},
	"/assets/DataTable-BInR6ndY.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"502-Xy3ORxuwXtkpbiPr523a8/Ubt1Q\"",
		"mtime": "2026-08-03T22:11:47.259Z",
		"size": 1282,
		"path": "../public/assets/DataTable-BInR6ndY.js"
	},
	"/assets/EmptyState-DdAaqtWK.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2281-N7lNzX0DkJ+VTq0Sbpcsu4P8xmQ\"",
		"mtime": "2026-08-03T22:11:47.259Z",
		"size": 8833,
		"path": "../public/assets/EmptyState-DdAaqtWK.js"
	},
	"/assets/ListControls-LUSR97Pb.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"914-lYTT9JWRqS57peCzZY+qhz7q3VE\"",
		"mtime": "2026-08-03T22:11:47.259Z",
		"size": 2324,
		"path": "../public/assets/ListControls-LUSR97Pb.js"
	},
	"/assets/MarketingHeader-B5IcaV_5.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1094-lU51yaIuZeHO7mR3v+cfKKkxjmM\"",
		"mtime": "2026-08-03T22:11:47.259Z",
		"size": 4244,
		"path": "../public/assets/MarketingHeader-B5IcaV_5.js"
	},
	"/assets/Match-DSuj0MtO.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"bddb-QXJQc6p8RUgcPakVvEDCYSpZ6N4\"",
		"mtime": "2026-08-03T22:11:47.259Z",
		"size": 48603,
		"path": "../public/assets/Match-DSuj0MtO.js"
	},
	"/assets/Skeletons-BlNQ1xsH.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7cf-eiX1KaLmzZxjdE4VV28zcSh+iKQ\"",
		"mtime": "2026-08-03T22:11:47.259Z",
		"size": 1999,
		"path": "../public/assets/Skeletons-BlNQ1xsH.js"
	},
	"/assets/SmartBriefing-B_uwetAo.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4b63-EBdQcCWYhBUBaMM8CWnEFfzBrVg\"",
		"mtime": "2026-08-03T22:11:47.259Z",
		"size": 19299,
		"path": "../public/assets/SmartBriefing-B_uwetAo.js"
	},
	"/assets/agence.analytics-CN43VFOX.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"19c4-ZnVAJsaX/khxTcDEK3cvPbVxlPs\"",
		"mtime": "2026-08-03T22:11:47.259Z",
		"size": 6596,
		"path": "../public/assets/agence.analytics-CN43VFOX.js"
	},
	"/assets/agence.facturation-BFIcZwIy.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1e13-W+eUIr3ERhRUul2OSSXUpoXQLbs\"",
		"mtime": "2026-08-03T22:11:47.259Z",
		"size": 7699,
		"path": "../public/assets/agence.facturation-BFIcZwIy.js"
	},
	"/assets/agence.mes-prospections-7gypBq0I.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ec8-Wgp1XU4qGv3ljsbyAyrH7Ck++NA\"",
		"mtime": "2026-08-03T22:11:47.259Z",
		"size": 3784,
		"path": "../public/assets/agence.mes-prospections-7gypBq0I.js"
	},
	"/assets/agence.notifications-DgW1cUh3.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1494-Ki0BEibbdEx9VrvD9W8bmnNEkpk\"",
		"mtime": "2026-08-03T22:11:47.259Z",
		"size": 5268,
		"path": "../public/assets/agence.notifications-DgW1cUh3.js"
	},
	"/assets/agence.opportunites-HmaoDQbg.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1c04-uOInApxx6ZiWPQtL0d9xbCUDBfs\"",
		"mtime": "2026-08-03T22:11:47.259Z",
		"size": 7172,
		"path": "../public/assets/agence.opportunites-HmaoDQbg.js"
	},
	"/assets/agence.parametres-C_qFeYL4.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1cb3-Yyo02mvs2oh/HUlN/wRdZyNp7TM\"",
		"mtime": "2026-08-03T22:11:47.259Z",
		"size": 7347,
		"path": "../public/assets/agence.parametres-C_qFeYL4.js"
	},
	"/assets/agence.profil-B5udUuCL.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1ccc-v2pGNTjtHhNpbUcIIt5bsTG6fog\"",
		"mtime": "2026-08-03T22:11:47.259Z",
		"size": 7372,
		"path": "../public/assets/agence.profil-B5udUuCL.js"
	},
	"/assets/agence.projets-en-cours-BvD7OynD.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"127e-77Z4b9yksRCP5quoBIxMjDO35Yg\"",
		"mtime": "2026-08-03T22:11:47.259Z",
		"size": 4734,
		"path": "../public/assets/agence.projets-en-cours-BvD7OynD.js"
	},
	"/assets/agence.prospection-Mfy0K7zh.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1683-04WBD8eiZ1kc8HkDZ6HK5a83j7c\"",
		"mtime": "2026-08-03T22:11:47.259Z",
		"size": 5763,
		"path": "../public/assets/agence.prospection-Mfy0K7zh.js"
	},
	"/assets/agence.suspension-Do_qIEIq.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1528-F3ck5p3oQISCpq5fvlrqxGyXtsk\"",
		"mtime": "2026-08-03T22:11:47.259Z",
		"size": 5416,
		"path": "../public/assets/agence.suspension-Do_qIEIq.js"
	},
	"/assets/agence.tableau-de-bord-D_0POoPf.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"184a-clsGsiID627bX/jVy5siBb17/AA\"",
		"mtime": "2026-08-03T22:11:47.259Z",
		"size": 6218,
		"path": "../public/assets/agence.tableau-de-bord-D_0POoPf.js"
	},
	"/assets/agence.workflow-1cnKqR7O.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"115b-8nrBJUYm7+gemk5DJRpdyaTC4+k\"",
		"mtime": "2026-08-03T22:11:47.259Z",
		"size": 4443,
		"path": "../public/assets/agence.workflow-1cnKqR7O.js"
	},
	"/assets/agences-BvV2c2Pr.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1a96-sX93bt8lEE0d+SrSRqjxXbwkf4g\"",
		"mtime": "2026-08-03T22:11:47.259Z",
		"size": 6806,
		"path": "../public/assets/agences-BvV2c2Pr.js"
	},
	"/assets/agences._id-CvUyq_zg.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2892-LKY0b4M3GeO1ZRxNB8vKRSTlj4s\"",
		"mtime": "2026-08-03T22:11:47.259Z",
		"size": 10386,
		"path": "../public/assets/agences._id-CvUyq_zg.js"
	},
	"/assets/agency-projects.service-B42bCqOS.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8cf-kUqMNiJRHxRJc6kHpxmVqgg0+9A\"",
		"mtime": "2026-08-03T22:11:47.259Z",
		"size": 2255,
		"path": "../public/assets/agency-projects.service-B42bCqOS.js"
	},
	"/assets/arrow-left-C9U16A_j.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9a-JGDo+sFD0KdOv4267mN1nzIe4G0\"",
		"mtime": "2026-08-03T22:11:47.259Z",
		"size": 154,
		"path": "../public/assets/arrow-left-C9U16A_j.js"
	},
	"/assets/arrow-right-BtRapgIq.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9a-FTEeLj2Y2mZJUjtw1LY+FHigFIM\"",
		"mtime": "2026-08-03T22:11:47.259Z",
		"size": 154,
		"path": "../public/assets/arrow-right-BtRapgIq.js"
	},
	"/assets/auth.service-CKaagPR8.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"69a-jv7vPqo34TNWNmt2cPySAkIW5zA\"",
		"mtime": "2026-08-03T22:11:47.259Z",
		"size": 1690,
		"path": "../public/assets/auth.service-CKaagPR8.js"
	},
	"/assets/auth.store-BvvQ1IU8.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"b4c-XoYC89vMi630o7P8CVDQQeaBl4I\"",
		"mtime": "2026-08-03T22:11:47.259Z",
		"size": 2892,
		"path": "../public/assets/auth.store-BvvQ1IU8.js"
	},
	"/assets/briefcase-D6-o_d9o.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d1-g88zRZgCC0n1lI6VOxjF4DyEiJE\"",
		"mtime": "2026-08-03T22:11:47.259Z",
		"size": 209,
		"path": "../public/assets/briefcase-D6-o_d9o.js"
	},
	"/assets/briefing.store-DVRd1BEU.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"db7-M6eQSZomtuLIqHnwwKPUhm4hmp4\"",
		"mtime": "2026-08-03T22:11:47.259Z",
		"size": 3511,
		"path": "../public/assets/briefing.store-DVRd1BEU.js"
	},
	"/assets/calendar-DGFnWCyD.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f6-cnw8yy59rPS4Ulee7l9Ffr/Wces\"",
		"mtime": "2026-08-03T22:11:47.259Z",
		"size": 246,
		"path": "../public/assets/calendar-DGFnWCyD.js"
	},
	"/assets/calendar-days-DLxpIS8y.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1e3-vK4f5HUcyh3PiELL8PS+adaTCxA\"",
		"mtime": "2026-08-03T22:11:47.259Z",
		"size": 483,
		"path": "../public/assets/calendar-days-DLxpIS8y.js"
	},
	"/assets/check-BnRDkScK.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"71-t7jkCEbmNgPVzAVawccKFuWanLg\"",
		"mtime": "2026-08-03T22:11:47.259Z",
		"size": 113,
		"path": "../public/assets/check-BnRDkScK.js"
	},
	"/assets/chevron-down-Ci_VEm4c.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"75-OegwC6tE0PWi2OiXUwzXlqXPnUU\"",
		"mtime": "2026-08-03T22:11:47.259Z",
		"size": 117,
		"path": "../public/assets/chevron-down-Ci_VEm4c.js"
	},
	"/assets/circle-check-DT13GNZL.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a7-lod5ysheM90JiZf6u61GP5izNbY\"",
		"mtime": "2026-08-03T22:11:47.259Z",
		"size": 167,
		"path": "../public/assets/circle-check-DT13GNZL.js"
	},
	"/assets/client.collaborations-tiny4CVx.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"23ae-H1Z+rN2pUWECe3phKN3FVtcrmGM\"",
		"mtime": "2026-08-03T22:11:47.259Z",
		"size": 9134,
		"path": "../public/assets/client.collaborations-tiny4CVx.js"
	},
	"/assets/client.mes-projets-CZtytv5V.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1c68-VBmNsMQlcpsboV8q5TaqmEa0NNw\"",
		"mtime": "2026-08-03T22:11:47.259Z",
		"size": 7272,
		"path": "../public/assets/client.mes-projets-CZtytv5V.js"
	},
	"/assets/client.mes-projets._id-emLpiAmP.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"26a7-+W9p+T6l9Nms2DAIKUVazepA8Ek\"",
		"mtime": "2026-08-03T22:11:47.259Z",
		"size": 9895,
		"path": "../public/assets/client.mes-projets._id-emLpiAmP.js"
	},
	"/assets/client.mon-profil-DDNlramS.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1750-xEHHsD5Sf0HfLLQh1NK5iGqitW4\"",
		"mtime": "2026-08-03T22:11:47.259Z",
		"size": 5968,
		"path": "../public/assets/client.mon-profil-DDNlramS.js"
	},
	"/assets/client.notifications-DjK0nspP.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"150a-YsvnvLTVgBNYZAuDo0SWbo7Pcuc\"",
		"mtime": "2026-08-03T22:11:47.259Z",
		"size": 5386,
		"path": "../public/assets/client.notifications-DjK0nspP.js"
	},
	"/assets/client.parametres-BaQgeb85.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"14e7-7fjalafqEmbasYeeeo+lM/TC3ps\"",
		"mtime": "2026-08-03T22:11:47.259Z",
		"size": 5351,
		"path": "../public/assets/client.parametres-BaQgeb85.js"
	},
	"/assets/client.postuler-un-projet-CjlTqHhj.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9a-AK2v3UbMwRPZwyB6kCk8FmvCDMk\"",
		"mtime": "2026-08-03T22:11:47.259Z",
		"size": 154,
		"path": "../public/assets/client.postuler-un-projet-CjlTqHhj.js"
	},
	"/assets/connexion-Dbz8JK9A.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2098-3XeKwImILY8aUrSBUKraU136/sw\"",
		"mtime": "2026-08-03T22:11:47.259Z",
		"size": 8344,
		"path": "../public/assets/connexion-Dbz8JK9A.js"
	},
	"/assets/client.tableau-de-bord-DgRbEA6p.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"214e-tfnkAR8OYo+SMtl8rodnymNzuoo\"",
		"mtime": "2026-08-03T22:11:47.259Z",
		"size": 8526,
		"path": "../public/assets/client.tableau-de-bord-DgRbEA6p.js"
	},
	"/assets/disputes.service-Td4yDA2F.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"31f-h+DyXa1WOUfq3ZSmoNNJSZ6Qv5Y\"",
		"mtime": "2026-08-03T22:11:47.259Z",
		"size": 799,
		"path": "../public/assets/disputes.service-Td4yDA2F.js"
	},
	"/assets/dist-BxkmJmVS.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9d4f-RDQ5hZIJoqiqtO5RvpCKPaXF3bY\"",
		"mtime": "2026-08-03T22:11:47.259Z",
		"size": 40271,
		"path": "../public/assets/dist-BxkmJmVS.js"
	},
	"/assets/dropdown-menu-BWNWG0gJ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e100-arLSiTM9afUQkK4hajLQzifm5ws\"",
		"mtime": "2026-08-03T22:11:47.259Z",
		"size": 57600,
		"path": "../public/assets/dropdown-menu-BWNWG0gJ.js"
	},
	"/assets/ellipsis-vertical-BSUkqpJD.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"e0-cR/sjIZpncpogbykwqWrfbOgRu8\"",
		"mtime": "2026-08-03T22:11:47.259Z",
		"size": 224,
		"path": "../public/assets/ellipsis-vertical-BSUkqpJD.js"
	},
	"/assets/eye-B0Uir4i1.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f5-ZqoBTt0PEco5fmRR6h69CqzlwZM\"",
		"mtime": "2026-08-03T22:11:47.259Z",
		"size": 245,
		"path": "../public/assets/eye-B0Uir4i1.js"
	},
	"/assets/fonctionnalites._slug-B3W0m2mb.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"175f-F6aG8Z92CLkg110GpozzzdAGgnQ\"",
		"mtime": "2026-08-03T22:11:47.259Z",
		"size": 5983,
		"path": "../public/assets/fonctionnalites._slug-B3W0m2mb.js"
	},
	"/assets/file-text-BBpHhQtA.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"176-ZL6y2ahJ0bZytFZSahXbf+ooipY\"",
		"mtime": "2026-08-03T22:11:47.259Z",
		"size": 374,
		"path": "../public/assets/file-text-BBpHhQtA.js"
	},
	"/assets/http-CYKKKhke.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"914-glyGjZnRsku/jyZADIQ8lArx8ac\"",
		"mtime": "2026-08-03T22:11:47.259Z",
		"size": 2324,
		"path": "../public/assets/http-CYKKKhke.js"
	},
	"/assets/es2015-Bl2W03kV.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"81d7-DBGs3g23RFSSu+ROlBu05LP0c+M\"",
		"mtime": "2026-08-03T22:11:47.259Z",
		"size": 33239,
		"path": "../public/assets/es2015-Bl2W03kV.js"
	},
	"/assets/image--egAbD2U.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1bf-cfMDG0G7hChzM34OgFzSu65TdMU\"",
		"mtime": "2026-08-03T22:11:47.259Z",
		"size": 447,
		"path": "../public/assets/image--egAbD2U.js"
	},
	"/assets/inscription-agence-CNNliO_a.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2111-MRTrDjwpmLbLZKj3LU36tDXsFyc\"",
		"mtime": "2026-08-03T22:11:47.259Z",
		"size": 8465,
		"path": "../public/assets/inscription-agence-CNNliO_a.js"
	},
	"/assets/index-CwcgmC0c.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"54676-XBnYuFkxyyoem32Stl3kG+sXglg\"",
		"mtime": "2026-08-03T22:11:47.258Z",
		"size": 345718,
		"path": "../public/assets/index-CwcgmC0c.js"
	},
	"/assets/loader-circle-CqpJtwU5.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2b3-RCQY7ff2Vins8T2bJ3/d1nMDFwQ\"",
		"mtime": "2026-08-03T22:11:47.259Z",
		"size": 691,
		"path": "../public/assets/loader-circle-CqpJtwU5.js"
	},
	"/assets/lock-CpIp6Gu3.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"c3-XT7MVN4hKGOfY7JLLWn1cqio/ZI\"",
		"mtime": "2026-08-03T22:11:47.259Z",
		"size": 195,
		"path": "../public/assets/lock-CpIp6Gu3.js"
	},
	"/assets/map-pin-CjZbnW-6.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f8-dsmV+Ak26cM/UjtzupNGYP9Obmc\"",
		"mtime": "2026-08-03T22:11:47.259Z",
		"size": 248,
		"path": "../public/assets/map-pin-CjZbnW-6.js"
	},
	"/assets/mail-D3mZzktb.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ca-VGL/eWYBYWxL5fs5VgLY79IZJxY\"",
		"mtime": "2026-08-03T22:11:47.259Z",
		"size": 202,
		"path": "../public/assets/mail-D3mZzktb.js"
	},
	"/assets/matchContext-BRN1Rnka.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8b-bGUpzGXSqvjmPwpJuCN0euLUXeg\"",
		"mtime": "2026-08-03T22:11:47.259Z",
		"size": 139,
		"path": "../public/assets/matchContext-BRN1Rnka.js"
	},
	"/assets/menu-BO4m0PF2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"16c-RgwGDXFQKtT5ZU5HYn++nsWD+2s\"",
		"mtime": "2026-08-03T22:11:47.259Z",
		"size": 364,
		"path": "../public/assets/menu-BO4m0PF2.js"
	},
	"/assets/notifications.service-BvLpfVmL.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4c1-s/Kfxap2zcpr/7KTfONWqP+1/8s\"",
		"mtime": "2026-08-03T22:11:47.259Z",
		"size": 1217,
		"path": "../public/assets/notifications.service-BvLpfVmL.js"
	},
	"/assets/opportunities.service-DCcv4v5V.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"962-6TecrTrYesFTRDErZo63T34eIUQ\"",
		"mtime": "2026-08-03T22:11:47.259Z",
		"size": 2402,
		"path": "../public/assets/opportunities.service-DCcv4v5V.js"
	},
	"/assets/postuler-un-projet-CjlTqHhj.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9a-AK2v3UbMwRPZwyB6kCk8FmvCDMk\"",
		"mtime": "2026-08-03T22:11:47.259Z",
		"size": 154,
		"path": "../public/assets/postuler-un-projet-CjlTqHhj.js"
	},
	"/assets/profile.service-aqQmd2cT.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"127a-th/cG15ZhZgLgjICf1vDzQRLtNs\"",
		"mtime": "2026-08-03T22:11:47.259Z",
		"size": 4730,
		"path": "../public/assets/profile.service-aqQmd2cT.js"
	},
	"/assets/projets-BJENh_h5.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2132-9sAmQ6FmvlaxUQR9B2epO2xNW+I\"",
		"mtime": "2026-08-03T22:11:47.260Z",
		"size": 8498,
		"path": "../public/assets/projets-BJENh_h5.js"
	},
	"/assets/prospection.service-BMuRUTlK.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"677-hJHp/hS4zg8UPtunLQ4kJKB+uDw\"",
		"mtime": "2026-08-03T22:11:47.260Z",
		"size": 1655,
		"path": "../public/assets/prospection.service-BMuRUTlK.js"
	},
	"/assets/redirect-1Dss4sOM.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"216-AhfiXwQqYdLrM+uQAOtPHfIddmI\"",
		"mtime": "2026-08-03T22:11:47.260Z",
		"size": 534,
		"path": "../public/assets/redirect-1Dss4sOM.js"
	},
	"/assets/route-CGIb0Khc.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"25b-+nSFxpU14BJPsObkmB7x+FDeODM\"",
		"mtime": "2026-08-03T22:11:47.260Z",
		"size": 603,
		"path": "../public/assets/route-CGIb0Khc.js"
	},
	"/assets/routes-DLQB1onv.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1138-bVNEvYP6WgpuJniTFQaYL4e6j58\"",
		"mtime": "2026-08-03T22:11:47.260Z",
		"size": 4408,
		"path": "../public/assets/routes-DLQB1onv.js"
	},
	"/assets/search-TLyp9SsD.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a3-IxwKU2R9qS/H8c2CGCe6596z2ak\"",
		"mtime": "2026-08-03T22:11:47.260Z",
		"size": 163,
		"path": "../public/assets/search-TLyp9SsD.js"
	},
	"/assets/send-DPRo3yIF.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"117-ggRAmJBzmMBv9eJm+eLePRrTMMk\"",
		"mtime": "2026-08-03T22:11:47.260Z",
		"size": 279,
		"path": "../public/assets/send-DPRo3yIF.js"
	},
	"/assets/skeleton-BYP7T-3e.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"dc-XC0zdUvyVdB7cu2o+3xeYb7HJ2o\"",
		"mtime": "2026-08-03T22:11:47.260Z",
		"size": 220,
		"path": "../public/assets/skeleton-BYP7T-3e.js"
	},
	"/assets/sparkles-B950ct8j.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1e3-x2xqozJgKCxNMqgf+2FjIRSa4IE\"",
		"mtime": "2026-08-03T22:11:47.260Z",
		"size": 483,
		"path": "../public/assets/sparkles-B950ct8j.js"
	},
	"/assets/star-DgCFVrGw.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1cd-hNrMZs54rF9/N1KJFu9K/ecPres\"",
		"mtime": "2026-08-03T22:11:47.260Z",
		"size": 461,
		"path": "../public/assets/star-DgCFVrGw.js"
	},
	"/assets/switch-Dum3zP45.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"10c6-TGmAxpnlnggVpFVCtqcOT7An3AI\"",
		"mtime": "2026-08-03T22:11:47.260Z",
		"size": 4294,
		"path": "../public/assets/switch-Dum3zP45.js"
	},
	"/assets/target-ZwqnxjH0.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d7-6aT07grODZUzWTNQdmxynF+zU9c\"",
		"mtime": "2026-08-03T22:11:47.260Z",
		"size": 215,
		"path": "../public/assets/target-ZwqnxjH0.js"
	},
	"/assets/ui-actions-DPlVQehq.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"85-ES/abYXmoiF01DLEGiIKuHVZKCg\"",
		"mtime": "2026-08-03T22:11:47.260Z",
		"size": 133,
		"path": "../public/assets/ui-actions-DPlVQehq.js"
	},
	"/assets/styles-BZS8ybA7.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"14f9b-wEe82vXaQxuLyOARW/8qTRm85cE\"",
		"mtime": "2026-08-03T22:11:47.260Z",
		"size": 85915,
		"path": "../public/assets/styles-BZS8ybA7.css"
	},
	"/assets/shield-check-Bd026sQU.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"135-ncz9sTYT549OqMNTcSJdOhJmkhs\"",
		"mtime": "2026-08-03T22:11:47.260Z",
		"size": 309,
		"path": "../public/assets/shield-check-Bd026sQU.js"
	},
	"/assets/trending-up-CSYhiblT.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"a4-PqHC9ACCgt4ekwGtESyO2FBiMMQ\"",
		"mtime": "2026-08-03T22:11:47.260Z",
		"size": 164,
		"path": "../public/assets/trending-up-CSYhiblT.js"
	},
	"/assets/useStore-B9WcefOa.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6ba9-DyLG3MsOxLBofb+Ep/+VkQIRI0g\"",
		"mtime": "2026-08-03T22:11:47.260Z",
		"size": 27561,
		"path": "../public/assets/useStore-B9WcefOa.js"
	},
	"/assets/users-BScUx4yO.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"127-8jERtk4GQIr4brOUmj5pPgKBVA8\"",
		"mtime": "2026-08-03T22:11:47.260Z",
		"size": 295,
		"path": "../public/assets/users-BScUx4yO.js"
	},
	"/assets/user-round-BySD2vr2.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ab-zWObiPLay1tpakdPIe/atDEFjm0\"",
		"mtime": "2026-08-03T22:11:47.260Z",
		"size": 171,
		"path": "../public/assets/user-round-BySD2vr2.js"
	},
	"/assets/utils-Db1lS0UN.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6f3a-/ZDH20VzONwxJtz64gW64z4t4ns\"",
		"mtime": "2026-08-03T22:11:47.260Z",
		"size": 28474,
		"path": "../public/assets/utils-Db1lS0UN.js"
	},
	"/assets/wallet-CDFSdbpN.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"113-TuduyUFTUQ6xiQ1v+rkX9fHx57E\"",
		"mtime": "2026-08-03T22:11:47.260Z",
		"size": 275,
		"path": "../public/assets/wallet-CDFSdbpN.js"
	},
	"/assets/zod-CoFSu737.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"777e-NlklUzoaE26ODgbB/YsBy79VNPE\"",
		"mtime": "2026-08-03T22:11:47.260Z",
		"size": 30590,
		"path": "../public/assets/zod-CoFSu737.js"
	}
};
//#endregion
//#region #nitro/virtual/public-assets
var publicAssetBases = {};
function isPublicAssetURL(id = "") {
	if (public_assets_data_default[id]) return true;
	for (const base in publicAssetBases) if (id.startsWith(base)) return true;
	return false;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/route-rules.mjs
var headers = ((m) => function headersRouteRule(event) {
	for (const [key, value] of Object.entries(m.options || {})) event.res.headers.set(key, value);
});
//#endregion
//#region #nitro/virtual/routing
var findRouteRules = /* @__PURE__ */ (() => {
	const $0 = [{
		name: "headers",
		route: "/assets/**",
		handler: headers,
		options: { "cache-control": "public, max-age=31536000, immutable" }
	}];
	return (m, p) => {
		let r = [];
		if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1) || "/";
		let s = p.split("/");
		if (s.length > 1) {
			if (s[1] === "assets") r.unshift({
				data: $0,
				params: { "_": s.slice(2).join("/") }
			});
		}
		return r;
	};
})();
var _lazy_dA2yzQ = defineLazyEventHandler(() => import("./_chunks/ssr-renderer.mjs"));
var findRoute = /* @__PURE__ */ (() => {
	const data = {
		route: "/**",
		handler: _lazy_dA2yzQ
	};
	return ((_m, p) => {
		return {
			data,
			params: { "_": p.slice(1) }
		};
	});
})();
[].filter(Boolean);
//#endregion
//#region node_modules/nitro/dist/runtime/internal/error/prod.mjs
var errorHandler = (error, event) => {
	const res = defaultHandler(error, event);
	return new FastResponse(typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2), res);
};
function defaultHandler(error, event) {
	const unhandled = error.unhandled ?? !HTTPError.isError(error);
	const { status = 500, statusText = "" } = unhandled ? {} : error;
	if (status === 404) {
		const url = event.url || new URL(event.req.url);
		const baseURL = "/";
		if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) return {
			status: 302,
			headers: new Headers({ location: `${baseURL}${url.pathname.slice(1)}${url.search}` })
		};
	}
	const headers = new Headers(unhandled ? {} : error.headers);
	headers.set("content-type", "application/json; charset=utf-8");
	return {
		status,
		statusText,
		headers,
		body: {
			error: true,
			...unhandled ? {
				status,
				unhandled: true
			} : typeof error.toJSON === "function" ? error.toJSON() : {
				status,
				statusText,
				message: error.message
			}
		}
	};
}
//#endregion
//#region #nitro/virtual/error-handler
var errorHandlers = [errorHandler];
async function error_handler_default(error, event) {
	for (const handler of errorHandlers) try {
		const response = await handler(error, event, { defaultHandler });
		if (response) return response;
	} catch (error) {
		console.error(error);
	}
}
//#endregion
//#region #nitro/virtual/app
function createNitroApp() {
	const captureError = (error, errorCtx) => {
		if (errorCtx?.event) {
			const errors = errorCtx.event.req.context?.nitro?.errors;
			if (errors) errors.push({
				error,
				context: errorCtx
			});
		}
	};
	const h3App = createH3App({ onError(error, event) {
		return error_handler_default(error, event);
	} });
	let appHandler = (req) => {
		req.context ||= {};
		req.context.nitro = req.context.nitro || { errors: [] };
		return h3App.fetch(req);
	};
	return {
		fetch: appHandler,
		h3: h3App,
		hooks: void 0,
		captureError
	};
}
function createH3App(config) {
	const h3App = new H3Core(config);
	h3App["~findRoute"] = (event) => findRoute(event.req.method, event.url.pathname);
	h3App["~getMiddleware"] = (event, route) => {
		const pathname = event.url.pathname;
		const method = event.req.method;
		const middleware = [];
		const routeRules = getRouteRules(method, pathname);
		event.context.routeRules = routeRules?.routeRules;
		if (routeRules?.routeRuleMiddleware.length) middleware.push(...routeRules.routeRuleMiddleware);
		if (route?.data?.middleware?.length) middleware.push(...route.data.middleware);
		return middleware;
	};
	return h3App;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/app.mjs
var APP_ID = "default";
function useNitroApp() {
	let instance = useNitroApp._instance;
	if (instance) return instance;
	instance = useNitroApp._instance = createNitroApp();
	globalThis.__nitro__ = globalThis.__nitro__ || {};
	globalThis.__nitro__[APP_ID] = instance;
	return instance;
}
function useNitroHooks() {
	const nitroApp = useNitroApp();
	const hooks = nitroApp.hooks;
	if (hooks) return hooks;
	return nitroApp.hooks = new HookableCore();
}
function getRouteRules(method, pathname) {
	const m = findRouteRules(method, pathname);
	if (!m?.length) return { routeRuleMiddleware: [] };
	const routeRules = {};
	for (const layer of m) for (const rule of layer.data) {
		const currentRule = routeRules[rule.name];
		if (currentRule) {
			if (rule.options === false) {
				delete routeRules[rule.name];
				continue;
			}
			if (typeof currentRule.options === "object" && typeof rule.options === "object") currentRule.options = {
				...currentRule.options,
				...rule.options
			};
			else currentRule.options = rule.options;
			currentRule.route = rule.route;
			currentRule.params = {
				...currentRule.params,
				...layer.params
			};
		} else if (rule.options !== false) routeRules[rule.name] = {
			...rule,
			params: layer.params
		};
	}
	const middleware = [];
	const orderedRules = Object.values(routeRules).sort((a, b) => (a.handler?.order || 0) - (b.handler?.order || 0));
	for (const rule of orderedRules) {
		if (rule.options === false || !rule.handler) continue;
		middleware.push(rule.handler(rule));
	}
	return {
		routeRules,
		routeRuleMiddleware: middleware
	};
}
//#endregion
//#region node_modules/nitro/dist/presets/cloudflare/runtime/_module-handler.mjs
function createHandler(hooks) {
	const nitroApp = useNitroApp();
	const nitroHooks = useNitroHooks();
	return {
		async fetch(request, env, context) {
			globalThis.__env__ = env;
			augmentReq(request, {
				env,
				context
			});
			const ctxExt = {};
			const url = new URL(request.url);
			if (hooks.fetch) {
				const res = await hooks.fetch(request, env, context, url, ctxExt);
				if (res) return res;
			}
			return await nitroApp.fetch(request);
		},
		scheduled(controller, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:scheduled", {
				controller,
				env,
				context
			}) || Promise.resolve());
		},
		email(message, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:email", {
				message,
				event: message,
				env,
				context
			}) || Promise.resolve());
		},
		queue(batch, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:queue", {
				batch,
				event: batch,
				env,
				context
			}) || Promise.resolve());
		},
		tail(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:tail", {
				traces,
				env,
				context
			}) || Promise.resolve());
		},
		trace(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:trace", {
				traces,
				env,
				context
			}) || Promise.resolve());
		}
	};
}
function augmentReq(cfReq, ctx) {
	const req = cfReq;
	req.ip = cfReq.headers.get("cf-connecting-ip") || void 0;
	req.runtime ??= { name: "cloudflare" };
	req.runtime.cloudflare = {
		...req.runtime.cloudflare,
		...ctx
	};
	req.waitUntil = ctx.context?.waitUntil.bind(ctx.context);
}
//#endregion
//#region node_modules/nitro/dist/presets/cloudflare/runtime/cloudflare-module.mjs
var cloudflare_module_default = createHandler({ fetch(cfRequest, env, context, url) {
	if (env.ASSETS && isPublicAssetURL(url.pathname)) return env.ASSETS.fetch(cfRequest);
} });
//#endregion
export { cloudflare_module_default as default };
