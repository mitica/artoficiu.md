var jqLoader = jqLoader || [];
(function () {
    var done = false;
    var script = document.createElement("script"),
        head = document.getElementsByTagName("head")[0] || document.documentElement;
    script.src = 'https://code.jquery.com/jquery-3.2.1.slim.min.js';
    script.type = 'text/javascript';
    script.async = true;
    script.onload = script.onreadystatechange = function () {
        if (!done && (!this.readyState || this.readyState === "loaded" || this.readyState === "complete")) {
            done = true;
            // Process async variable
            while (jqLoader.length) { // there is some syncing to be done
                var obj = jqLoader.shift();
                if (obj[0] == "ready") {
                    $(obj[1]);
                } else if (obj[0] == "load") {
                    $(window).load(obj[1]);
                }
            }
            jqLoader = {
                push: function (param) {
                    if (param[0] == "ready") {
                        $(param[1]);
                    } else if (param[0] == "load") {
                        $(window).load(param[1]);
                    }
                }
            };
            // End of processing
            script.onload = script.onreadystatechange = null;
            if (head && script.parentNode) {
                head.removeChild(script);
            }
        }
    };
    head.insertBefore(script, head.firstChild);
})();