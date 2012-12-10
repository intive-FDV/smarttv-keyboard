var inc_dir = "$MANAGER_WIDGET/Common/IME/";
var inc_dir = "Common/IME/";
var ime_jump_img = "<img src='" + inc_dir + "img/keypad_button_jump.png' width=30px height=15px/>";
var $LANGUAGE$ = ($LANGUAGE$) ? $LANGUAGE$ : new Object();
var bIMEinit = false;
function $(element) {
    return document.getElementById(element);
}
var domNode = document.createElement('link');
domNode.type = 'text/css';
domNode.rel = 'stylesheet';
domNode.href = inc_dir + 'ime2.css';
document.getElementsByTagName("head")[0].appendChild(domNode);
domNode = document.createElement('div');
domNode.id = 'ime_keypad';
domNode.innerHTML = ' \
  <div id="keypad_keyinfo"> \
   <div id="info_l"><img src="' + inc_dir + 'img/keypad_l.png" width="10px" height="15px"/></div> \
   <div id="keypad_keyinfo_text"></div> \
   <div id="info_r"><img src="' + inc_dir + 'img/keypad_r.png" width="10px" height="15px"/></div> \
  </div> \
  <div id="key1" class="key_n"><div class="key_blue">1</div><div id="key1_txt" class="txt"></div></div> \
  <div id="key2" class="key_n"><div class="key_blue">2</div><div id="key2_txt" class="txt"></div></div> \
  <div id="key3" class="key_n"><div class="key_blue">3</div><div id="key3_txt" class="txt"></div></div> \
  <div id="key4" class="key_n"><div class="key_blue">4</div><div id="key4_txt" class="txt"></div></div> \
  <div id="key5" class="key_n"><div class="key_blue">5</div><div id="key5_txt" class="txt"></div></div> \
  <div id="key6" class="key_n"><div class="key_blue">6</div><div id="key6_txt" class="txt"></div></div> \
  <div id="key7" class="key_n"><div class="key_blue">7</div><div id="key7_txt" class="txt"></div></div> \
  <div id="key8" class="key_n"><div class="key_blue">8</div><div id="key8_txt" class="txt"></div></div> \
  <div id="key9" class="key_n"><div class="key_blue">9</div><div id="key9_txt" class="txt"></div></div> \
  <div id="keyl" class="key_n"><div class="key_blue"><img id="keyl_img" src="" width="84px" height="44px"/></div><div id="keyl_txt" class="txt"></div></div> \
  <div id="key0" class="key_n"><div class="key_blue">0</div><div id="key0_txt" class="txt"></div></div> \
  <div id="keyr" class="key_n"><div id="key_prech" class="key_blue">PRE-CH</div><div id="keyr_txt" class="txt"></div></div> \
  <div id="imeWnd" style="background: no-repeat top left;"> \
   <div id="ime_kor">가</div> \
   <div id="ime_latin_small">a</div> \
   <div id="ime_latin_big">A</div> \
   <div id="ime_num">1</div> \
   <div id="ime_special"><img src="' + inc_dir + 'img/keypad_ime_sn.png" width="36px" height="36px"/></div> \
  </div> \
  <div id="keypad_hr" style="background: url(' + inc_dir + 'img/keypad_bg_line.png) no-repeat top left;"></div> \
  <div id="ime_keypad_help"> \
   <div id="ime_keypad_help_mode"> \
    <img src="' + inc_dir + 'img/ime_help_icon_g.png" width="18px" height="18px" /><span id="ime_keypad_help_inputmode"></span> \
   </div> \
   <div id="ime_keypad_help_page"> \
    <img src="' + inc_dir + 'img/ime_help_ffrew_b.png" width="39px" height="18px" /><span id="ime_keypad_help_pagemove"></span> \
   </div> \
  </div> \
';
document.body.appendChild(domNode);
function IMEShell(inputObjId, callbackFunc, IMELanguage, IMEModelid) {
    this.inputObj = $(inputObjId);
    this.maxLengthFunc = null;
    this.onCompleteFunc = null;
    this.imePrevCallFunc = null;
    this.keyFuncArr = new Array();
    this.anyKeyFuncArr = new Array();
    this.keypad_x = 350;
    this.keypad_y = 10;
    this.keypad_z = 9;
    this.modeArr = null;
    this.curMode = 0;
    this.timer = null;
    this.lang_code = null;
    this.core = null;
    this.page = 0;
    this.maxLength = null;
    this.bBlockSpace = false;
    var lang_id;
    var _THIS_ = this;
    var url_query = decodeURI(window.location.search);
    if (!url_query) {
        url_query = "?country=US&language=1&modelid=LNXXB650_USA&server=operating";
    }
    var matched = url_query.match(/([\w_]+)=([\w\d]+)/gi);
    for (var x = 0; x < matched.length; x++) {
        arr = matched[x].match(/([\w_]+)=([\w\d]+)/i);
        if (arr[1] == "language") {
            lang_id = parseInt(arr[2]);
        }
        else if (arr[1] == "modelid") {
            this.area_code = arr[2];
        }
    }
    var bLang = false;
    if (IMELanguage) {
        this.lang_code = IMELanguage;
    } else {
        l_Common = new Common.Util.Language();
        this.lang_code = l_Common.convertCodeToKeyword(lang_id);
    }
    if (IMEModelid) {
        this.area_code = IMEModelid;
    }
    var langArr = ['bg', 'cs', 'da', 'de', 'el', 'en', 'es', 'et', 'fi', 'fr', 'hr', 'hu', 'it', 'ko', 'lt', 'lv', 'nl', 'no', 'pl', 'pt', 'ro', 'ru', 'sk', 'sr', 'sv', 'tr'];
    for (var idx in langArr) {
        if (langArr[idx] == this.lang_code) {
            bLang = true;
        }
    }
    if (bLang == false) {
        if (this.lang_code == "pt-US.js") {
            this.lang_code = "pt";
        }
        this.lang_code = "en";
    }
    alert("including...." + this.lang_code + ".js");
    if (this.inputObj.type == "text" || this.inputObj.type == "textarea") {
        var arrIncludeFiles = new Array(inc_dir + "imecore2.js", inc_dir + "Lang/" + this.lang_code + ".js");
    } else {
        var arrIncludeFiles = new Array(inc_dir + "imecore2.js");
    }
    var iIncludeJavaScript = new Common.Util.Include.JavaScript();
    iIncludeJavaScript.run(arrIncludeFiles, function () {
        _THIS_.init();
    });
    this.init = function () {
        alert("IMEShell Init start - model: " + this.area_code + ", lang: " + this.lang_code);
        switch (this.area_code.substr(this.area_code.length - 4)) {
            case"_KOR":
                this.area_id = IMEvar.AreaCode.KOR;
                break;
            case"_USA":
            case"_BRA":
                this.area_id = IMEvar.AreaCode.USA;
                break;
            case"_TWN":
            default:
                this.area_id = IMEvar.AreaCode.ETC;
                break;
        }
        if (this.inputObj.type == "text" || this.inputObj.type == "textarea") {
            this.modeArr = IMELang.inputModeArr;
        } else {
            this.modeArr = ['_latin_small', '_latin_big', '_num', '_special'];
        }
        this.core = new IMECore(this.area_id, this.modeArr[this.curMode], this.inputObj.type);
        var area_t = {0:Array(inc_dir + "img/keypad_button_enter.png", "7px", "129px"), 1:Array(inc_dir + "img/keypad_button_mode.png", "46px", "17px"), 2:Array(inc_dir + "img/keypad_button_mode.png", "36px", "17px")};
        $("keyl_img").src = area_t[this.area_id][0];
        $("keyr_txt").style.left = area_t[this.area_id][1];
        if (this.area_id == IMEvar.AreaCode.KOR) {
            $("key_prech").innerHTML = "이전채널";
            $("keyl_txt").style.fontSize = "12px";
            $("keyr_txt").style.fontSize = "12px";
            $("keyl_txt").style.left = "28px";
            $("keyr_txt").style.top = "23px";
        }
        if (this.area_id != IMEvar.AreaCode.ETC) {
            $("keyl_txt").innerHTML = $LANGUAGE$.INPUT_MODE;
        }
        $("keyr_txt").innerHTML = $LANGUAGE$.DELETE;
        $("ime_keypad_help_pagemove").innerHTML = $LANGUAGE$.PAGE_MOVE;
        $("ime_keypad_help_inputmode").innerHTML = $LANGUAGE$.INPUT_MODE;
        if (this.area_id == IMEvar.AreaCode.ETC) {
            $("ime_keypad_help_mode").style.display = "block";
        } else {
            $("ime_keypad_help_mode").style.display = "none";
        }
        if (this.inputObj.org_maxLength) {
            this.inputObj.maxLength = this.inputObj.org_maxLength + 1;
            this.maxLength = this.inputObj.maxLength;
        } else if (this.inputObj.maxLength) {
            this.inputObj.org_maxLength = this.inputObj.maxLength;
            this.inputObj.maxLength = this.inputObj.maxLength + 1;
            this.maxLength = this.inputObj.maxLength;
        } else {
            this.maxLength = null;
        }
        this.maxLength = this.inputObj.org_maxLength;
        bIMEinit = true;
        var _THIS_ = this;
        this.inputObj.onkeydown = function () {
            _THIS_._key();
        };
        this.inputObj.onfocus = function () {
            _THIS_._focus();
        }
        this.inputObj.onblur = function () {
            _THIS_._blur();
        }
        callbackFunc(this);
    }
}
IMEShell.prototype._key = function () {
    var EKC = event.keyCode;
    alert("********** input Key: " + EKC);
    this._keyPressed(EKC);
    for (var kc in this.keyFuncArr) {
        if (EKC == kc) {
            if (this.keyFuncArr[kc](EKC) === false) {
                return;
            }
        }
    }
    if (EKC == IMEvar.keyCode.KEY__) {
        this._inputModeChange();
    }
    else if (EKC == IMEvar.keyCode.KEY_P || (this.area_id == IMEvar.AreaCode.KOR && EKC == 70)) {
        this._delete();
    }
    else if (this.inputObj.type == "text" | this.inputObj.type == "textarea") {
        this._textKey(EKC);
    }
    else if (this.inputObj.type == "password") {
        this._passwdKey(this.inputObj, EKC);
    }
    else {
        alert("Please specify input mode (text or password)", 3);
    }
    ;
    var funcStr = "";
    for (i = 0; i < this.anyKeyFuncArr.length; i++) {
        this.anyKeyFuncArr[i](EKC);
        alert("------------ calling " + i + "th AnyKeyFunc");
    }
}
IMEShell.prototype._delete = function () {
    this.core.Delete();
    this._cancelTimer();
    inputText = this.core.GetText();
    this.inputObj.value = inputText;
    this._commitCaretPos();
    if (this.onCompleteFunc) {
        this.onCompleteFunc(this.inputObj.value);
    }
}
IMEShell.prototype._addSpace = function () {
    if (this.bBlockSpace == true) {
        alert("_addSpace Blocked by option");
        return;
    }
    alert("_addSpace begin...");
    var oldText = this.inputObj.value;
    if (this.maxLength && oldText.length >= this.maxLength) {
        alert("*** Max length exceeded! this.maxLength: " + this.maxLength + " ***\n");
        if (this.maxLengthFunc) {
            this.maxLengthFunc();
        }
    }
    else {
        this._commitCaretPos(true)
        this.core.AddSpace();
        this.inputObj.value = this.core.GetText();
        this.inputObj.cursorPosition = this.inputObj.cursorPosition + 1;
        if (this.onCompleteFunc) {
            this.onCompleteFunc(this.inputObj.value);
        }
        alert("_addSpace end.", 3);
    }
}
IMEShell.prototype._focus = function () {
    alert("########## _focus called ########## : " + this.inputObj.id + " ( " + this.modeArr[this.curMode] + " )");
    $("ime_keypad").style.left = this.keypad_x;
    $("ime_keypad").style.top = this.keypad_y;
    $("ime_keypad").style.zIndex = this.keypad_z;
    this.curMode = 0;
    this.core.ChangeInputMode(this.modeArr[this.curMode]);
    if (!bIMEinit) {
        alert("============= IME NOT initialized yet... wait and focus again soon");
        this.inputObj.blur();
        setTimeout("$('" + this.inputObj.id + "').focus()", 200);
        return;
    }
    $('ime_keypad').style.visibility = "visible";
    this._updateModeList();
    if (this.inputObj.type == "password") {
        $("imeWnd").style.backgroundImage = "url(" + inc_dir + "img/keypad_ime_box_4.png)";
        $("imeWnd").style.left = 80;
    } else {
        if (this.modeArr.length == 5) {
            $("imeWnd").style.backgroundImage = "url(" + inc_dir + "img/keypad_ime_box_5.png)";
            $("imeWnd").style.left = 70;
        } else {
            $("imeWnd").style.backgroundImage = "url(" + inc_dir + "img/keypad_ime_box_4.png)";
            $("imeWnd").style.left = 80;
        }
    }
    this.page = 0;
    this._refreshKeypad();
}
IMEShell.prototype._blur = function () {
    alert("########## _blur called ########## : " + this.inputObj.id);
    $('ime_keypad').style.visibility = "hidden";
    this._cancelTimer();
}
IMEShell.prototype._updateModeList = function () {
    var tArr = ['_kor', '_latin_small', '_latin_big', '_num', '_special'];
    for (var i = 0; i < tArr.length; i++) {
        $("ime" + tArr[i]).className = "modeNormal";
        $("ime" + tArr[i]).style.visibility = "hidden";
    }
    for (i = 0; i < this.modeArr.length; i++) {
        $("ime" + this.modeArr[i]).style.visibility = "visible";
        $("ime" + this.modeArr[i]).className = "modeNormal";
        $("ime" + this.modeArr[i]).style.left = 27 * i;
    }
}
IMEShell.prototype._textKey = function (EKC) {
    var inputText, imeCaretPos;
    if (EKC == IMEvar.keyCode.KEY_SPACE || (this.area_id == IMEvar.AreaCode.KOR && EKC == 71)) {
        this._addSpace();
        return;
    }
    switch (EKC) {
        case(4):
            alert("Left Key Pressed....")
            this._cancelTimer();
            imeCaretPos = this.core.PosOfCaret();
            alert("Move Left cursorPos, CaretPos: " + this.inputObj.cursorPosition + " | " + imeCaretPos);
            if (this.core.GetEditMode()) {
                alert("this.core.GetEditMode........................ left");
                this.core.SetPosOfCaret(imeCaretPos);
                this.inputObj.cursorPosition++;
            }
            else {
                if (imeCaretPos == 0 && this.imePrevCallFunc) {
                    this.imePrevCallFunc();
                }
                if (imeCaretPos > 0) {
                    this.core.SetPosOfCaret(imeCaretPos - 1);
                    alert("CURSOR ........................ left");
                }
            }
            return;
            break;
        case(5):
            this._cancelTimer();
            var imeStr = this.core.GetText();
            imeCaretPos = this.core.PosOfCaret();
            if (this.core.GetEditMode()) {
                alert("this.core.GetEditMode........................ right");
                this._commitCaretPos(true);
                this.inputObj.cursorPosition--;
            }
            else {
                if (this.inputObj.cursorPosition == imeStr.length) {
                    alert("Right AddSpace")
                    this._addSpace();
                    return;
                }
                else {
                    alert("CURSOR ........................ right");
                    this.core.SetPosOfCaret(imeCaretPos + 1);
                }
            }
            if (this.onCompleteFunc) {
                this.onCompleteFunc(this.inputObj.value);
            }
            return;
            break;
        case(69):
            if (this.modeArr[this.curMode] == "_special") {
                this.page--;
                if (this.page < 0) {
                    this.page = 3;
                }
                this._refreshKeypad();
            }
            break;
        case(72):
            if (this.modeArr[this.curMode] == "_special") {
                this.page++;
                if (this.page >= 4) {
                    this.page = 0;
                }
                this._refreshKeypad();
            }
            break;
        case(IMEvar.keyCode.KEY_ENTER):
            this._cancelTimer();
            if (this.enterFunc) {
                this.enterFunc(this.inputObj.value);
            }
            break;
        case(88):
        case(45):
            this._blockNavigation(event);
            break;
        default:
            if (this.modeArr[this.curMode] == "_latin_small" || this.modeArr[this.curMode] == "_latin_big") {
                if (EKC == 17) {
                    this._addSpace();
                }
                else {
                    this._transferKey(EKC);
                    return;
                }
            }
            else {
                this._transferKey(EKC);
            }
            break;
    }
}
IMEShell.prototype._passwdKey = function (obj, EKC) {
    var inputText = "";
    var prevText = obj.value;
    var charIndex;
    switch (EKC) {
        case(4):
            alert("cursorPos: " + obj.cursorPosition);
            return;
            break;
        case(5):
            return;
            break;
        case(69):
            if (this.modeArr[this.curMode] == "_latin_small" || this.modeArr[this.curMode] == "_latin_big" || this.modeArr[this.curMode] == "_special") {
                this.page--;
                if (this.page < 0) {
                    this.page = 2;
                }
                this._refreshKeypad();
            }
            break;
        case(72):
            if (this.modeArr[this.curMode] == "_latin_small" || this.modeArr[this.curMode] == "_latin_big" || this.modeArr[this.curMode] == "_special") {
                this.page++;
                if (this.page >= 3) {
                    this.page = 0;
                }
                this._refreshKeypad();
            }
            break;
        case(IMEvar.keyCode.KEY_ENTER):
            this._cancelTimer();
            if (this.enterFunc) {
                this.enterFunc(this.inputObj.value);
            }
            break;
        case(88):
        case(45):
            this._blockNavigation(event);
            return;
            break;
        default:
            this._transferKey(EKC);
            break;
    }
}
IMEShell.prototype._transferKey = function (EKC) {
    var lastchar;
    var oldText = this.inputObj.value;
    var oldCurPos = this.core.PosOfCaret();
    var oldStat = this.core.GetEditMode();
    if (this.core.TransferKeyValue(EKC, this.page) == false) {
        return false;
    }
    var imeStr = this.core.GetText();
    if (oldStat == true) {
        oldCurPos++;
    }
    var lastCharCode = imeStr.charCodeAt(imeStr.length - 1);
    var lastCharCode2 = imeStr.charCodeAt(imeStr.length - 2);
    if ((this.maxLength && imeStr.length > this.maxLength && ((lastCharCode != 183 && lastCharCode != 8229) || lastCharCode2 > 0x318F)) || (this.maxLength && imeStr.length > this.maxLength && this.maxLength > oldCurPos) || (this.maxLength && imeStr.length > this.maxLength + 1)) {
        alert("*** Max length exceeded! this.maxLength: " + this.maxLength + " ***\n");
        this.inputObj.value = oldText;
        this.core.SetString(this.inputObj.value);
        this.core.SetPosOfCaret(oldCurPos);
        if (this.maxLengthFunc) {
            this.maxLengthFunc();
        }
        return;
    }
    this.inputObj.value = imeStr;
    if ((this.modeArr[this.curMode] == "_latin_small" || this.modeArr[this.curMode] == "_latin_big") && (this.lang_code != "ko" && this.lang_code != "en")) {
        $("keypad_keyinfo_text").innerHTML = this.core.GetKeyChars(this.modeArr[this.curMode]);
        $("keypad_keyinfo").style.visibility = "visible";
    }
    if (imeStr.length != oldText.length && !this.core.GetEditMode() && this.onCompleteFunc) {
        this.onCompleteFunc(this.inputObj.value);
    }
    if (oldText != imeStr) {
        this._cancelTimer(true);
        var strr = "imeMoveCaretRight('" + this.inputObj.id + "')";
        var thisObj = this;
        this.timer = setTimeout(function () {
            thisObj._moveCaretRight();
        }, 2000);
        this._commitCaretPos();
        if (this.inputObj.type == "text" && (this.modeArr[this.curMode] == "_kor" || this.modeArr[this.curMode] == "_latin_small" || this.modeArr[this.curMode] == "_latin_big")) {
            var imeCurserPos = this.inputObj.cursorPosition;
            this.inputObj.setSelectionRange(imeCurserPos - 1, imeCurserPos - 1);
        }
    }
    else {
        alert("************ input string is not changed ***************");
    }
    alert("IME value : " + this.inputObj.value)
    alert("-----------------------_______________-----------------------");
    return true;
}
IMEShell.prototype._moveCaretRight = function () {
    if (this.core.GetEditMode()) {
        alert("IME : MoveCaretRight: ime status is INPUT")
        var caretPos = this.core.PosOfCaret();
        $("keypad_keyinfo").style.visibility = "hidden";
        this.core.MoveByTimeout();
        alert("before inputObj.cursorPosition: " + this.inputObj.cursorPosition)
        this.inputObj.cursorPosition = caretPos + 1;
        alert("after inputObj.cursorPosition: " + this.inputObj.cursorPosition)
        if (this.onCompleteFunc) {
            this.onCompleteFunc(this.inputObj.value);
        }
    } else {
        alert("IME : MoveCaretRight: ime status is NOT INPUT");
    }
}
IMEShell.prototype._cancelTimer = function (infoarea) {
    if (this.timer) {
        clearTimeout(this.timer);
    }
    if (!infoarea) {
        $("keypad_keyinfo").style.visibility = "hidden";
    }
}
IMEShell.prototype._inputModeChange = function () {
    alert("IME current input mode: " + this.modeArr[this.curMode]);
    $("ime" + this.modeArr[this.curMode]).className = "modeNormal";
    this.page = 0;
    this._cancelTimer();
    if (this.inputObj.type == "text") {
        this._commitCaretPos(true);
    }
    this.curMode++;
    if (this.curMode >= this.modeArr.length) {
        this.curMode = 0;
    }
    $("ime" + this.modeArr[this.curMode]).className = "modeSel";
    this.core.ChangeInputMode(this.modeArr[this.curMode]);
    this._refreshKeypad();
    alert("IME new input mode: " + this.modeArr[this.curMode]);
}
IMEShell.prototype._commitCaretPos = function (realadd) {
    var caretPos = this.core.PosOfCaret();
    if (this.core.GetEditMode()) {
        alert("IME status : INPUT, caretPos: " + caretPos);
        this.inputObj.cursorPosition = caretPos + 1;
        if (realadd == true) {
            alert("realadd is true -> increasing pos in IME core");
            this.core.SetPosOfCaret(caretPos + 1);
        }
    } else {
        alert("IME status : COMPLETE");
        this.inputObj.cursorPosition = caretPos;
    }
}
IMEShell.prototype._keyPressed = function (EKC) {
    var keyid = "";
    if (this.area_id == IMEvar.AreaCode.ETC) {
        if (EKC == IMEvar.keyCode.KEY__) {
            return;
        } else if (EKC == IMEvar.keyCode.KEY_ENTER) {
            keyid = "l";
        }
    }
    if (keyid == "") {
        switch (EKC) {
            case IMEvar.keyCode.KEY_0:
                keyid = "0";
                break;
            case IMEvar.keyCode.KEY_1:
                keyid = "1";
                break;
            case IMEvar.keyCode.KEY_2:
                keyid = "2";
                break;
            case IMEvar.keyCode.KEY_3:
                keyid = "3";
                break;
            case IMEvar.keyCode.KEY_4:
                keyid = "4";
                break;
            case IMEvar.keyCode.KEY_5:
                keyid = "5";
                break;
            case IMEvar.keyCode.KEY_6:
                keyid = "6";
                break;
            case IMEvar.keyCode.KEY_7:
                keyid = "7";
                break;
            case IMEvar.keyCode.KEY_8:
                keyid = "8";
                break;
            case IMEvar.keyCode.KEY_9:
                keyid = "9";
                break;
            case IMEvar.keyCode.KEY__:
                keyid = "l";
                break;
            case IMEvar.keyCode.KEY_P:
                keyid = "r";
                break;
            default:
                return;
                break;
        }
    }
    if (this.inputObj.type == "text") {
        $("key" + keyid).className = "key_s";
        setTimeout("$('key" + keyid + "').className='key_n'", 200);
    }
}
IMEShell.prototype._refreshKeypad = function () {
    alert("IME : _refreshKeypad() called");
    var temp_arr = [];
    if (this.modeArr[this.curMode] == "_latin_big" || this.modeArr[this.curMode] == "_latin_small") {
        var tArr;
        if (this.inputObj.type == "text" || this.inputObj.type == "textarea") {
            tArr = IMELang._latin.keyArr;
        } else if (this.inputObj.type == "password") {
            tArr = IMELang._pwd.keyArr;
        } else {
            alert("wrong type for keypad", 3);
        }
        if (this.modeArr[this.curMode] == "_latin_small") {
            for (var idx = 0; idx < tArr.length; idx++) {
                if (tArr[idx] && tArr[idx].substr(0, 4) == "<img") {
                    temp_arr[idx] = tArr[idx];
                } else if (tArr[idx]) {
                    temp_arr[idx] = tArr[idx].toLowerCase();
                }
                else {
                    temp_arr[idx] = "";
                }
            }
        }
        else {
            temp_arr = tArr;
        }
        alert("=============================================>" + this.bBlockSpace);
        if (this.bBlockSpace == true) {
            $('key0_txt').style.visibility = "hidden";
        } else {
            $('key0_txt').style.visibility = "visible";
        }
    } else {
        temp_arr = eval("IMELang." + this.modeArr[this.curMode]).keyArr;
        $('key0_txt').style.visibility = "visible";
    }
    if ((this.lang_code == "ru" || this.lang_code == "bg" || this.lang_code == "el") && this.modeArr[this.curMode] != "_special") {
        for (var i = 1; i < 10; i++) {
            $("key" + i + "_txt").className = "txt2";
        }
    } else {
        for (var i = 1; i < 10; i++) {
            $("key" + i + "_txt").className = "txt";
        }
    }
    for (i = 1; i < 10; i++) {
        $("key" + i + "_txt").innerHTML = temp_arr[(this.page * 10) + i - 1];
    }
    i--;
    $("key0_txt").innerHTML = temp_arr[i];
    $("ime" + this.modeArr[this.curMode]).className = "modeSel";
    if (this.modeArr[this.curMode] != "_num" && (this.modeArr[this.curMode] == "_special" || this.inputObj.type == "password")) {
        $("ime_keypad_help_page").style.display = "block";
    } else {
        $("ime_keypad_help_page").style.display = "none";
    }
}
IMEShell.prototype._blockNavigation = function (event) {
    event.preventDefault();
}
IMEShell.prototype.getInputObj = function () {
    return this.inputObj;
}
IMEShell.prototype.setKeypadPos = function (pos_x, pos_y, pos_z) {
    this.keypad_x = pos_x;
    this.keypad_y = pos_y;
    if (pos_z) {
        this.keypad_z = pos_z;
    }
}
IMEShell.prototype.setAnyKeyFunc = function (func) {
    this.anyKeyFuncArr.push(func);
    alert("IMEShell : setAnyKeyFunc");
}
IMEShell.prototype.setKeyFunc = function (keyCode, func) {
    alert("IMEShell : setKeyFunc keycode : " + keyCode);
    this.keyFuncArr[keyCode] = func;
}
IMEShell.prototype.setEnterFunc = function (func) {
    if (func) {
        this.enterFunc = func;
    }
}
IMEShell.prototype.setMaxLengthFunc = function (func) {
    if (func) {
        this.maxLengthFunc = func;
    }
}
IMEShell.prototype.setOnCompleteFunc = function (func) {
    if (func) {
        this.onCompleteFunc = func;
    }
}
IMEShell.prototype.setPrevEventOnLeftFunc = function (func) {
    if (func) {
        this.imePrevCallFunc = func;
    }
}
IMEShell.prototype.setBlockSpace = function (bBlock) {
    if (bBlock !== false) {
        this.bBlockSpace = true;
    } else {
        this.bBlockSpace = false;
    }
}
IMEShell.prototype.setString = function (str, bCallOnComplete) {
    alert("==========IME setString() : " + str);
    this.inputObj.value = str;
    this.inputObj.cursorPosition = str.length;
    this.core.SetString(str);
    if (this.onCompleteFunc && bCallOnComplete) {
        this.onCompleteFunc(this.inputObj.value);
    }
}
IMEShell.prototype.hide = function () {
    $('ime_keypad').style.visibility = "hidden";
    $('keypad_keyinfo').style.visibility = "hidden";
}