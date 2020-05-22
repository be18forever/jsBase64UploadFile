function loadjscssfile(filename, filetype) {

    if (filetype == "js") {
        var fileref = document.createElement('script');
        fileref.setAttribute("type", "text/javascript");
        fileref.setAttribute("src", filename);
    } else if (filetype == "css") {

        var fileref = document.createElement('link');
        fileref.setAttribute("rel", "stylesheet");
        fileref.setAttribute("type", "text/css");
        fileref.setAttribute("href", filename);
    }
    if (typeof fileref != "undefined") {
        document.getElementsByTagName("head")[0].appendChild(fileref);
    }

}

jQuery.queryString = function (query) {
    var search = window.location.search + '';
    if (search.charAt(0) != '?') {
        return undefined;
    } else {
        search = search.replace('?', '').split('&');
        for (var i = 0; i < search.length; i++) {
            if (search[i].split('=')[0] == query) {
                return decodeURI(search[i].split('=')[1]);
            }
        }
        return undefined;
    }
};

function ShowModal(options) {
    //title contentele funsave funcancel
    window.curmodal = null;
    var modalId = 'myModal';
    if (options.modalId) modalId = options.modalId
    var modal = $('#' + modalId).clone();
    modal.find('.modal-title').text(options.title);
    modal.find('.modal-body').empty();
    modal.find('.modal-body').append(options.contentele);
    if (options.saveText) modal.find('#btnSave').text(options.saveText);
    if (options.cancelText) modal.find('#btnCancel').text(options.cancelText);
    modal.find('#btnSave i').hide();
    modal.find('#btnSave').removeAttr('disabled');
    options.modal = modal;
    modal.find('#btnSave').bind('click', options, function (e) {

        e.data.modal.find('.valid').click();
        var vaildfail = false;
        e.data.modal.find('[required]').each(function (i, o) {
            if (o.checkValidity() == false) {
                $(o).css('background-color', '#FF8D8D');
                $(o).bind('focus', $(o), function (e) {
                    e.data.css('background-color', '');
                });
                vaildfail = true;
                return;
            } else {
                $(o).attr('title', '');
            }
        });
        if (vaildfail == true) return;
        options.funsave(e);
        //modal.remove();
    });
    if (options.styleValue) {
        modal.find('.modal-dialog').css(
			options.styleValue
		);
    }
    modal.find('#btnCancel').bind('click', options, function (e) {


        options.funcancel(e);
        //modal.remove();
    });
    modal.on('show.bs.modal', function (event) {
        adjustBody_beforeShow();
    });
    modal.on('hidden.bs.modal', modal, function (e) {
        e.data.remove();
        adjustBody_afterShow();
    });
    //modal.find('#btnCancel').bind('click', options, options.funcancel);
    modal.modal({
        keyboard: false,
        backdrop: 'static'
    });
    window.curmodal = modal;
    var heeader = modal.find('.modal-header');
    heeader.unbind('mousedown');
    heeader.unbind('mouseup');
    heeader.unbind('mouseleave');
    heeader.unbind('mousemove');
    heeader.bind('mousedown', function (e) {
        heeader.css('cursor', 'move');
        var y = parseFloat(window.curmodal.find('.modal-dialog').css('top').replace('px', ''));
        var x = parseFloat(window.curmodal.find('.modal-dialog').css('left').replace('px', ''));
        if (isNaN(x)) x = 0;
        if (isNaN(y)) y = 0;
        var eve = e || window.event;
        window.mouse_x = eve.clientX - x;
        window.mouse_y = eve.clientY - y;
        window.modalHeaderMDown = true;

    });
    heeader.bind('mouseup', function () {
        heeader.css('cursor', 'default');
        window.modalHeaderMDown = false;
    });
    heeader.bind('mouseleave', function () {
        heeader.css('cursor', 'default');
        window.modalHeaderMDown = false;
    });
    heeader.bind('mousemove', function (e) {
        if (window.modalHeaderMDown == true) {
            var eve = e || window.event;
            var mouse_x = eve.clientX - window.mouse_x;
            var mouse_y = eve.clientY - window.mouse_y;
            if (mouse_y <= -30) mouse_y = -30;
            window.curmodal.find('.modal-dialog').css('top', mouse_y);
            window.curmodal.find('.modal-dialog').css('left', mouse_x);
        }


    });

    return modal;
}

