async function postData(url = '', data = {}) {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    return response;
}

function Get(yourUrl) {
    let HttpReq = new XMLHttpRequest();
    HttpReq.open("GET", yourUrl, false);
    HttpReq.send(null);
    return HttpReq.responseText;
}

function showMessage(msg: string) {
    let alertBox: HTMLElement = document.getElementById("alertBox");
    let alertText: HTMLSpanElement = document.getElementById("alertText");
    alertText.innerText = msg;
    alertBox.classList.remove("hidden");
}

function copyToClipboard(text: string) {
    const dummy = document.createElement("input");
    document.body.appendChild(dummy);
    dummy.value = text;
    dummy.select();
    document.execCommand("copy");
    document.body.removeChild(dummy);
}

function hideCourse(id: number, name: string) {
    let hidden: Array<Array<string>> = localStorage.getItem("hiddenCourses") ? JSON.parse(localStorage.getItem("hiddenCourses")) : new Array<Array<string>>();
    if (!(hidden.indexOf([id.toString(), name]) !== -1)) {
        hidden.push([id.toString(), name]);
        localStorage.setItem("hiddenCourses", JSON.stringify(hidden));
    }
    document.location.reload();
}

function unhideCourse(id: string, name: string) {
    let hidden: Array<Array<string>> = localStorage.getItem("hiddenCourses") ? JSON.parse(localStorage.getItem("hiddenCourses")) : new Array<Array<string>>();
    let newHidden: Array<Array<string>> = hidden.filter(e => {
        return (e[0] !== id);
    })
    localStorage.setItem("hiddenCourses", JSON.stringify(newHidden));
    document.location.reload();
}

function setupLocalStorageItem(key: string, default_val: any) {
    let item = localStorage.getItem(key);
    let value = item == null ? default_val : JSON.parse(item);
    if (item == null && default_val != undefined) {
        localStorage.setItem(key, JSON.stringify(value));
    }
    return value;
}

function getPrefersAutoDarkTheme() {
    return JSON.parse(localStorage.getItem("autoDarkTheme"));
}

function getPrefersDarkTheme() {
    // in auto dark mode, consult the media query, otherwise the saved preference
    return getPrefersAutoDarkTheme() ?
        window.matchMedia("(prefers-color-scheme: dark)").matches :
        JSON.parse(localStorage.getItem("darkTheme"));
}

/** Update the color theme in the UI ("view") */
function updateColorScheme() {
    let darkTheme = getPrefersDarkTheme();
    let autoDarkTheme = getPrefersAutoDarkTheme();

    localStorage.setItem("darkTheme", JSON.stringify(darkTheme));

    if (darkTheme) {
        document.documentElement.classList.add("dark");
    } else {
        document.documentElement.classList.remove("dark");
    }

    let new_class = autoDarkTheme ? "fa-adjust" : (darkTheme ? "fa-moon" : "fa-sun");
    let els = document.getElementsByClassName("color-scheme-switcher");
    for (let i = 0; i < els.length; i++) {
        els[i].classList.remove("fa-sun", "fa-moon", "fa-adjust");
        els[i].classList.add(new_class);
    }
}

/** Cycle the saved color theme, then update displayed color theme */
function cycleColorScheme() {
    let darkTheme = getPrefersDarkTheme();
    let autoDarkTheme = getPrefersAutoDarkTheme();

    // cycle through light, dark, auto
    if (!autoDarkTheme && !darkTheme) {
        darkTheme = true;
    } else if (!autoDarkTheme && darkTheme) {
        autoDarkTheme = true;
    } else if (autoDarkTheme) {
        autoDarkTheme = false;
        darkTheme = false;
    }

    localStorage.setItem("darkTheme", darkTheme);
    localStorage.setItem("autoDarkTheme", autoDarkTheme);

    updateColorScheme();
}

function initColorScheme() {
    // on first visit, default to dark theme (true) with no automatic switching (false)
    setupLocalStorageItem("darkTheme", true);
    setupLocalStorageItem("autoDarkTheme", false);

    updateColorScheme();

    // set up the listener, regardless of the autoDarkTheme preference, which is instead checked by the callback
    window.matchMedia('(prefers-color-scheme: dark)')
        .addEventListener('change', _ => updateColorScheme());
}

function initHiddenCourses() {
    let el = document.getElementById("hiddenCoursesText");
    if (!el){
        return;
    }
    el.onclick = function () {
        const clickableParent: HTMLElement = document.getElementById("hiddenCoursesRestoreList")?.parentElement;
        if (clickableParent === undefined || clickableParent === null) {
            return; // not on index page
        }
        if (clickableParent.classList.contains("hidden")) {
            clickableParent.classList.remove("hidden");
        } else {
            clickableParent.classList.add("hidden");
        }
    }
    let hidden: Array<Array<string>> = localStorage.getItem("hiddenCourses") ? JSON.parse(localStorage.getItem("hiddenCourses")) : new Array<Array<string>>();
    const hiddenCoursesRestoreList = document.getElementById("hiddenCoursesRestoreList") as HTMLUListElement;
    const hiddenCoursesText = document.getElementById("hiddenCoursesText") as HTMLParagraphElement;
    hidden?.forEach(h => {
        const liElem = document.createElement("li");
        liElem.classList.add("hover:text-1", "cursor-pointer");
        liElem.innerText = "restore " + h[1];
        liElem.onclick = function () {
            unhideCourse(h[0], h[1]);
        }
        hiddenCoursesRestoreList.appendChild(liElem);
        const elems = document.getElementsByClassName("course" + h[0]);
        for (let i = 0; i < elems.length; i++) {
            elems[i].classList.add("hidden");
        }
    })
    if (hidden.length !== 0) {
        hiddenCoursesText.innerText = hidden.length + " hidden courses";
    }
}

window.onload = function () {
    initHiddenCourses();
    initColorScheme();
}
