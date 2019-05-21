/**
 *  lazyload.js
 *
 *  Author   : Ryan Chen
 *  Reference: https://appelsiini.net/projects/lazyload
 *  Version  : 1.0.0
 *  Create   : 2019.05.21
 *  Update   : 2019.05.21
 *  License  : MIT
 */

(function (root, factory) {
    root.LazyLoad = factory(root);
})(window, function (root) {

    var deepCopy = function (p, c) {
        var c = c || {};
        for (var i in p) {
            if (typeof p[i] === 'object') {
                c[i] = (p[i].constructor === Array) ? [] : {};
                deepCopy(p[i], c[i]);
            } else {
                c[i] = p[i];
            }
        }
        //c.uber = p;
        return c;
    };

    function LazyLoad() {
        this.settings = {
            src: 'data-src',
            selector: '.lazyload'
        };
        this.els = document.querySelectorAll(this.settings.selector);
        this.observer = null;
        this.observedEls = [];
        this.init();
    };

    LazyLoad.prototype.init = function () {
        var _self = this;
       
        var intersectionHandler = function (root, el) {
            var elArr = _self.observedEls;
            var offsetTop = el.getBoundingClientRect().top;
            var ViewportHeight = root.innerHeight;
            if (offsetTop >= 0 && offsetTop <= ViewportHeight) {
                var src = el.getAttribute(_self.settings.src);
                if ("img" === el.tagName.toLowerCase()) {
                    if (src) {
                        el.src = src;
                    }
                } else {
                    el.style.backgroundImage = "url(" + src + ")";
                }
                elArr.splice(elArr.indexOf(el), 1);
            };
        };

        var observeEls = function (e) {
            if (_self.observedEls.length  === 0) {
                root.removeEventListener('scroll', observeEls);
                return;
            };
            _self.observedEls.forEach(function (el) {
                intersectionHandler(root, el);
            });
        };

        Array.prototype.forEach.call(this.els, function (el) {
            _self.observedEls.push(el);
        });

        root.addEventListener('scroll', observeEls);
        observeEls();        
    };

    root.lazyload = function() {
        return new LazyLoad();
    };

    return LazyLoad;
});