function adjustBody_beforeShow() {
    var body_scrollHeight = $('body')[0].scrollHeight;
    var docHeight = document.documentElement.clientHeight;
    if (body_scrollHeight > docHeight) {
        $('body').css({
            'overflow': 'hidden',
            'margin-right': '15px'
        });
        $('.modal').css({
            'overflow-y': 'scroll'
        });
    } else {
        $('body').css({
            'overflow': 'auto',
            'margin-right': '0'
        });
        $('.modal').css({
            'overflow-y': 'auto'
        });
    }
}
function adjustBody_afterShow() {
    var body_scrollHeight = $('body')[0].scrollHeight;
    var docHeight = document.documentElement.clientHeight;
    if (body_scrollHeight > docHeight) {
        $('body').css({
            'overflow': 'auto',
            'margin-right': '0'
        });
    } else {
        $('body').css({
            'overflow': 'auto',
            'margin-right': '0'
        });
    }
}

var BootstrapPager = {
    Init: function (obj) {
        /// <summary>
        /// 初始化翻页控件
        /// </summary>
        /// <param name="obj" type="object">
        /// 对象参数
        /// * selector jQuery 选择器参数
        /// * pageSize 页大小
        /// * curPageIndex 目前页索引从1开始
        /// * pagerNumberCount 显示几个翻页数
        /// * totalItemCount 总记录数
        /// * prevNumberCount 显示多少个当前页面前数字
        /// * OnClick 点击方法 包含1参数index
        /// </param>
        /// <returns type="null" />
        var selector = '';
        selector = obj.selector;
        var pager = obj.selector;
        if (typeof (pager) == 'string') {
            if (obj.Modal != null) {
                pager = obj.Modal.find(selector);
            }
            else
                pager = $(selector);
        }

        pager.empty();
        pager.addClass('pagination');
        pager.append($('<li class="prev"><a toIndex="1" href="#">First</a></li>'));
        pager.append($('<li class="prev"><a toIndex="' + (obj.curPageIndex - 1) + '" href="#">Previous</a></li>'));
        if (obj.curPageIndex <= 1) pager.find('.prev').addClass('disabled');
        var totalPageCount = Math.ceil(obj.totalItemCount / obj.pageSize);
        var startPage = obj.curPageIndex - obj.prevNumberCount;
        if (startPage < 1) startPage = 1;
        for (var i = 0; i < obj.pagerNumberCount && startPage <= totalPageCount; i++) {
            var li = $('<li><a toIndex="' + (startPage) + '" href="#">' + startPage + '</a></li>');
            if (startPage == obj.curPageIndex) li.addClass('active');
            pager.append(li);
            startPage++;
        }
        pager.append($('<li class="next"><a toIndex="' + (obj.curPageIndex + 1) + '" href="#">Next</a></li>'));
        pager.append($('<li class="next"><a toIndex="' + totalPageCount + '" href="#">Last</a></li>'));
        if (obj.curPageIndex >= totalPageCount) pager.find('.next').addClass('disabled');
        pager.find('a').bind('click', obj, function (e) {
            if ($(e.target).parent().hasClass('disabled') == true) return;
            var indexClicked = parseInt($(e.target).attr('toindex'));

            if (indexClicked != obj.curPageIndex) {
                obj.OnClick(indexClicked, e.data);
            }
        });


    }
};
window.BootstrapPager = BootstrapPager;

var MD5 = {
    hexcase: 0,
    b64pad: "",
    chrsz: 8,
    hex_md5: function (s) {
        return this.binl2hex(this.core_md5(this.str2binl(s), s.length * this.chrsz));
    },
    b64_md5: function (s) {
        return this.binl2b64(this.core_md5(this.str2binl(s), s.length * this.chrsz));
    },
    hex_hmac_md5: function (key, data) {
        return this.binl2hex(core_hmac_md5(key, data));
    },
    b64_hmac_md5: function (key, data) {
        return binl2b64(core_hmac_md5(key, data));
    },
    calcMD5: function calcMD5(s) {
        return this.binl2hex(this.core_md5(this.str2binl(s), s.length * this.chrsz));
    },

    md5_vm_test: function () {
        return this.hex_md5("abc") == "900150983cd24fb0d6963f7d28e17f72";
    },

    core_md5: function (x, len) {

        x[len >> 5] |= 0x80 << ((len) % 32);
        x[(((len + 64) >>> 9) << 4) + 14] = len;
        var a = 1732584193;
        var b = -271733879;
        var c = -1732584194;
        var d = 271733878;
        for (var i = 0; i < x.length; i += 16) {
            var olda = a;
            var oldb = b;
            var oldc = c;
            var oldd = d;

            a = this.md5_ff(a, b, c, d, x[i + 0], 7, -680876936);
            d = this.md5_ff(d, a, b, c, x[i + 1], 12, -389564586);
            c = this.md5_ff(c, d, a, b, x[i + 2], 17, 606105819);
            b = this.md5_ff(b, c, d, a, x[i + 3], 22, -1044525330);
            a = this.md5_ff(a, b, c, d, x[i + 4], 7, -176418897);
            d = this.md5_ff(d, a, b, c, x[i + 5], 12, 1200080426);
            c = this.md5_ff(c, d, a, b, x[i + 6], 17, -1473231341);
            b = this.md5_ff(b, c, d, a, x[i + 7], 22, -45705983);
            a = this.md5_ff(a, b, c, d, x[i + 8], 7, 1770035416);
            d = this.md5_ff(d, a, b, c, x[i + 9], 12, -1958414417);
            c = this.md5_ff(c, d, a, b, x[i + 10], 17, -42063);
            b = this.md5_ff(b, c, d, a, x[i + 11], 22, -1990404162);
            a = this.md5_ff(a, b, c, d, x[i + 12], 7, 1804603682);
            d = this.md5_ff(d, a, b, c, x[i + 13], 12, -40341101);
            c = this.md5_ff(c, d, a, b, x[i + 14], 17, -1502002290);
            b = this.md5_ff(b, c, d, a, x[i + 15], 22, 1236535329);
            a = this.md5_gg(a, b, c, d, x[i + 1], 5, -165796510);
            d = this.md5_gg(d, a, b, c, x[i + 6], 9, -1069501632);
            c = this.md5_gg(c, d, a, b, x[i + 11], 14, 643717713);
            b = this.md5_gg(b, c, d, a, x[i + 0], 20, -373897302);
            a = this.md5_gg(a, b, c, d, x[i + 5], 5, -701558691);
            d = this.md5_gg(d, a, b, c, x[i + 10], 9, 38016083);
            c = this.md5_gg(c, d, a, b, x[i + 15], 14, -660478335);
            b = this.md5_gg(b, c, d, a, x[i + 4], 20, -405537848);
            a = this.md5_gg(a, b, c, d, x[i + 9], 5, 568446438);
            d = this.md5_gg(d, a, b, c, x[i + 14], 9, -1019803690);
            c = this.md5_gg(c, d, a, b, x[i + 3], 14, -187363961);
            b = this.md5_gg(b, c, d, a, x[i + 8], 20, 1163531501);
            a = this.md5_gg(a, b, c, d, x[i + 13], 5, -1444681467);
            d = this.md5_gg(d, a, b, c, x[i + 2], 9, -51403784);
            c = this.md5_gg(c, d, a, b, x[i + 7], 14, 1735328473);
            b = this.md5_gg(b, c, d, a, x[i + 12], 20, -1926607734);
            a = this.md5_hh(a, b, c, d, x[i + 5], 4, -378558);
            d = this.md5_hh(d, a, b, c, x[i + 8], 11, -2022574463);
            c = this.md5_hh(c, d, a, b, x[i + 11], 16, 1839030562);
            b = this.md5_hh(b, c, d, a, x[i + 14], 23, -35309556);
            a = this.md5_hh(a, b, c, d, x[i + 1], 4, -1530992060);
            d = this.md5_hh(d, a, b, c, x[i + 4], 11, 1272893353);
            c = this.md5_hh(c, d, a, b, x[i + 7], 16, -155497632);
            b = this.md5_hh(b, c, d, a, x[i + 10], 23, -1094730640);
            a = this.md5_hh(a, b, c, d, x[i + 13], 4, 681279174);
            d = this.md5_hh(d, a, b, c, x[i + 0], 11, -358537222);
            c = this.md5_hh(c, d, a, b, x[i + 3], 16, -722521979);
            b = this.md5_hh(b, c, d, a, x[i + 6], 23, 76029189);
            a = this.md5_hh(a, b, c, d, x[i + 9], 4, -640364487);
            d = this.md5_hh(d, a, b, c, x[i + 12], 11, -421815835);
            c = this.md5_hh(c, d, a, b, x[i + 15], 16, 530742520);
            b = this.md5_hh(b, c, d, a, x[i + 2], 23, -995338651);
            a = this.md5_ii(a, b, c, d, x[i + 0], 6, -198630844);
            d = this.md5_ii(d, a, b, c, x[i + 7], 10, 1126891415);
            c = this.md5_ii(c, d, a, b, x[i + 14], 15, -1416354905);
            b = this.md5_ii(b, c, d, a, x[i + 5], 21, -57434055);
            a = this.md5_ii(a, b, c, d, x[i + 12], 6, 1700485571);
            d = this.md5_ii(d, a, b, c, x[i + 3], 10, -1894986606);
            c = this.md5_ii(c, d, a, b, x[i + 10], 15, -1051523);
            b = this.md5_ii(b, c, d, a, x[i + 1], 21, -2054922799);
            a = this.md5_ii(a, b, c, d, x[i + 8], 6, 1873313359);
            d = this.md5_ii(d, a, b, c, x[i + 15], 10, -30611744);
            c = this.md5_ii(c, d, a, b, x[i + 6], 15, -1560198380);
            b = this.md5_ii(b, c, d, a, x[i + 13], 21, 1309151649);
            a = this.md5_ii(a, b, c, d, x[i + 4], 6, -145523070);
            d = this.md5_ii(d, a, b, c, x[i + 11], 10, -1120210379);
            c = this.md5_ii(c, d, a, b, x[i + 2], 15, 718787259);
            b = this.md5_ii(b, c, d, a, x[i + 9], 21, -343485551);

            a = this.safe_add(a, olda);
            b = this.safe_add(b, oldb);
            c = this.safe_add(c, oldc);
            d = this.safe_add(d, oldd);
        }
        return Array(a, b, c, d);

    },

    md5_cmn: function (q, a, b, x, s, t) {
        return this.safe_add(this.bit_rol(this.safe_add(this.safe_add(a, q), this.safe_add(x, t)), s), b);
    },
    md5_ff: function (a, b, c, d, x, s, t) {
        return this.md5_cmn((b & c) | ((~b) & d), a, b, x, s, t);
    },
    md5_gg: function (a, b, c, d, x, s, t) {
        return this.md5_cmn((b & d) | (c & (~d)), a, b, x, s, t);
    },
    md5_hh: function (a, b, c, d, x, s, t) {
        return this.md5_cmn(b ^ c ^ d, a, b, x, s, t);
    },
    md5_ii: function (a, b, c, d, x, s, t) {
        return this.md5_cmn(c ^ (b | (~d)), a, b, x, s, t);
    },

    core_hmac_md5: function (key, data) {
        var bkey = this.str2binl(key);
        if (bkey.length > 16) bkey = this.core_md5(bkey, key.length * this.chrsz);

        var ipad = Array(16),
			opad = Array(16);
        for (var i = 0; i < 16; i++) {
            ipad[i] = bkey[i] ^ 0x36363636;
            opad[i] = bkey[i] ^ 0x5C5C5C5C;
        }

        var hash = this.core_md5(ipad.concat(this.str2binl(data)), 512 + data.length * this.chrsz);
        return this.core_md5(opad.concat(hash), 512 + 128);
    },

    safe_add: function (x, y) {
        var lsw = (x & 0xFFFF) + (y & 0xFFFF);
        var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
        return (msw << 16) | (lsw & 0xFFFF);
    },

    bit_rol: function (num, cnt) {
        return (num << cnt) | (num >>> (32 - cnt));
    },

    str2binl: function (str) {
        var bin = Array();
        var mask = (1 << this.chrsz) - 1;
        for (var i = 0; i < str.length * this.chrsz; i += this.chrsz) bin[i >> 5] |= (str.charCodeAt(i / this.chrsz) & mask) << (i % 32);
        return bin;
    },

    binl2hex: function (binarray) {
        var hex_tab = this.hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
        var str = "";
        for (var i = 0; i < binarray.length * 4; i++) {
            str += hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8 + 4)) & 0xF) + hex_tab.charAt((binarray[i >> 2] >> ((i % 4) * 8)) & 0xF);
        }
        return str;
    },

    binl2b64: function (binarray) {
        var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        var str = "";
        for (var i = 0; i < binarray.length * 4; i += 3) {
            var triplet = (((binarray[i >> 2] >> 8 * (i % 4)) & 0xFF) << 16) | (((binarray[i + 1 >> 2] >> 8 * ((i + 1) % 4)) & 0xFF) << 8) | ((binarray[i + 2 >> 2] >> 8 * ((i + 2) % 4)) & 0xFF);
            for (var j = 0; j < 4; j++) {
                if (i * 8 + j * 6 > binarray.length * 32) str += this.b64pad;
                else str += tab.charAt((triplet >> 6 * (3 - j)) & 0x3F);
            }
        }
        return str;
    }

};

var FileHelper = {
    ArrayBufferToBase64: function (buffer) {
        var binary = '';
        var bytes = new Uint8Array(buffer);
        var len = bytes.byteLength;
        for (var i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    },
    //直接读取一个文件的BYTE
    GetOneFileBytes: function (callback) {
        var htmluploader;
        $('#uploadfiles').remove();
        if ($('#uploadfiles').length == 0) {
            htmluploader = $('<input type="file" name="uploadfiles" id="uploadfiles" style="display: none;" />');
            $('body').append(htmluploader);
        } else {
            htmluploader = $('#uploadfiles');
        }
        htmluploader[0].callback = callback;

        htmluploader.one('change', function () {
            $('#uploadfiles').unbind('change');
            var file = this.files[0];
            var fileReader = new FileReader();
            fileReader.readAsArrayBuffer(file);
            fileReader.file = file;
            fileReader.callback = callback;
            fileReader.onload = function (e) {
                var data = e.target.result;
                var datalength = data.byteLength;
                var view = new Uint8Array(data);
                //var array = [];
                //for (var j = 0; j < view.length; j++) {
                //    array.push(view[j]);
                //}



                this.callback(view, e.target.file.name);
            };
            //this.callback(files);

        });
        htmluploader.click();
    },
    //回传MD,FILE对象
    ReadFileMd5: function (ofile, callback) {
        var fileReader = new FileReader();
        var chunks = Math.ceil(ofile.size / this.chunkSize),
			currentChunk = 0;
        var spark = new SparkMD5();
        fileReader.currentChunk = currentChunk;
        fileReader.chunks = chunks;
        fileReader.oFile = ofile;
        fileReader.spark = spark;

        fileReader.onload = function (e) {

            e.target.spark.appendBinary(e.target.result);
            // append binary string
            e.target.currentChunk++;

            if (e.target.currentChunk < e.target.chunks) {
                FileHelper.loadNext(e.target, e.target.currentChunk, e.target.oFile);
            } else {
                callback(e.target.spark.end(), e.target.oFile);

                // compute hash
            }
        };
        this.loadNext(fileReader, fileReader.currentChunk, ofile);
    },
    blobSlice: File.prototype.mozSlice || File.prototype.webkitSlice || File.prototype.slice,
    chunkSize: 2097152,
    loadNext: function (oReader, currentChunk, file) {
        var start = currentChunk * this.chunkSize,
			end = start + this.chunkSize >= file.size ? file.size : start + this.chunkSize;

        oReader.readAsBinaryString(this.blobSlice.call(file, start, end));
    },
    SelectFile: function (callback) {

        var htmluploader;
        $('#uploadfiles').remove();
        if ($('#uploadfiles').length == 0) {
            htmluploader = $('<input type="file" multiple="multiple" name="uploadfiles" id="uploadfiles" style="display: none;" />');
            $('body').append(htmluploader);
        } else {
            htmluploader = $('#uploadfiles');
        }
        htmluploader[0].callback = callback;

        htmluploader.one('change', function () {
            $('#uploadfiles').unbind('change');
            var files = this.files;
            this.callback(files);

        });
        htmluploader.click();

    },
    //上传文件同步方式不是异步,
    UploadFileBytes: function (oFile, buffersize, callback, dataTag) {
        var fileReader = new FileReader();
        fileReader.readAsArrayBuffer(oFile);
        fileReader.file = oFile;
        fileReader.callback = callback;
        fileReader.dataTag = dataTag;
        fileReader.onload = function (e) {
            var data = e.target.result;
            var datalength = data.byteLength;
            for (var i = 0; i < datalength;) {
                var start = i;
                var end = i + buffersize;
                if (end >= datalength) end = datalength - 1;
                var view = new Uint8Array(data.slice(start, end));

                var array = [];

                for (var j = 0; j < view.length; j++) {
                    array.push(view[j]);
                }
                this.callback(array, e.target.dataTag, end / (datalength - 1));
                i = end;
                if (i >= datalength - 1) break;
            }
        };
    },
    GetBytesInSpan: function (oFile, start, end, callback, dataTag) {
        var fileReader = new FileReader();
        fileReader.readAsArrayBuffer(oFile);
        fileReader.file = oFile;
        fileReader.callback = callback;
        fileReader.dataTag = dataTag;
        fileReader.start = start;
        fileReader.end = end;
        fileReader.onload = function (e) {
            var data = e.target.result;
            var view = new Uint8Array(data.slice(e.target.start, e.target.end));
            var array = [];
            for (var j = 0; j < view.length; j++) {
                array.push(view[j]);
            }
            this.callback(array, e.target.dataTag)

        };

    }

}

window.ztreeloaded = false;

window.loadZTree = function () {
    if (ztreeloaded == false) {
        ztreeloaded = true;
        loadjscssfile("/bower_components/ztree/js/jquery.ztree.core-3.5.js", "js");
        loadjscssfile("/bower_components/ztree/js/jquery.ztree.excheck-3.5.js", "js");
        loadjscssfile("/bower_components/ztree/js/jquery.ztree.exedit-3.5.js", "js");
        loadjscssfile("/bower_components/ztree/css/zTreeStyle/zTreeStyle.css", "css");

    }
}
$.prototype.BindTreeDataChooseWindow = function (option) {
    var data = option.data;
    var isMutiple = option.mutiple;
    var title = option.title;
    window.loadZTree();
    this.attr('did', '0');
    this.attr('readonly', '');
    this.unbind("click");
    this.click(function (event) {
        var dids = $(event.target).attr('did').split(',');
        var option = {
            title: title,
            contentele: '<div class="ztree treeDepts"></div>',
            funsave: function () {
                var treeItemChecked;
                if (window.curmodal.showingtree.getSelectedNodes != null && (treeItemChecked == null || treeItemChecked.length == 0))
                    treeItemChecked = window.curmodal.showingtree.getSelectedNodes();
                if (window.curmodal.showingtree.getCheckedNodes != null && (treeItemChecked == null || treeItemChecked.length == 0))
                    treeItemChecked = window.curmodal.showingtree.getCheckedNodes();


                var deptids = [];
                var deptnames = []
                $(treeItemChecked).each(function (i, o) {

                    deptids.push(o.id);
                    deptnames.push(o.name)


                });
                $(event.target).val(deptnames.join(','));
                $(event.target).attr('did', deptids.join(','));
                window.curmodal.modal('hide');
            }
        };
        var showingModal = ShowModal(option);
        $(data).each(function (i, o) {



            for (var i = 0; i < dids.length; i++) {
                if (dids[i] == o.id + "")
                    o.checked = true;
            }
            if (o.checked == null)
                o.checked = false;

        });

        if (isMutiple == true) {
            var setting = {
                view: {
                    showIcon: false
                },
                check: {
                    enable: true,
                    chkboxType: {
                        Y: "ps",
                        N: "ps"
                    }
                },
                data: {
                    simpleData: {
                        enable: true
                    }
                }
            };
            window.curmodal.showingtree = $.fn.zTree.init(showingModal.find('.treeDepts'), setting, data);
        } else {
            var setting = {
                view: {
                    showIcon: false
                },
                data: {
                    simpleData: {
                        enable: true
                    }
                },
                callback: {
                    onClick: function () {
                        curmodal.find('#btnSave').click();
                    }
                }
            };
            window.curmodal.showingtree = $.fn.zTree.init(showingModal.find('.treeDepts'), setting, data);
        }


    });
}
//权限功能过滤
$(function () {
    $('*[permission]').each(function (i, o) {
        var permission = $(o).attr('permission');
        var res = permisssion.filter(function (v) {
            return v.trim() == permission
        }).length >= 1;
        if (res == false) $(o).hide();


    });

});

var Permission = {
    HasPermission: function (p) {
        return permisssion.filter(function (v) {
            return v.trim() == p
        }).length >= 1;
    }
};