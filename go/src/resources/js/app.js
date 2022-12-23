/* Set the width of the side navigation to 250px */
function openNav() {
    document.getElementById("mgb-sidebar").style.width = "100%";
    document.getElementById("mgb-sidebar-menu-right").style.display = "block";
    // document.getElementById("mgb-sidebar-left").style.background = "rgba(0,0,0,0.8)";

    const body = document.querySelector("body");
    body.style.overflow = "hidden";

}

/* Set the width of the side navigation to 0 */
function closeNav() {
    // document.getElementById("mgb-sidebar").style.display = "none";
    document.getElementById("mgb-sidebar").style.width = "0";
    document.getElementById("mgb-sidebar-menu-right").style.display = "none";
    // document.getElementById("mgb-sidebar-left").style.background = "white";
    // document.getElementById("mgb-sidebar").style.height = "0";

    const body = document.querySelector("body");
    body.style.overflow = "auto";

}


function showMainMenu(e) {
    document.getElementById("mgb-main-menu-popup").style.display = "block";
    hideMainMenu2(e)
    console.log("show");
}

function hideMainMenu(e) {
    document.getElementById("mgb-main-menu-popup").style.display = "none";
}

function showMainMenu2(e) {
    document.getElementById("mgb-main-menu-popup2").style.display = "block";
    hideMainMenu(e)
    console.log("show2");
}

function hideMainMenu2(e) {
    document.getElementById("mgb-main-menu-popup2").style.display = "none";
}


function showMyImage(evt) {
    let file = evt.files[0];
    console.log(file.size, file.name);

    if (file != null) {
        if (file.size > 200 * 1024) {
            //
            document.querySelector("#mgb-user-avatar").value = "";

            let alert = tippy(document.querySelector("#bb"), {
                content: "Dung lượng ảnh lớn hơn 200KB.\nVui lòng chọn ảnh khác.",
                trigger: 'manual',
                duration: [300, 250],
                delay: 100,
                hideOnClick: false,
                onShow(instance) {
                    setTimeout(() => {
                        instance.hide();
                    }, 2000);
                }
            });
            alert.show();
        } else {
            const img = document.getElementById("avatar-preview-box");
            const src = URL.createObjectURL(file);
            img.src = src;
        }
    }
}

function insertImage(e) {
    let tb = document.getElementById("tb2")

    let oImg = document.createElement("IMG");
    oImg.src = "https://www.gstatic.com/webp/gallery/1.jpg";
    tb.appendChild(oImg);
}


$(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip();
});

//Handle left & right keyboard
document.addEventListener("keydown", onKeyPressed);

function onKeyPressed(e) {
    var keyCode = e.keyCode;
    var key = e.key;
    console.log('Key Code: ' + keyCode + ' Key: ' + key);

    if (keyCode == 37) {
        //Left
        document.querySelector("#mgb-chapter-left-btn").click();
    }
    if (keyCode == 39) {
        //Right
        document.querySelector("#mgb-chapter-right-btn").click();
    }

}

////////////////////////////////////////////////////////////////////////////////
//Base

class Account {
    constructor(id, name, email, avatarUrl) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.avatarUrl = avatarUrl;
    }
}

class Story {
    constructor(id, name, slugName, authorName, description, status, url,
                logoId, logoUrl, logoTimestamp, createdDate, timestamp,
                totalViews, totalLikes, totalBookmarks, forAdult, chapters) {
        this.id = id;
        this.name = name;
        this.slugName = slugName;
        this.authorName = authorName;
        this.description = description;
        this.status = status;
        this.url = url;
        this.logoId = logoId;
        this.logoUrl = logoUrl;
        this.logoTimestamp = logoTimestamp;
        this.createdDate = createdDate;
        this.timestamp = timestamp;
        this.totalViews = totalViews;
        this.totalLikes = totalLikes;
        this.totalBookmarks = totalBookmarks;
        this.forAdult = forAdult;
        this.chapters = chapters;
    }
}

class Chapter {
    constructor(id, name, slugName, longName, url, createDate, timestamp, friendlyTimestamp) {
        this.id = id;
        this.name = name;
        this.slugName = slugName;
        this.longName = longName;
        this.url = url;
        this.createDate = createDate;
        this.timestamp = timestamp;
        this.friendlyTimestamp = friendlyTimestamp;
    }
}

class Pagination {
    constructor(page, itemPerPage, totalPages, totalItems, totalSpanItems, paginationItems) {
        this.page = page;
        this.itemPerPage = itemPerPage;
        this.totalPages = totalPages;
        this.totalItems = totalItems;
        this.totalSpanItems = totalSpanItems;
        this.paginationItems = paginationItems;
    }
}

class PaginationItem {
    constructor(name, active, url, itemType) {
        this.name = name;
        this.active = active;
        this.url = url;
        this.itemType = itemType;
    }
}

class Comment {
    constructor(id, content, createdDate, timestamp, friendlyTimestamp,
                subComments, commentator, story) {
        this.id = id;
        this.content = content;
        this.createdDate = createdDate;
        this.timestamp = timestamp;
        this.friendlyTimestamp = friendlyTimestamp;
        this.subComments = subComments;
        this.commentator = commentator;
        this.story = story;
    }
}

////////////////////////////////////////////////////////////////////////////////

let path = "/ajax/search"
let searchStories = []

function buildSearchRequest(query) {
    url = `${path}?q=${query}`;
    console.log(url);
    return url;
}

function makeRequest2(query) {
    url = buildSearchRequest(query)
    fetch(url, {
        method: "GET",
        headers: {"Content-type": "application/json;charset=UTF-8"}
    })
        .then(response => response.json())
        .then(json => {
                //Parse response
                if (json.statusCode == 200) {
                    searchStories = parseStories(json.data.stories);
                }
                //
                buildUI();
            }
        )
        .catch(err => console.log(err));
}


function buildUI() {

    let storyTemplate = document.querySelector("#searchItemTemplate");
    let storyTemplate2 = document.querySelector("#searchItemTemplate2");
    let chapterTemplate = document.querySelector("#searchItemTemplate3");

    //Build content
    let content = document.querySelector("#mgb-header-desktop-content-search-box-popup-content");
    let content2 = document.querySelector("#mgb-header-desktop-content-search-box-popup-content2");

    content.innerHTML = "";
    content2.innerHTML = "";
    searchStories.forEach(item => {
        let row = storyTemplate.content.cloneNode(true);
        row.querySelector("#tplImageLink").setAttribute("href", item.url);
        row.querySelector("#tplLogo").setAttribute("src", item.logoUrl);
        row.querySelector("#tplName").innerHTML = item.name;
        row.querySelector("#tplName").setAttribute("href", buildStoryUrl(item.id, item.slugName));
        row.querySelector("#tplViews").innerHTML = item.totalViews;
        row.querySelector("#tplLikes").innerHTML = item.totalLikes;
        row.querySelector("#tplBookmarks").innerHTML = item.totalBookmarks;

        let chapContainer = row.querySelector("#tplChapters");
        chapContainer.innerHTML = "";
        item.chapters.forEach(chap => {
            let chapNode = chapterTemplate.content.cloneNode(true);
            chapNode.querySelector("#tplName").innerHTML = chap.name;
            chapNode.querySelector("#tplName").setAttribute("href", buildChapterUrl(chap.id, item.slugName, chap.slugName));
            chapContainer.appendChild(chapNode);
        })
        content.appendChild(row);

        var row2 = storyTemplate2.content.cloneNode(true);
        row2.querySelector("#tplImageLink").setAttribute("href", item.url);
        row2.querySelector("#tplLogo").setAttribute("src", item.logoUrl);
        row2.querySelector("#tplName").innerHTML = item.name;
        row2.querySelector("#tplName").setAttribute("href", buildStoryUrl(item.id, item.slugName));

        let chapContainer2 = row2.querySelector("#tplChapters");
        chapContainer2.innerHTML = "";
        item.chapters.forEach(chap => {
            let chapNode = chapterTemplate.content.cloneNode(true);
            chapNode.querySelector("#tplName").innerHTML = chap.name;
            chapNode.querySelector("#tplName").setAttribute("href", buildChapterUrl(chap.id, item.slugName, chap.slugName));
            chapContainer2.appendChild(chapNode);
        })
        content2.appendChild(row2);
    });
    // console.log(searchStories.length)


}

function openSearchBar() {
    document.getElementById("mgb-searchbar").style.width = "100%";

    const body = document.querySelector("body");
    body.style.overflow = "hidden";

}

/* Set the width of the side navigation to 0 */
function closeSearchBar() {
    document.getElementById("mgb-searchbar").style.width = "0";

    const body = document.querySelector("body");
    body.style.overflow = "auto";

    clearSearch();
}

function showSearchContent(e) {
    document.getElementById("mgb-header-desktop-content-search-box-button").classList.remove("mgb-search-button-normal")
    document.getElementById("mgb-header-desktop-content-search-box-button").classList.add("mgb-search-button")
    document.getElementById("mgb-header-desktop-content-search-box-popup").style.display = "block";
    console.log("in");
}

function hideSearchContent(e) {
    document.getElementById("mgb-header-desktop-content-search-box-button").classList.remove("mgb-search-button");
    document.getElementById("mgb-header-desktop-content-search-box-button").classList.add("mgb-search-button-normal")
    document.getElementById("mgb-header-desktop-content-search-box-popup").style.display = "none";
    // console.log("out");
    clearSearch();
}

function clearSearch() {
    document.querySelector("#mgb-header-desktop-content-search-box-button2").value = "";
    document.querySelector("#mgb-header-desktop-content-search-box-button").value = "";
    searchStories = [];
    buildUI();
}


function search(e) {
    console.log(e.value);

    if (e.value == "") {
        console.log("empty str");
        clearSearch();
    } else {
        makeRequest2(e.value);
    }
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Base function

function toBinary(string) {
    const codeUnits = new Uint16Array(string.length);
    for (let i = 0; i < codeUnits.length; i++) {
        codeUnits[i] = string.charCodeAt(i);
    }
    return btoa(String.fromCharCode(...new Uint8Array(codeUnits.buffer)));
}

function fromBinary(encoded) {
    binary = atob(encoded)
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < bytes.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return String.fromCharCode(...new Uint16Array(bytes.buffer));
}

function toPlainText(evt) {
    evt.preventDefault();
    var text = '';
    if (evt.clipboardData || evt.originalEvent.clipboardData) {
        text = (evt.originalEvent || evt).clipboardData.getData('text/plain');
    } else if (window.clipboardData) {
        text = window.clipboardData.getData('Text');
    }
    if (document.queryCommandSupported('insertText')) {
        document.execCommand('insertText', false, text);
    } else {
        document.execCommand('paste', false, text);
    }
}

function parseJwt(token) {
    try {
        let base64Url = token.split('.')[1];
        let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        let jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    } catch (e) {
        return null;
    }
};

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function buildStoryUrl(storyId, slugName) {
    return "/truyen/" + storyId + "/" + slugName;
}

function buildChapterUrl(chapterId, storySlugName, chapterSlugName) {
    return "/chuong/" + chapterId + "/" + storySlugName + "-" + chapterSlugName;
}

function buildPath(path, queries) {
    let url = path + "?";

    queries.forEach((value, key) => {
        url += key + "=" + value + "&";
    });

    console.log(url);
    return url
}

function makeRequest(endpoint, method, headers, body, onSuccess, onFail) {
    let httpHeaders = new Headers();
    headers.forEach((value, key) => {
        // console.log(key, value);
        httpHeaders.append(key, value);
    });

    fetch(endpoint, {
        method: method,
        headers: httpHeaders,
        body: body
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not OK');
            }
            return response.json();

        })
        .then(json => {
            onSuccess(json);
        })
        .catch(err => onFail(err));
}

function parseStories(jsonStr) {
    let stories = []
    jsonStr.forEach((item) => {
        stories.push(parseStory(item));
    });

    console.log(stories.length, stories);
    return stories;
}

function parseStory(item) {
    let story = new Story(item.id, item.name, item.slugName, item.authorName, item.description, item.status, "",
        item.logoId, item.logoUrl, item.logoTimestamp, item.createdDate, item.timestamp,
        item.totalViews, item.totalLikes, item.totalBookmarks, item.forAdult, []);
    story.url = buildStoryUrl(story.id, story.slugName);

    let chapters = [];
    item.chapters.forEach((item2) => {
        let chap = new Chapter(item2.id, item2.name, item2.slugName, item2.longName, "", item2.createdDate, item2.timestamp, item2.friendlyTimestamp);
        chap.url = buildChapterUrl(chap.id, story.slugName, chap.slugName);
        chapters.push(chap)
    });

    story.chapters = chapters;

    return story;
}

function parsePagination(jsonStr) {
    return new Pagination(jsonStr.page, jsonStr.itemPerPage, jsonStr.totalPages, jsonStr.totalItems, 3, []);
}

function parseAccount(jsonStr) {
    obj = parseJwt(jsonStr);

    if (obj != null) {
        return new Account(obj.accountId, obj.accountName, obj.accountEmail, obj.accountAvatarUrl);
    }

    return obj;
}

function parseComments(jsonStr) {
    let comments = []
    jsonStr.forEach((item) => {
        let comment = new Comment(item.id, item.content, item.createdDate, item.timestamp, item.friendlyTimestamp,
            parseComments(item.subComments), parseAccount(item.commentator), parseStory(item.story));

        comments.push(comment);
    });

    // console.log(comments.length, comments);
    return comments;
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function buildPagination(paginationContainer, pagination, stories, onPageChanged) {
    // var paginationContainer = document.querySelector("#paginationContainer");
    let itemButton = document.querySelector("#paginationItemTemplate");
    let firstButton = document.querySelector("#paginationItemFirstTemplate");
    let previousButton = document.querySelector("#paginationItemPreviousTemplate");
    let nextButton = document.querySelector("#paginationItemNextTemplate");
    let endButton = document.querySelector("#paginationItemEndTemplate");
    paginationContainer.innerHTML = "";

    console.log(pagination);

    // console.log(currentPage);
    let node = itemButton.content.cloneNode(true);
    node.querySelector("a").setAttribute("class", "mgb-pagination-box-item-a mgb-pagination-box-item-a-active");
    node.querySelector("a").setAttribute("href", "#trang-" + (pagination.page + 1).toString());
    node.querySelector("a").setAttribute("value", pagination.page);
    node.querySelector("a").innerHTML = (pagination.page + 1).toString();
    paginationContainer.insertBefore(node, paginationContainer.childNodes[0]);

    //Add left side
    for (let index = 1; index <= pagination.totalSpanItems && (pagination.page - index) >= 0; index++) {
        // console.log(currentPage - index);
        let node = itemButton.content.cloneNode(true);
        node.querySelector("a").setAttribute("href", "#trang-" + (pagination.page - index + 1).toString());
        node.querySelector("a").setAttribute("value", (pagination.page - index).toString());
        node.querySelector("a").innerHTML = (pagination.page - index + 1).toString();
        node.querySelector("a").addEventListener("click", onPageChanged);
        paginationContainer.insertBefore(node, paginationContainer.childNodes[0]);
    }

    //Add first button, previous button
    if (pagination.totalPages > 1 && pagination.page > 0) {
        let node = previousButton.content.cloneNode(true);
        node.querySelector("a").setAttribute("href", "#trang-" + (pagination.page).toString());
        node.querySelector("a").setAttribute("value", (pagination.page - 1).toString());
        node.querySelector("a").addEventListener("click", onPageChanged);
        paginationContainer.insertBefore(node, paginationContainer.childNodes[0]);

        let node2 = firstButton.content.cloneNode(true);
        node2.querySelector("a").setAttribute("href", "#trang-1");
        node2.querySelector("a").setAttribute("value", "0");
        node2.querySelector("a").addEventListener("click", onPageChanged);
        paginationContainer.insertBefore(node2, paginationContainer.childNodes[0]);
    }


    //Add right side
    for (let index = 1; index <= pagination.totalSpanItems && (pagination.page + index) < pagination.totalPages; index++) {
        let node = itemButton.content.cloneNode(true);
        node.querySelector("a").setAttribute("href", "#trang-" + (pagination.page + index + 1).toString());
        node.querySelector("a").setAttribute("value", (pagination.page + index).toString());
        node.querySelector("a").innerHTML = (pagination.page + index + 1).toString();
        node.querySelector("a").addEventListener("click", onPageChanged);
        paginationContainer.appendChild(node);
    }

    //Add next button, last button
    if (pagination.totalPages > 1 && pagination.page < pagination.totalPages - 1) {
        let node = nextButton.content.cloneNode(true);
        node.querySelector("a").setAttribute("href", "#trang-" + (pagination.page + 2).toString());
        node.querySelector("a").setAttribute("value", (pagination.page + 1).toString());
        node.querySelector("a").addEventListener("click", onPageChanged);
        paginationContainer.appendChild(node);


        let node2 = endButton.content.cloneNode(true);
        node2.querySelector("a").setAttribute("href", "#trang-" + (pagination.totalPages).toString());
        node2.querySelector("a").setAttribute("value", (pagination.totalPages - 1).toString());
        node2.querySelector("a").addEventListener("click", onPageChanged);
        paginationContainer.appendChild(node2);
    }
    //
    // //
    // var paginationOrder1 = document.querySelector("#paginationOrder1");
    // var paginationOrder2 = document.querySelector("#paginationOrder2");
    // var paginationTotalVersions = document.querySelector("#paginationTotalVersions");
    // paginationOrder1.innerHTML = (currentPage * currentItemPerPage + 1).toString();
    // paginationOrder2.innerHTML = ((currentPage * currentItemPerPage) + appVersions.length).toString();
    // paginationTotalVersions.innerHTML = totalItems.toString();
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//User - history
let historyStories = [];
let historyPagination = {};
let defaultItemperPage = 20;

function initUserHistoryData() {
    callUserHistoryStories(0, defaultItemperPage);
}

function changeItemPerPageUserHistory(evt) {
    console.log(evt.value);
    historyPagination.itemPerPage = evt.value;

    callUserHistoryStories(0, historyPagination.itemPerPage);
}

function onResultHistoryStoriesSuccess(result) {
    console.log(result);
    historyStories = parseStories(result.data.account.recentStories.items);
    historyPagination = parsePagination(result.data.account.recentStories);

    buildUserHistoryUi();
}

function onResultHistoryStoriesFail(result) {
    console.log(result);

}

function buildUserHistoryUi() {
    let storyCardTemplate = document.querySelector("#userStoryCardTemplate");

    if (historyStories.length == 0) {
        let elem = document.querySelector("#mgbUserHistoryNodata");
        let elem2 = document.querySelector("#mgbUserHistoryBox");
        let elem3 = document.querySelector("#mgbUserHistorySelect");
        elem.style.display = "flex";
        elem2.style.display = "none";
        elem3.disabled = true;
    } else {
        let elem = document.querySelector("#mgbUserHistoryNodata");
        let elem2 = document.querySelector("#mgbUserHistoryBox");
        let elem3 = document.querySelector("#mgbUserHistorySelect");
        elem.style.display = "none";
        elem2.style.display = "block";
        elem3.disabled = false;

        //Build content
        let content = document.querySelector("#mgbUserHistoryContent");

        content.innerHTML = "";
        historyStories.forEach(item => {
            let row = storyCardTemplate.content.cloneNode(true);
            row.querySelector("#tplTitle").innerHTML = item.name;
            row.querySelector("#tplTitle").setAttribute("href", item.url);
            row.querySelector("#tplImage").setAttribute("data-src", item.logoUrl);
            row.querySelector("#tplImageLink").setAttribute("href", item.url);
            row.querySelector("#tplViews").innerHTML = item.totalViews.toLocaleString("vi-Vn");
            row.querySelector("#tplLikes").innerHTML = item.totalLikes.toLocaleString("vi-Vn");
            row.querySelector(".mgb-user-history-story-close-btn").setAttribute("data-id", item.id);
            row.querySelector(".mgb-user-history-story-close-btn").addEventListener("click", function (evt) {
                $.confirm({
                    title: 'Xóa',
                    content: 'Bạn muốn xóa truyện này.',
                    "animateFromElement": false,
                    "typeAnimated": false,
                    buttons: {
                        OK: function () {
                            // $.alert('Confirmed!');
                            console.log(item.id);
                            let storyId = item.id;
                            let path = "/ajax/account/recent/" + storyId;
                            let url = buildPath(path, new Map([]));

                            makeRequest(url, "DELETE", new Map([]), null, function (result) {
                                if (result.statusCode == 200) {
                                    callUserHistoryStories(historyPagination.page, historyPagination.itemPerPage);
                                } else if (result.statusCode == 400) {
                                    let alert = tippy(evt, {
                                        content: "Đăng nhập để thực hiện.",
                                        trigger: 'manual',
                                        duration: [300, 250],
                                        delay: 100,
                                        hideOnClick: false,
                                        onShow(instance) {
                                            setTimeout(() => {
                                                instance.hide();
                                            }, 1000);
                                        }
                                    });
                                    alert.show();
                                }
                            }, function () {
                            });
                        },
                        Cancel: function () {

                        },

                    }
                });
            });

            //Add chapters
            let chapContainer = row.querySelector("#tplChapters");
            item.chapters.forEach(item => {
                let chapRow = document.querySelector("#userChapterTemplate").content.cloneNode(true);
                chapRow.querySelector("#tplName").innerHTML = item.name;
                chapRow.querySelector("#tplName").setAttribute("href", item.url);
                chapRow.querySelector("#tplFriendlyTimestamp").innerHTML = item.friendlyTimestamp;

                chapContainer.appendChild(chapRow);
                console.log(item.name);
            });


            content.appendChild(row);
        });
        console.log(historyStories.length)

        let paginationContainer = document.querySelector("#paginationContainer");
        buildPagination(paginationContainer, historyPagination, historyStories, changePageUserHistory);

        lazyLoadInstance.update();
    }
}

function changePageUserHistory(evt) {
    let pageChanged = evt.currentTarget.getAttribute("value");
    console.log("page changed: " + pageChanged);

    historyPagination.page = pageChanged;
    callUserHistoryStories(pageChanged, historyPagination.itemPerPage);
}

function callUserHistoryStories(page, itemPerPage) {
    let path = "/ajax/account/recent";
    let url = buildPath(path, new Map([
        ["page", page],
        ["itemPerPage", itemPerPage],
    ]));

    let accountToken = getCookie("accountToken");

    makeRequest(url, "get", new Map([
        ["Authorization", "Bearer " + accountToken],
    ]), null, onResultHistoryStoriesSuccess, onResultHistoryStoriesFail);
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//User - like
let likeStories = []
let likePagination = {};

function initUserLikeData() {
    callUserLikeStories(0, defaultItemperPage);
}

function changeItemPerPageUserLike(evt) {
    console.log(evt.value);
    likePagination.itemPerPage = evt.value;

    callUserLikeStories(0, likePagination.itemPerPage);
}

function onResultLikeStoriesSuccess(result) {
    console.log(result);
    likeStories = parseStories(result.data.account.likeStories.items);
    likePagination = parsePagination(result.data.account.likeStories);

    buildUserLikeUi();
}

function buildUserLikeUi() {
    let storyCardTemplate = document.querySelector("#userStoryCardTemplate");

    if (likeStories.length == 0) {
        let elem = document.querySelector("#mgbUserLikeNodata");
        let elem2 = document.querySelector("#mgbUserLikeBox");
        let elem3 = document.querySelector("#mgbUserLikeSelect");
        elem.style.display = "flex";
        elem2.style.display = "none";
        elem3.disabled = true;
    } else {
        let elem = document.querySelector("#mgbUserLikeNodata");
        let elem2 = document.querySelector("#mgbUserLikeBox");
        let elem3 = document.querySelector("#mgbUserLikeSelect");
        elem.style.display = "none";
        elem2.style.display = "block";
        elem3.disabled = false;

        //Build content
        let content = document.querySelector("#mgbUserLikeContent");

        content.innerHTML = "";
        likeStories.forEach(item => {
            let row = storyCardTemplate.content.cloneNode(true);
            row.querySelector("#tplTitle").innerHTML = item.name;
            row.querySelector("#tplTitle").setAttribute("href", item.url);
            row.querySelector("#tplImage").setAttribute("data-src", item.logoUrl);
            row.querySelector("#tplImageLink").setAttribute("href", item.url);
            row.querySelector("#tplViews").innerHTML = item.totalViews.toLocaleString("vi-Vn");
            row.querySelector("#tplLikes").innerHTML = item.totalLikes.toLocaleString("vi-Vn");
            row.querySelector(".mgb-user-history-story-close-btn").setAttribute("data-id", item.id);
            row.querySelector(".mgb-user-history-story-close-btn").addEventListener("click", function (evt) {
                $.confirm({
                    title: 'Xóa',
                    content: 'Bạn muốn xóa truyện này.',
                    "animateFromElement": false,
                    "typeAnimated": false,
                    buttons: {
                        OK: function () {
                            // $.alert('Confirmed!');
                            console.log(item.id);
                            let storyId = item.id;
                            let path = `/ajax/account/story/${storyId}/like`;
                            let url = buildPath(path, new Map([]));

                            makeRequest(url, "PATCH", new Map([]), null, function (result) {
                                if (result.statusCode == 200) {
                                    callUserLikeStories(likePagination.page, likePagination.itemPerPage);
                                } else if (result.statusCode == 400) {
                                    let alert = tippy(evt, {
                                        content: "Đăng nhập để thực hiện.",
                                        trigger: 'manual',
                                        duration: [300, 250],
                                        delay: 100,
                                        hideOnClick: false,
                                        onShow(instance) {
                                            setTimeout(() => {
                                                instance.hide();
                                            }, 1000);
                                        }
                                    });
                                    alert.show();
                                }
                            }, function () {
                            });
                        },
                        Cancel: function () {

                        },

                    }
                });
            });

            //Add chapters
            let chapContainer = row.querySelector("#tplChapters");
            item.chapters.forEach(item => {
                let chapRow = document.querySelector("#userChapterTemplate").content.cloneNode(true);
                chapRow.querySelector("#tplName").innerHTML = item.name;
                chapRow.querySelector("#tplName").setAttribute("href", item.url);
                chapRow.querySelector("#tplFriendlyTimestamp").innerHTML = item.friendlyTimestamp;

                chapContainer.appendChild(chapRow);
                console.log(item.name);
            });


            content.appendChild(row);
        });
        console.log(likeStories.length)

        let paginationContainer = document.querySelector("#paginationContainer");
        buildPagination(paginationContainer, likePagination, likeStories, changePageUserLike);

        lazyLoadInstance.update();
    }
}

function onResultLikeStoriesFail(data) {
    console.log(data);
}

function changePageUserLike(evt) {
    let pageChanged = evt.currentTarget.getAttribute("value");
    console.log("page changed: " + pageChanged);

    likePagination.page = pageChanged;
    callUserLikeStories(pageChanged, likePagination.itemPerPage);
}

function callUserLikeStories(page, itemPerPage) {
    let path = "/ajax/account/like";
    let url = buildPath(path, new Map([
        ["page", page],
        ["itemPerPage", itemPerPage],
    ]));

    let accountToken = getCookie("accountToken");

    makeRequest(url, "get", new Map([
        ["Authorization", "Bearer " + accountToken],
    ]), null, onResultLikeStoriesSuccess, onResultLikeStoriesFail);
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//User - bookmark
let bookmarkStories = []
let bookmarkPagination = {};

function initUserBookmarkData() {
    callUserBookmarkStories(0, defaultItemperPage);
}

function changeItemPerPageUserBookmark(evt) {
    console.log(evt.value);
    bookmarkPagination.itemPerPage = evt.value;

    callUserBookmarkStories(0, bookmarkPagination.itemPerPage);
}

function onResultBookmarkStoriesSuccess(result) {
    console.log(result);
    bookmarkStories = parseStories(result.data.account.bookmarkStories.items);
    bookmarkPagination = parsePagination(result.data.account.bookmarkStories);

    buildUserBookmarkUi();
}

function onResultBookmarkStoriesFail(data) {
    console.log(data);
}

function buildUserBookmarkUi() {
    let storyCardTemplate = document.querySelector("#userStoryCardTemplate");

    if (bookmarkStories.length == 0) {
        //Set no data screen
        let elem = document.querySelector("#mgbUserBookmarkNodata");
        let elem2 = document.querySelector("#mgbUserBookmarkBox");
        let elem3 = document.querySelector("#mgbUserBookmarkSelect");
        elem.style.display = "flex";
        elem2.style.display = "none";
        elem3.disabled = true;
    } else {
        let elem = document.querySelector("#mgbUserBookmarkNodata");
        let elem2 = document.querySelector("#mgbUserBookmarkBox");
        let elem3 = document.querySelector("#mgbUserBookmarkSelect");
        elem.style.display = "none";
        elem2.style.display = "block";
        elem3.disabled = false;

        //Build content
        let content = document.querySelector("#mgbUserBookmarkContent");

        content.innerHTML = "";
        bookmarkStories.forEach(item => {
            let row = storyCardTemplate.content.cloneNode(true);
            row.querySelector("#tplTitle").innerHTML = item.name;
            row.querySelector("#tplTitle").setAttribute("href", item.url);
            row.querySelector("#tplImage").setAttribute("data-src", item.logoUrl);
            row.querySelector("#tplImageLink").setAttribute("href", item.url);
            row.querySelector("#tplViews").innerHTML = item.totalViews.toLocaleString("vi-Vn");
            row.querySelector("#tplLikes").innerHTML = item.totalLikes.toLocaleString("vi-Vn");
            row.querySelector(".mgb-user-history-story-close-btn").setAttribute("data-id", item.id);
            row.querySelector(".mgb-user-history-story-close-btn").addEventListener("click", function (evt) {
                $.confirm({
                    title: 'Xóa',
                    content: 'Bạn muốn xóa truyện này.',
                    "animateFromElement": false,
                    "typeAnimated": false,
                    buttons: {
                        OK: function () {
                            // $.alert('Confirmed!');
                            console.log(item.id);
                            let storyId = item.id;
                            let path = `/ajax/account/story/${storyId}/bookmark`;
                            let url = buildPath(path, new Map([]));

                            makeRequest(url, "PATCH", new Map([]), null, function (result) {
                                if (result.statusCode == 200) {
                                    callUserBookmarkStories(bookmarkPagination.page, bookmarkPagination.itemPerPage);
                                } else if (result.statusCode == 400) {
                                    let alert = tippy(evt, {
                                        content: "Đăng nhập để thực hiện.",
                                        trigger: 'manual',
                                        duration: [300, 250],
                                        delay: 100,
                                        hideOnClick: false,
                                        onShow(instance) {
                                            setTimeout(() => {
                                                instance.hide();
                                            }, 1000);
                                        }
                                    });
                                    alert.show();
                                }
                            }, function () {
                            });
                        },
                        Cancel: function () {

                        },

                    }
                });
            });

            //Add chapters
            let chapContainer = row.querySelector("#tplChapters");
            item.chapters.forEach(item => {
                let chapRow = document.querySelector("#userChapterTemplate").content.cloneNode(true);
                chapRow.querySelector("#tplName").innerHTML = item.name;
                chapRow.querySelector("#tplName").setAttribute("href", item.url);
                chapRow.querySelector("#tplFriendlyTimestamp").innerHTML = item.friendlyTimestamp;

                chapContainer.appendChild(chapRow);
                console.log(item.name);
            });


            content.appendChild(row);
        });
        console.log(bookmarkStories.length)

        let paginationContainer = document.querySelector("#paginationContainer");
        buildPagination(paginationContainer, bookmarkPagination, bookmarkStories, changePageUserBookmark);

        lazyLoadInstance.update();
    }
}

function changePageUserBookmark(evt) {
    let pageChanged = evt.currentTarget.getAttribute("value");
    console.log("page changed: " + pageChanged);

    bookmarkPagination.page = pageChanged;
    callUserBookmarkStories(pageChanged, bookmarkPagination.itemPerPage);
}

function callUserBookmarkStories(page, itemPerPage) {
    let path = "/ajax/account/bookmark";
    let url = buildPath(path, new Map([
        ["page", page],
        ["itemPerPage", itemPerPage],
    ]));

    let accountToken = getCookie("accountToken");

    makeRequest(url, "get", new Map([
        ["Authorization", "Bearer " + accountToken],
    ]), null, onResultBookmarkStoriesSuccess, onResultBookmarkStoriesFail);
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Page detail - toolbar
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Chapter detail - image toolbar

let isShowToolbarExpand = false;
let isShowToolbarBackground = false;
let isShowToolbarBrightness = false;
let brightnessValue = 100;
let backgroundColors = new Map([
    [1, "mgb-toolbar-popup-background-item-color1"],
    [2, "mgb-toolbar-popup-background-item-color2"],
    [3, "mgb-toolbar-popup-background-item-color3"],
    [4, "mgb-toolbar-popup-background-item-color4"],
])


function initToolbar() {
    if (getCookie("_mgb-toolbar-resize") == "expand") {
        expandImage();
    } else {
        compressImage();
    }

    let backId = getCookie("_mgb-toolbar-background");
    if (backId == 1) {
        changeBackground(1);
        document.querySelector("#mgb-toolbar-bt1").checked = true;
    } else if (backId == 2) {
        changeBackground(2);
        document.querySelector("#mgb-toolbar-bt2").checked = true;
    } else if (backId == 3) {
        changeBackground(3);
        document.querySelector("#mgb-toolbar-bt3").checked = true;
    } else if (backId == 4) {
        changeBackground(4);
        document.querySelector("#mgb-toolbar-bt4").checked = true;
    } else {
        changeBackground(1);
        document.querySelector("#mgb-toolbar-bt1").checked = true;
    }


    if (getCookie("_mgb-toolbar-brightness") != "") {
        brightnessValue = getCookie("_mgb-toolbar-brightness");
        console.log(brightnessValue);
    } else {
        brightnessValue = 100;
    }
    changeBrightness(brightnessValue);
    let ranger = document.querySelector("#mgb-toolbar-brightness-ranger");
    ranger.value = brightnessValue;
}

function expandImage() {
    let elemExpand = document.querySelector("#mgb-toolbar-expand");
    let elemCompress = document.querySelector("#mgb-toolbar-compress");

    setCookie("_mgb-toolbar-resize", "expand", 365);

    elemExpand.style.display = "none";
    elemExpand.style.visibility = "visible";
    elemCompress.style.display = "inline-block";
    elemCompress.style.visibility = "visible";

    let pages = document.querySelectorAll(".mgb-page2");
    pages.forEach(page => {
        page.classList.remove("mgb-page2");
        page.classList.add("mgb-page");
    });
}

function compressImage() {
    let elemExpand = document.querySelector("#mgb-toolbar-expand");
    let elemCompress = document.querySelector("#mgb-toolbar-compress");

    setCookie("_mgb-toolbar-resize", "compress", 365);

    elemExpand.style.display = "inline-block";
    elemExpand.style.visibility = "visible";
    elemCompress.style.display = "none";
    elemCompress.style.visibility = "visible";

    let pages = document.querySelectorAll(".mgb-page");
    pages.forEach(page => {
        page.classList.remove("mgb-page");
        page.classList.add("mgb-page2");
    });

}

function showBackground() {
    let elemBackground = document.querySelector("#mgb-toolbar-popup-background");
    let elemBrightness = document.querySelector("#mgb-toolbar-popup-brightness");

    elemBrightness.style.display = "none";
    isShowToolbarBrightness = false;

    if (isShowToolbarBackground) {
        elemBackground.style.display = "none";
        isShowToolbarBackground = false;
        document.querySelector("#mgb-toolbar-background").classList.remove("mgb-toolbar-item-active");
    } else {
        elemBackground.style.display = "block";
        isShowToolbarBackground = true;
        document.querySelector("#mgb-toolbar-background").classList.add("mgb-toolbar-item-active");
        document.querySelector("#mgb-toolbar-brightness").classList.remove("mgb-toolbar-item-active");
    }
}

function showBrightness() {
    let elemBackground = document.querySelector("#mgb-toolbar-popup-background");
    let elemBrightness = document.querySelector("#mgb-toolbar-popup-brightness");

    elemBackground.style.display = "none";
    isShowToolbarBackground = false;

    if (isShowToolbarBrightness) {
        elemBrightness.style.display = "none";
        isShowToolbarBrightness = false;
        document.querySelector("#mgb-toolbar-brightness").classList.remove("mgb-toolbar-item-active");
    } else {
        elemBrightness.style.display = "block";
        isShowToolbarBrightness = true;
        document.querySelector("#mgb-toolbar-background").classList.remove("mgb-toolbar-item-active");
        document.querySelector("#mgb-toolbar-brightness").classList.add("mgb-toolbar-item-active");

    }
}

function changeBrightness(value) {
    // console.log(evt.value);
    brightnessValue = value;

    setCookie("_mgb-toolbar-brightness", brightnessValue, 365);

    let pages = document.querySelectorAll(".mgb-page");
    pages.forEach(page => {
        page.style.filter = "brightness(" + brightnessValue + "%)";
    });

    pages = document.querySelectorAll(".mgb-page2");
    pages.forEach(page => {
        page.style.filter = "brightness(" + brightnessValue + "%)";
    });
}

function setDefaultBrightness() {
    brightnessValue = 100;

    setCookie("_mgb-toolbar-brightness", brightnessValue, 365);

    let ranger = document.querySelector("#mgb-toolbar-brightness-ranger");
    ranger.value = brightnessValue;

    let pages = document.querySelectorAll(".mgb-page");
    pages.forEach(page => {
        page.style.filter = "brightness(" + brightnessValue + "%)";
    });

    pages = document.querySelectorAll(".mgb-page2");
    pages.forEach(page => {
        page.style.filter = "brightness(" + brightnessValue + "%)";
    });
}

function changeBackground(value) {
    console.log("cb");
    let elem = document.querySelector("#mgb-content");
    let elemBt1 = document.querySelector("#mgb-toolbar-bt1");
    let elemBt2 = document.querySelector("#mgb-toolbar-bt2");
    let elemBt3 = document.querySelector("#mgb-toolbar-bt3");
    let elemBt4 = document.querySelector("#mgb-toolbar-bt4");


    if (value == 1) {
        elem.classList.add("mgb-chapter-toolbar-background-item-color1");
        elem.classList.remove("mgb-chapter-toolbar-background-item-color2");
        elem.classList.remove("mgb-chapter-toolbar-background-item-color3");
        elem.classList.remove("mgb-chapter-toolbar-background-item-color4");
        setCookie("_mgb-toolbar-background", 1, 365);

        elemBt1.checked = true;
        elemBt2.checked = false;
        elemBt3.checked = false;
        elemBt4.checked = false;
    } else if (value == 2) {
        elem.classList.remove("mgb-chapter-toolbar-background-item-color1");
        elem.classList.add("mgb-chapter-toolbar-background-item-color2");
        elem.classList.remove("mgb-chapter-toolbar-background-item-color3");
        elem.classList.remove("mgb-chapter-toolbar-background-item-color4");
        setCookie("_mgb-toolbar-background", 2, 365);

        elemBt1.checked = false;
        elemBt2.checked = true;
        elemBt3.checked = false;
        elemBt4.checked = false;
    } else if (value == 3) {
        elem.classList.remove("mgb-chapter-toolbar-background-item-color1");
        elem.classList.remove("mgb-chapter-toolbar-background-item-color2");
        elem.classList.add("mgb-chapter-toolbar-background-item-color3");
        elem.classList.remove("mgb-chapter-toolbar-background-item-color4");
        setCookie("_mgb-toolbar-background", 3, 365);

        elemBt1.checked = false;
        elemBt2.checked = false;
        elemBt3.checked = true;
        elemBt4.checked = false;
    } else if (value == 4) {
        elem.classList.remove("mgb-chapter-toolbar-background-item-color1");
        elem.classList.remove("mgb-chapter-toolbar-background-item-color2");
        elem.classList.remove("mgb-chapter-toolbar-background-item-color3");
        elem.classList.add("mgb-chapter-toolbar-background-item-color4");
        setCookie("_mgb-toolbar-background", 4, 365);

        elemBt1.checked = false;
        elemBt2.checked = false;
        elemBt3.checked = false;
        elemBt4.checked = true;
    }
}


// Sticky header & go to top button

window.onscroll = function () {
    makeSticky();
    scrollFunction();

};

// Add the sticky class to the header when you reach its scroll position. Remove "sticky" when you leave the scroll position
function makeSticky() {
    // Get the offset position of the navbar
    let header = document.getElementById("mgb-header-desktop-main-menu-container");

    let sticky = header.offsetTop;

    if (window.pageYOffset > sticky) {
        header.classList.add("sticky-header");
    } else {
        header.classList.remove("sticky-header");
    }

    // Get the offset position of the navbar
    let headerChapter = document.getElementById("mgb-header-chapter");
    let headerChapterAnchor = document.getElementById("mgb-chapter-select");

    if (headerChapter != null && headerChapterAnchor != null) {
        let sticky2 = headerChapterAnchor.offsetTop;

        if (window.pageYOffset > sticky2) {
            headerChapter.classList.add("sticky-header");
            headerChapter.style.display = "inline-flex";
        } else {
            headerChapter.classList.remove("sticky-header");
            headerChapter.style.display = "none";
        }
    }

}

// //Go to top

function scrollFunction() {
    let mybutton = document.getElementById("mgb-go-top-btn");
    if (document.body.scrollTop > 700 || document.documentElement.scrollTop > 700) {
        mybutton.style.display = "block";
    } else {
        mybutton.style.display = "none";
    }
}

function goTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

//Story detail - expand chapters

function expandChapters() {
    let elem = document.querySelector("#mgb-story-chapters");
    let elemExpand = document.querySelector("#fff");

    console.log(elem.children.length);

    for (let i = 0; i < elem.children.length; i++) {
        let chap = elem.children.item(i);
        chap.style.display = "flex";
        // console.log();
    }

    elemExpand.style.display = "none";

}

//Story detail - like, bookmark button

function changeLike() {
    let elem = document.querySelector("#mgb-story-id");

    let path = "/ajax/account/story/" + elem.getAttribute("value") + "/like";
    let url = buildPath(path, new Map([]));

    // let accountToken = getCookie("accountToken");

    makeRequest(url, "PATCH", new Map([]), null, onResultLikeSuccess, onResultLikeFail);
}

function onResultLikeSuccess(result) {
    let elem = document.querySelector("#mgb-story-like-box")
    let elem2 = document.querySelector("#mgb-story-like-btn")
    let elem3 = document.querySelector("#mgb-story-unlike-btn")
    let elem4 = document.querySelector("#mgn-story-like-title")

    if (result.statusCode == 200) {
        if (result.data.account.likeStoryStatus.status == 0) {
            //Result is unlike

            elem.classList.remove("mgb-story-interact-box-active");
            elem2.style.display = "none";
            elem3.style.display = "inline-block";

            // let numStr = elem4.innerHTML.replace(".", "").replace(",", "");
            // let num = parseInt(numStr, 10) - 1;
            // elem4.innerHTML = num.toLocaleString("vi-VN");
        } else {
            //Result is like

            elem.classList.add("mgb-story-interact-box-active");
            elem2.style.display = "inline-block";
            elem3.style.display = "none"

            // let numStr = elem4.innerHTML.replace(".", "").replace(",", "");
            // let num = parseInt(numStr, 10) + 1;
            // elem4.innerHTML = num.toLocaleString("vi-VN");
        }
    } else if (result.statusCode == 400) {
        //Invalid account
        // alert("Đăng nhập để thực hiện");

        let elem = tippy(document.querySelector("#mgb-story-like-box"), {
            content: "Đăng nhập để thực hiện",
            trigger: 'manual',
            duration: [300, 250],
            delay: 100,
            hideOnClick: false,
            onShow(instance) {
                setTimeout(() => {
                    instance.hide();
                }, 1000);
            }
        });
        elem.show();
    } else {
        //Invalid story
    }
}

function onResultLikeFail(result) {

}

function changeBookmark() {
    let elem = document.querySelector("#mgb-story-id");
    let path = "/ajax/account/story/" + elem.getAttribute("value") + "/bookmark";
    let url = buildPath(path, new Map([]));

    makeRequest(url, "PATCH", new Map([]), null, onResultBookmarkSuccess, onResultBookmarkFail);
}

function onResultBookmarkSuccess(result) {
    let elem = document.querySelector("#mgb-story-bookmark-box")
    let elem2 = document.querySelector("#mgb-story-bookmark-btn")
    let elem3 = document.querySelector("#mgb-story-unbookmark-btn")
    let elem4 = document.querySelector("#mgn-story-bookmark-title")

    if (result.statusCode == 200) {
        if (result.data.account.bookmarkStoryStatus.status == 0) {
            //Result is unbookmarked

            elem.classList.remove("mgb-story-interact-box-active");
            elem2.style.display = "none";
            elem3.style.display = "inline-block";

            // let numStr = elem4.innerHTML.replace(".", "").replace(",", "");
            // let num = parseInt(numStr, 10) - 1;
            // elem4.innerHTML = num.toLocaleString("vi-VN");
        } else {
            //Result is bookmarked

            elem.classList.add("mgb-story-interact-box-active");
            elem2.style.display = "inline-block";
            elem3.style.display = "none"
            //
            // let numStr = elem4.innerHTML.replace(".", "").replace(",", "");
            // let num = parseInt(numStr, 10) + 1;
            // elem4.innerHTML = num.toLocaleString("vi-VN");
        }
    } else if (result.statusCode == 400) {
        //Invalid account
        // alert("Đăng nhập để thực hiện");
        let elem = tippy(document.querySelector("#mgb-story-bookmark-box"), {
            content: "Đăng nhập để thực hiện",
            trigger: 'manual',
            duration: [300, 250],
            delay: 100,
            hideOnClick: false,
            onShow(instance) {
                setTimeout(() => {
                    instance.hide();
                }, 1000);
            }
        });
        elem.show();
    } else {
        //Invalid story
    }
}

function onResultBookmarkFail(result) {

}


//User - comment
let comments = [];
let commentPagination = {};

function initUserCommentData() {
    callUserComments(0, defaultItemperPage);
}

function changeItemPerPageUserComment(evt) {
    console.log(evt.value);
    commentPagination.itemPerPage = evt.value;

    callUserComments(0, commentPagination.itemPerPage);
}

function onResultCommentSuccess(result) {
    console.log(result);
    comments = parseComments(result.data.comments);
    commentPagination = parsePagination(result.data);
    console.log(comments);
    buildUserCommentUi();
}

function onResultCommentFail(result) {
    console.log(result);

}

function buildUserCommentUi() {
    let commentCardTemplate = document.querySelector("#userCommentCardTemplate");

    if (comments.length == 0) {
        //Set no data screen
        let elem = document.querySelector("#mgbUserCommentNodata");
        let elem2 = document.querySelector("#mgbUserCommentContent");
        let elem3 = document.querySelector("#mgbUserCommentSelect");
        elem.style.display = "flex";
        elem2.style.display = "none";
        elem3.disabled = true;

        let paginationContainer = document.querySelector("#paginationContainer");
        paginationContainer.innerHTML = "";
    } else {
        let elem = document.querySelector("#mgbUserCommentNodata");
        let elem2 = document.querySelector("#mgbUserCommentContent");
        let elem3 = document.querySelector("#mgbUserCommentSelect");
        elem.style.display = "none";
        elem2.style.display = "block";
        elem3.disabled = false;

        //Build content
        let content = document.querySelector("#mgbUserCommentContent");

        content.innerHTML = "";
        comments.forEach(item => {
            let row = commentCardTemplate.content.cloneNode(true);
            row.querySelector("#tplImage").setAttribute("data-src", item.story.logoUrl);
            row.querySelector("#tplImageLink").setAttribute("href", item.story.url);
            row.querySelector("#tplStoryTitle").innerHTML = item.story.name;
            row.querySelector("#tplStoryTitle").setAttribute("href", item.story.url);
            row.querySelector("#tplChapterTitle").innerHTML = item.story.chapters[0].name;
            row.querySelector("#tplChapterTitle").setAttribute("href", item.story.chapters[0].url);
            row.querySelector("#tplDelete").setAttribute("data-id", item.id);
            row.querySelector("#tplContent").innerHTML = decodeURIComponent(fromBinary(item.content));
            row.querySelector("#tplDate").innerHTML = item.friendlyTimestamp;

            // console.log()
            content.appendChild(row);
        });
        // console.log(historyStories.length)

        let paginationContainer = document.querySelector("#paginationContainer");
        buildPagination(paginationContainer, commentPagination, comments, changePageUserComment);

        lazyLoadInstance.update();
    }
}

function changePageUserComment(evt) {
    let pageChanged = evt.currentTarget.getAttribute("value");
    console.log("page changed: " + pageChanged);
    commentPagination.page = pageChanged;
    callUserComments(pageChanged, commentPagination.itemPerPage);
}

function callUserComments(page, itemPerPage) {
    let path = "/ajax/account/profile/comment";
    let url = buildPath(path, new Map([
        ["page", page],
        ["itemPerPage", itemPerPage],
    ]));

    makeRequest(url, "GET", new Map([]), null, onResultCommentSuccess, onResultCommentFail);
}

function deleteUserComment(evt) {
    $.confirm({
        title: 'Xóa',
        content: 'Bạn muốn xóa comment này.',
        buttons: {
            OK: function () {
                // $.alert('Confirmed!');
                console.log(evt.getAttribute("data-id"));
                let commentId = evt.getAttribute("data-id");
                let path = "/ajax/account/profile/comment/" + commentId;
                let url = buildPath(path, new Map([]));

                makeRequest(url, "DELETE", new Map([]), null, onDeleteCommentSuccess, onDeleteCommentFail);
            },
            Cancel: function () {

            },

        }
    });

}

function onDeleteCommentSuccess(result) {
    let status = result.statusCode;
    if (status == 200) {
        //Reload page
        callUserComments(commentPagination.page, commentPagination.itemPerPage);
    } else if (status == 400) {
        alert("Đăng nhập để thực hiện.");
    } else if (status == 401) {
        alert("Comment đã bị xóa.");
    }
}

function onDeleteCommentFail() {

}


//Email & Linked facebook, google

function unLinkFacebook() {
    let path = "/ajax/account/facebook/verify";
    let url = buildPath(path, new Map([]));

    makeRequest(url, "GET", new Map([]), null, function (result) {
        let elem = document.querySelector("#mgb-user-email-fb-linked")
        let elem2 = document.querySelector("#mgb-user-email-fb-unlinked")
        console.log(result.data.account);
        if (result.data.hasOwnProperty("account")) {
            console.log(result.data.account);
            if (result.data.account.facebookLinked) {
                let path = "/ajax/account/facebook/unlink";
                let url = buildPath(path, new Map([]));
                makeRequest(url, "PATCH", new Map([]), null, function (result) {
                    console.log(result);
                    if (result.statusCode == 200) {
                        elem.style.display = "none";
                        elem2.style.display = "inline-block";
                    } else {
                        // alert("Can not unlink fb");
                        let alert = tippy(elem, {
                            content: "Không có phương thức đăng nhập nào khi unlink tài khoản facebook này. Vui lòng nhập email ở ô bên trên để thực hiện.",
                            trigger: 'manual',
                            duration: [300, 250],
                            delay: 100,
                            hideOnClick: false,
                            onShow(instance) {
                                setTimeout(() => {
                                    instance.hide();
                                }, 2000);
                            }
                        });
                        alert.show();
                    }
                }, function (result) {
                });
            } else {
                elem.style.display = "none";
                elem2.style.display = "inline-block";
            }
        } else {
            alert("Vui lòng đăng nhập để thực hiện tính năng này");
        }
    }, function (result) {
    });
}

function linkFacebook() {
    let path = "/ajax/account/facebook/verify";
    let url = buildPath(path, new Map([]));

    makeRequest(url, "GET", new Map([]), null, function (result) {
            let elem = document.querySelector("#mgb-user-email-fb-linked")
            let elem2 = document.querySelector("#mgb-user-email-fb-unlinked")
            console.log(result.data.account);
            if (result.data.hasOwnProperty("account")) {
                console.log(result.data.account);
                if (result.data.account.facebookLinked) {
                    elem.style.display = "inline-block";
                    elem2.style.display = "none";
                } else {
                    FB.login(function (response) {
                        if (response.status === 'connected') {
                            console.log('Welcome!  Fetching your information.... ');
                            console.log(response.authResponse.accessToken);
                            // FB.api('/me?fields=id,name,email,picture', function(response) {
                            //     console.log(response);
                            // });

                            // document.getElementById("mgb-continue-fb-id").value = response.authResponse.userID;
                            // document.getElementById("mgb-continue-fb-access-token").value = response.authResponse.accessToken;
                            // document.getElementById("mgb-login-form").submit();

                            let path = "/ajax/account/facebook/link";
                            let url = buildPath(path, new Map([
                                ["fbAccessToken", response.authResponse.accessToken]]));
                            makeRequest(url, "PATCH", new Map([]), null, function (result) {
                                console.log(result);
                                switch (result.statusCode) {
                                    case 200:
                                        elem.style.display = "inline-block";
                                        elem2.style.display = "none";
                                        break;
                                    case 400:
                                        alert("Vui lòng đăng nhập để thực hiện tính năng này.");
                                        break;
                                    case 401:
                                        alert("Tài khoản hiện tại đã liên kết với fb account.");
                                        // elem.style.display = "inline-block";
                                        // elem2.style.display = "none";
                                        break;
                                    case 402:
                                        alert("Fb token quá hạn.");
                                        break;
                                    case 403:
                                        // alert("Tài khoản facebook này đã liên kết với tài khoản khác.");
                                        let alert = tippy(elem2, {
                                            content: "Tài khoản facebook này đã liên kết với tài khoản khác.",
                                            trigger: 'manual',
                                            duration: [300, 250],
                                            delay: 100,
                                            hideOnClick: false,
                                            onShow(instance) {
                                                setTimeout(() => {
                                                    instance.hide();
                                                }, 1000);
                                            }
                                        });
                                        alert.show();
                                        break;
                                }

                            }, function (err) {
                                console.log(err)
                            });
                        } else {
                            console.log('User cancelled login or did not fully authorize.');
                        }
                    }, {scope: 'public_profile,email'});
                }
            } else {
                alert("Vui lòng đăng nhập để thực hiện tính năng này");
            }
        }

        ,

        function (result) {
        }
    )
    ;
}

function unLinkGoogle() {
    let path = "/ajax/account/google/verify";
    let url = buildPath(path, new Map([]));

    makeRequest(url, "GET", new Map([]), null, function (result) {
        let elem = document.querySelector("#mgb-user-email-gg-linked")
        let elem2 = document.querySelector("#mgb-user-email-gg-unlinked")
        console.log(result.data.account);
        if (result.data.hasOwnProperty("account")) {
            console.log(result.data.account);
            if (result.data.account.googleLinked) {
                let path = "/ajax/account/google/unlink";
                let url = buildPath(path, new Map([]));
                makeRequest(url, "PATCH", new Map([]), null, function (result) {
                    console.log(result);
                    if (result.statusCode == 200) {
                        elem.style.display = "none";
                        elem2.style.display = "inline-block";
                    } else {
                        // alert("Can not unlink gg");
                        let alert = tippy(elem, {
                            content: "Không có phương thức đăng nhập nào khi unlink tài khoản google này. Vui lòng nhập email ở ô bên trên để thực hiện.",
                            trigger: 'manual',
                            duration: [300, 250],
                            delay: 100,
                            hideOnClick: false,
                            onShow(instance) {
                                setTimeout(() => {
                                    instance.hide();
                                }, 2000);
                            }
                        });
                        alert.show();
                    }
                }, function (result) {
                });
            } else {
                elem.style.display = "none";
                elem2.style.display = "inline-block";
            }
        } else {
            alert("Vui lòng đăng nhập để thực hiện tính năng này");
        }
    }, function (result) {
    });
}

let canRun = false;

function linkGoogle() {
    // auth2.signIn();
    let path = "/ajax/account/google/verify";
    let url = buildPath(path, new Map([]));

    makeRequest(url, "GET", new Map([]), null, function (result) {
        let elem = document.querySelector("#mgb-user-email-gg-linked")
        let elem2 = document.querySelector("#mgb-user-email-gg-unlinked")
        console.log(result.data.account);
        if (result.data.hasOwnProperty("account")) {
            console.log(result.data.account);
            if (result.data.account.googleLinked) {
                elem.style.display = "inline-block";
                elem2.style.display = "none";
            } else {
                console.log("Call gg popup");
                canRun = true;
                // auth2.currentUser.listen(linkGooglePostprocess);
                auth2.signIn();

            }
        } else {
            alert("Vui lòng đăng nhập để thực hiện tính năng này");
        }
    }, function (result) {
    });
}

function linkGooglePostprocess(googleUser) {
    if (canRun) {
        console.log('Signin state changed to ', googleUser);
        let authRes = googleUser.getAuthResponse();
        // let authOjb = JSON.parse(authRes)
        console.log(authRes);
        console.log(authRes.id_token);

        let path = "/ajax/account/google/link";
        let url = buildPath(path, new Map([
            ["ggIdToken", authRes.id_token]]));
        makeRequest(url, "PATCH", new Map([]), null, function (result) {
            let elem = document.querySelector("#mgb-user-email-gg-linked")
            let elem2 = document.querySelector("#mgb-user-email-gg-unlinked")
            console.log(result);
            switch (result.statusCode) {
                case 200:
                    elem.style.display = "inline-block";
                    elem2.style.display = "none";
                    break;
                case 400:
                    alert("Vui lòng đăng nhập để thực hiện tính năng này.");
                    break;
                case 401:
                    alert("Tài khoản hiện tại đã liên kết với gg account.");
                    // elem.style.display = "inline-block";
                    // elem2.style.display = "none";
                    break;
                case 402:
                    alert("Gg token quá hạn.");
                    break;
                case 403:
                    // alert("Tài khoản google này đã liên kết với tài khoản khác.");
                    let alert = tippy(elem2, {
                        content: "Tài khoản google này đã liên kết với tài khoản khác.",
                        trigger: 'manual',
                        duration: [300, 250],
                        delay: 100,
                        hideOnClick: false,
                        onShow(instance) {
                            setTimeout(() => {
                                instance.hide();
                            }, 1000);
                        }
                    });
                    alert.show();
                    break;
            }

        }, function (err) {
            console.log(err)
        });
    }
}

//

function submitChangePassword() {
    let elem = document.querySelector("#mgb-change-password-form");
    let elem2 = document.querySelector("#mgb-old-password");
    let elem3 = document.querySelector("#mgb-new-password");
    let elem4 = document.querySelector("#mgb-renew-password");

    if (elem2 != null) {
        if (elem2.value.length < 6) {
            let alert = tippy(elem2, {
                content: "Mật khẩu ít nhất 6 ký tự",
                trigger: 'manual',
                duration: [300, 250],
                delay: 100,
                hideOnClick: false,
                onShow(instance) {
                    setTimeout(() => {
                        instance.hide();
                    }, 1000);
                }
            });
            alert.show();
            return;
        }
    }

    if (elem3.value.length < 6) {
        let alert = tippy(elem3, {
            content: "Mật khẩu ít nhất 6 ký tự",
            trigger: 'manual',
            duration: [300, 250],
            delay: 100,
            hideOnClick: false,
            onShow(instance) {
                setTimeout(() => {
                    instance.hide();
                }, 1000);
            }
        });
        alert.show();
        return;
    }

    if (elem4.value.length < 6) {
        let alert = tippy(elem4, {
            content: "Mật khẩu ít nhất 6 ký tự",
            trigger: 'manual',
            duration: [300, 250],
            delay: 100,
            hideOnClick: false,
            onShow(instance) {
                setTimeout(() => {
                    instance.hide();
                }, 1000);
            }
        });
        alert.show();
        return;
    }

    elem.submit();

}

//Change email

function changeEmail() {
    let elem = document.querySelector("#mgb-user-change-email");
    let elemAlert = document.querySelector("#mgb-user-alert");
    let elemAlert2 = document.querySelector("#mgb-user-alert2");

    let path = "/ajax/account/email/change";
    let url = buildPath(path, new Map([
        ["email", elem.value]
    ]));

    console.log(url);

    makeRequest(url, "PATCH", new Map([]), null, function (result) {
        console.log(result)
        if (result.statusCode == 200) {
            //No verified
            elemAlert.style.display = "block";
            elemAlert2.style.display = "none";
        } else if (result.statusCode == 201) {
            //verified
            elemAlert.style.display = "none";
            elemAlert2.style.display = "block";
        } else if (result.statusCode == 400) {
            //invalid token
        } else if (result.statusCode == 401) {
            //invalid email format
            let alert = tippy(elem, {
                content: "Định dạng email chưa đúng.",
                trigger: 'manual',
                duration: [300, 250],
                delay: 100,
                hideOnClick: false,
                onShow(instance) {
                    setTimeout(() => {
                        instance.hide();
                    }, 1000);
                }
            });
            alert.show();
        } else if (result.statusCode == 402) {
            //email is in db
            let alert = tippy(elem, {
                content: "Email này đã tồn tại. Vui lòng dùng email khác.",
                trigger: 'manual',
                duration: [300, 250],
                delay: 100,
                hideOnClick: false,
                onShow(instance) {
                    setTimeout(() => {
                        instance.hide();
                    }, 1000);
                }
            });
            alert.show();
        }

    }, function (result) {
    });
}

//Story comments

let storyComments = [];
let storyCommentPagination = {};

function initStoryCommentsData() {
    let elem = document.querySelector("#mgb-editor-text");
    elem.addEventListener("paste", toPlainText);

    callStoryComments(0, 10);
}

function changeItemPerPageStoryComment(evt) {
    // console.log(evt.value);
    storyCommentPagination.itemPerPage = evt.value;

    callStoryComments(0, storyCommentPagination.itemPerPage);
}

function onResultStoryCommentSuccess(result) {
    // console.log(result);
    storyComments = parseComments(result.data.comments);
    storyCommentPagination = parsePagination(result.data);
    // console.log(comments);

    buildStoryCommentUi();
}

function onResultStoryCommentFail(result) {
    console.log(result);

}

function buildStoryCommentUi() {
    let storyCommentCardTemplate = document.querySelector("#storyCommentCardTemplate");
    let storySubCommentCardTemplate = document.querySelector("#storySubCommentCardTemplate");

    if (storyComments.length == 0) {
        let elem = document.querySelector("#mgbStoryCommentNodata");
        elem.style.display = "flex";
        let content = document.querySelector("#mgbStoryCommentContent");
        content.innerHTML = "";
        let paginationContainer = document.querySelector("#paginationContainer");
        paginationContainer.innerHTML = "";
    } else {
        let elem = document.querySelector("#mgbStoryCommentNodata");
        elem.style.display = "none";

        //Total chapters
        let totalChaps = 0;
        // storyComments.forEach(item => {
        //     totalChaps += item.subComments.length;
        // })
        totalChaps += storyCommentPagination.totalItems;

        document.querySelector("#mgb-total-chapters").innerHTML = totalChaps.toLocaleString("vi-Vn");

        // let elem = document.querySelector("#mgbUserHistoryNodata");
        // let elem2 = document.querySelector("#mgbUserHistoryBox");
        // let elem3 = document.querySelector("#mgbUserHistorySelect");
        // elem.style.display = "none";
        // elem2.style.display = "block";
        // elem3.disabled = false;
        //
        //Build content
        let content = document.querySelector("#mgbStoryCommentContent");
        content.innerHTML = "";
        storyComments.forEach((item, index) => {
            let row = storyCommentCardTemplate.content.cloneNode(true);
            row.querySelector("#tplUserName").innerHTML = item.commentator.name;
            row.querySelector("#tplChapterName").innerHTML = item.story.chapters[0].name;
            row.querySelector("#tplChapterName").setAttribute("href", item.story.chapters[0].url);
            row.querySelector("#tplContent").innerHTML = decodeURIComponent(fromBinary(item.content));
            row.querySelector("#tplImage").setAttribute("data-src", item.commentator.avatarUrl);
            row.querySelector(".mgb-comment-item-reply").setAttribute("data-id", index.toString());
            row.querySelector(".mgb-comment-item-date").innerHTML = item.friendlyTimestamp;

            let currentAcc = parseAccount(getCookie("accountToken"));
            if (currentAcc != null) {
                if (currentAcc.id == item.commentator.id) {
                    row.querySelector(".mgb-comment-item-delete").setAttribute("data-id", item.id);
                    row.querySelector(".mgb-comment-item-delete").style.display = "inline-block";
                }
            }

            //Build sub comments
            subCommentsContainer = row.querySelector("#tplSubComments");
            subCommentsContainer.innerHTML = "";
            item.subComments.forEach(cmt => {
                subCommentRow = storySubCommentCardTemplate.content.cloneNode(true);
                subCommentRow.querySelector("#tplUserName").innerHTML = cmt.commentator.name;
                subCommentRow.querySelector("#tplChapterName").innerHTML = cmt.story.chapters[0].name;
                subCommentRow.querySelector("#tplChapterName").setAttribute("href", cmt.story.chapters[0].url);
                subCommentRow.querySelector("#tplContent").innerHTML = decodeURIComponent(fromBinary(cmt.content));
                subCommentRow.querySelector("#tplImage").setAttribute("src", cmt.commentator.avatarUrl);
                subCommentRow.querySelector(".mgb-comment-item-date").innerHTML = cmt.friendlyTimestamp;

                let currentAcc = parseAccount(getCookie("accountToken"));
                if (currentAcc != null) {
                    if (currentAcc.id == cmt.commentator.id) {
                        subCommentRow.querySelector(".mgb-comment-item-delete").setAttribute("data-id", cmt.id);
                        subCommentRow.querySelector(".mgb-comment-item-delete").style.display = "inline-block";
                    }
                }

                subCommentsContainer.appendChild(subCommentRow);
            });


            content.appendChild(row);
        });
        // console.log(historyStories.length)

        let paginationContainer = document.querySelector("#paginationContainer");
        buildPagination(paginationContainer, storyCommentPagination, storyComments, changePageStoryComment);

        lazyLoadInstance.update();
    }
}

function changePageStoryComment(evt) {
    let pageChanged = evt.currentTarget.getAttribute("value");
    console.log("page changed: " + pageChanged);
    storyCommentPagination.page = pageChanged;
    callStoryComments(pageChanged, storyCommentPagination.itemPerPage);
}

function callStoryComments(page, itemPerPage) {
    let elem = document.querySelector("#mgb-story-id");
    let path = "/ajax/comment/story/" + elem.getAttribute("value");
    let url = buildPath(path, new Map([
        ["page", page],
        ["itemPerPage", itemPerPage],
    ]));

    console.log(url);

    makeRequest(url, "GET", new Map([]), null, onResultStoryCommentSuccess, onResultStoryCommentFail);
}

function onDeleteStoryCommentSuccess(result) {
    let status = result.statusCode;
    if (status == 200) {
        //Reload page
        callStoryComments(storyCommentPagination.page, storyCommentPagination.itemPerPage);
    } else if (status == 400) {
        alert("Đăng nhập để thực hiện.");
    } else if (status == 401) {
        alert("Comment đã bị xóa.");
    }
}

function onDeleteStoryCommentFail() {

}

function replyComment(evt) {
    let path = "/ajax/account/verify";
    let url = buildPath(path, new Map([]));

    makeRequest(url, "GET", new Map([]), null, function (result) {
        if (result.statusCode == 200) {
            let editorTemplate = document.querySelector("#editorTemplate");

            let cmtIndex = evt.getAttribute("data-id");
            let commentContainer = document.querySelector("#mgbStoryCommentContent");
            let currentComment = commentContainer.querySelectorAll(".mgb-comment-container")[cmtIndex];
            let editorContainer = currentComment.querySelector(".mgb-editor-container");

            if (editorContainer.querySelector(".mgb-editor-box") == null) {
                let editor = editorTemplate.content.cloneNode(true);
                editor.querySelector(".mgb-editor-submit").setAttribute("data-id", cmtIndex);
                editor.querySelector(".mgb-editor-text").addEventListener("paste", toPlainText);

                editorContainer.appendChild(editor);
            }

        } else {
            let elem = tippy(evt, {
                content: "Vui lòng đăng nhập để bình luận.",
                trigger: 'manual',
                duration: [300, 250],
                delay: 100,
                hideOnClick: false,
                onShow(instance) {
                    setTimeout(() => {
                        instance.hide();
                    }, 1000);
                }
            });
            elem.show();
        }
    }, function (result) {
        let elem = tippy(evt, {
            content: "Vui lòng kiểm tra lại kết nối mạng.",
            trigger: 'manual',
            duration: [300, 250],
            delay: 100,
            hideOnClick: false,
            onShow(instance) {
                setTimeout(() => {
                    instance.hide();
                }, 1000);
            }
        });
        elem.show();
    });
}

function submitComment(evt) {
    let path = "/ajax/account/verify";
    let url = buildPath(path, new Map([]));

    makeRequest(url, "GET", new Map([]), null, function (result) {
        if (result.statusCode == 200) {
            let cmtIndex = evt.getAttribute("data-id");
            let commentContainer = document.querySelector("#mgbStoryCommentContent");
            let currentComment = commentContainer.querySelectorAll(".mgb-comment-container")[cmtIndex];
            let editorContainer = currentComment.querySelector(".mgb-editor-container");

            let commentText = editorContainer.querySelector(".mgb-editor-text").innerHTML;
            // // console.log();
            // let newComment = new Comment("", commentText, 0, 0,
            //     null, new Account("", "ds", "", ""), null);
            // storyComments[cmtIndex].subComments.splice(0, 0, newComment);
            //
            // buildStoryCommentUi();


            let path = "/ajax/account/profile/comment";
            let url = buildPath(path, new Map([
                ["chapterId", storyComments[cmtIndex].story.chapters[0].id],
                // ["commentText", toBinary(encodeURIComponent(commentText))],
                ["parentCommentId", storyComments[cmtIndex].id]
            ]));

            let body = new FormData();
            body.append("commentText", toBinary(encodeURIComponent(commentText)));

            makeRequest(url, "POST", new Map([]), body, function (result) {
                if (result.statusCode == 200) {
                    callStoryComments(storyCommentPagination.page, storyCommentPagination.itemPerPage);
                } else if (result.statusCode == 400) {
                    let elem = tippy(evt, {
                        content: "Vui lòng đăng nhập để bình luận.",
                        trigger: 'manual',
                        duration: [300, 250],
                        delay: 100,
                        hideOnClick: false,
                        onShow(instance) {
                            setTimeout(() => {
                                instance.hide();
                            }, 1000);
                        }
                    });
                    elem.show();
                } else {
                    let elem = tippy(evt, {
                        content: "Tác vụ không hợp lệ.",
                        trigger: 'manual',
                        duration: [300, 250],
                        delay: 100,
                        hideOnClick: false,
                        onShow(instance) {
                            setTimeout(() => {
                                instance.hide();
                            }, 1000);
                        }
                    });
                    elem.show();
                }
            }, function (result) {
                let elem = tippy(evt, {
                    content: "Vui lòng kiểm tra lại kết nối mạng.",
                    trigger: 'manual',
                    duration: [300, 250],
                    delay: 100,
                    hideOnClick: false,
                    onShow(instance) {
                        setTimeout(() => {
                            instance.hide();
                        }, 1000);
                    }
                });
                elem.show();
            });


        } else {
            let elem = tippy(evt, {
                content: "Vui lòng đăng nhập để bình luận.",
                trigger: 'manual',
                duration: [300, 250],
                delay: 100,
                hideOnClick: false,
                onShow(instance) {
                    setTimeout(() => {
                        instance.hide();
                    }, 1000);
                }
            });
            elem.show();
        }
    }, function (result) {
        let elem = tippy(evt, {
            content: "Vui lòng kiểm tra lại kết nối mạng.",
            trigger: 'manual',
            duration: [300, 250],
            delay: 100,
            hideOnClick: false,
            onShow(instance) {
                setTimeout(() => {
                    instance.hide();
                }, 1000);
            }
        });
        elem.show();
    });
}

function submitRootComment(evt) {
    let path = "/ajax/account/profile/comment";
    let url = buildPath(path, new Map([
        ["chapterId", document.querySelector("#mgb-chapter-id").getAttribute("value")],
        // ["commentText", toBinary(encodeURIComponent(document.querySelector("#mgb-editor-text").innerHTML))]
    ]));

    let body = new FormData();
    body.append("commentText", toBinary(encodeURIComponent(document.querySelector("#mgb-editor-text").innerHTML)));

    makeRequest(url, "POST", new Map([]), body, function (result) {
        if (result.statusCode == 200) {
            let elem = document.querySelector("#mgb-editor-submit-container");
            elem.style.display = "none";

            let elem1 = document.querySelector("#mgb-editor-text");
            elem1.innerHTML = "";

            storyCommentPagination.page = 0;
            callStoryComments(0, storyCommentPagination.itemPerPage);
        } else if (result.statusCode == 400) {
            let elem = tippy(evt, {
                content: "Vui lòng đăng nhập để bình luận.",
                trigger: 'manual',
                duration: [300, 250],
                delay: 100,
                hideOnClick: false,
                onShow(instance) {
                    setTimeout(() => {
                        instance.hide();
                    }, 1000);
                }
            });
            elem.show();
        } else {
            let elem = tippy(evt, {
                content: "Tác vụ không hợp lệ.",
                trigger: 'manual',
                duration: [300, 250],
                delay: 100,
                hideOnClick: false,
                onShow(instance) {
                    setTimeout(() => {
                        instance.hide();
                    }, 1000);
                }
            });
            elem.show();
        }
    }, function (result) {
        let elem = tippy(evt, {
            content: "Vui lòng kiểm tra lại kết nối mạng.",
            trigger: 'manual',
            duration: [300, 250],
            delay: 100,
            hideOnClick: false,
            onShow(instance) {
                setTimeout(() => {
                    instance.hide();
                }, 1000);
            }
        });
        elem.show();
    });

}

function deleteComment(evt) {
    $.confirm({
        title: 'Xóa',
        content: 'Bạn muốn xóa comment này.',
        buttons: {
            OK: function () {
                let commentId = evt.getAttribute("data-id");
                let path = "/ajax/account/profile/comment/" + commentId;
                let url = buildPath(path, new Map([]));

                makeRequest(url, "DELETE", new Map([]), null, onDeleteStoryCommentSuccess, onDeleteStoryCommentFail);
            },
            Cancel: function () {
            },

        }
    });

}

function verifyCommentAction(evt) {
    evt.addEventListener("paste", toPlainText);

    let path = "/ajax/account/verify";
    let url = buildPath(path, new Map([]));

    makeRequest(url, "GET", new Map([]), null, function (result) {
        if (result.statusCode == 200) {
            let elem = document.querySelector("#mgb-editor-submit-container");
            elem.style.display = "block";
            evt.setAttribute("contenteditable", "true");
        } else {
            let elem = tippy(evt, {
                content: "Vui lòng đăng nhập để bình luận.",
                trigger: 'manual',
                duration: [300, 250],
                delay: 100,
                hideOnClick: false,
                onShow(instance) {
                    setTimeout(() => {
                        instance.hide();
                    }, 1000);
                }
            });
            elem.show();
        }
    }, function (result) {
        let elem = tippy(evt, {
            content: "Vui lòng kiểm tra lại kết nối mạng.",
            trigger: 'manual',
            duration: [300, 250],
            delay: 100,
            hideOnClick: false,
            onShow(instance) {
                setTimeout(() => {
                    instance.hide();
                }, 1000);
            }
        });
        elem.show();
    });
}


//Chapter comments

let chapterComments = [];
let chapterCommentPagination = {};

function initChapterCommentsData() {
    let elem = document.querySelector("#mgb-editor-text");
    elem.addEventListener("paste", toPlainText);

    callChapterComments(0, 10);
}

function changeItemPerPageChapterComment(evt) {
    // console.log(evt.value);
    chapterCommentPagination.itemPerPage = evt.value;

    callChapterComments(0, chapterCommentPagination.itemPerPage);
}

function onResultChapterCommentSuccess(result) {
    // console.log(result);
    chapterComments = parseComments(result.data.comments);
    chapterCommentPagination = parsePagination(result.data);
    // console.log(comments);

    buildChapterCommentUi();
}

function onResultChapterCommentFail(result) {
    console.log(result);

}

function buildChapterCommentUi() {
    let storyCommentCardTemplate = document.querySelector("#storyCommentCardTemplate");
    let storySubCommentCardTemplate = document.querySelector("#storySubCommentCardTemplate");

    if (chapterComments.length == 0) {
        let elem = document.querySelector("#mgbStoryCommentNodata");
        elem.style.display = "flex";
        let content = document.querySelector("#mgbStoryCommentContent");
        content.innerHTML = "";
        let paginationContainer = document.querySelector("#paginationContainer");
        paginationContainer.innerHTML = "";
    } else {
        let elem = document.querySelector("#mgbStoryCommentNodata");
        elem.style.display = "none";

        //Total chapters
        let totalChaps = 0;
        totalChaps += chapterCommentPagination.totalItems;
        document.querySelector("#mgb-total-chapters").innerHTML = totalChaps.toLocaleString("vi-Vn");

        //Build content
        let content = document.querySelector("#mgbStoryCommentContent");
        content.innerHTML = "";
        chapterComments.forEach((item, index) => {
            let row = storyCommentCardTemplate.content.cloneNode(true);
            row.querySelector("#tplUserName").innerHTML = item.commentator.name;
            row.querySelector("#tplChapterName").innerHTML = item.story.chapters[0].name;
            row.querySelector("#tplChapterName").setAttribute("href", item.story.chapters[0].url);
            row.querySelector("#tplContent").innerHTML = decodeURIComponent(fromBinary(item.content));
            row.querySelector("#tplImage").setAttribute("data-src", item.commentator.avatarUrl);
            row.querySelector(".mgb-comment-item-reply").setAttribute("data-id", index.toString());
            row.querySelector(".mgb-comment-item-date").innerHTML = item.friendlyTimestamp;

            let currentAcc = parseAccount(getCookie("accountToken"));
            if (currentAcc != null) {
                if (currentAcc.id == item.commentator.id) {
                    row.querySelector(".mgb-comment-item-delete").setAttribute("data-id", item.id);
                    row.querySelector(".mgb-comment-item-delete").style.display = "inline-block";
                }
            }

            //Build sub comments
            subCommentsContainer = row.querySelector("#tplSubComments");
            subCommentsContainer.innerHTML = "";
            item.subComments.forEach(cmt => {
                subCommentRow = storySubCommentCardTemplate.content.cloneNode(true);
                subCommentRow.querySelector("#tplUserName").innerHTML = cmt.commentator.name;
                subCommentRow.querySelector("#tplChapterName").innerHTML = cmt.story.chapters[0].name;
                subCommentRow.querySelector("#tplChapterName").setAttribute("href", cmt.story.chapters[0].url);
                subCommentRow.querySelector("#tplContent").innerHTML = decodeURIComponent(fromBinary(cmt.content));
                subCommentRow.querySelector("#tplImage").setAttribute("src", cmt.commentator.avatarUrl);
                subCommentRow.querySelector(".mgb-comment-item-date").innerHTML = cmt.friendlyTimestamp;

                let currentAcc = parseAccount(getCookie("accountToken"));
                if (currentAcc != null) {
                    if (currentAcc.id == cmt.commentator.id) {
                        subCommentRow.querySelector(".mgb-comment-item-delete").setAttribute("data-id", cmt.id);
                        subCommentRow.querySelector(".mgb-comment-item-delete").style.display = "inline-block";
                    }
                }

                subCommentsContainer.appendChild(subCommentRow);
            });


            content.appendChild(row);
        });
        // console.log(historyStories.length)

        let paginationContainer = document.querySelector("#paginationContainer");
        buildPagination(paginationContainer, chapterCommentPagination, chapterComments, changePageChapterComment);

        lazyLoadInstance.update();
    }
}

function changePageChapterComment(evt) {
    let pageChanged = evt.currentTarget.getAttribute("value");
    console.log("page changed: " + pageChanged);
    chapterCommentPagination.page = pageChanged;
    callChapterComments(pageChanged, chapterCommentPagination.itemPerPage);
}

function callChapterComments(page, itemPerPage) {
    let elem = document.querySelector("#mgb-chapter-id");
    let path = "/ajax/comment/chapter/" + elem.getAttribute("value");
    let url = buildPath(path, new Map([
        ["page", page],
        ["itemPerPage", itemPerPage],
    ]));

    console.log(url);

    makeRequest(url, "GET", new Map([]), null, onResultChapterCommentSuccess, onResultChapterCommentFail);
}

function onDeleteChapterCommentSuccess(result) {
    let status = result.statusCode;
    if (status == 200) {
        //Reload page
        callChapterComments(chapterCommentPagination.page, chapterCommentPagination.itemPerPage);
    } else if (status == 400) {
        alert("Đăng nhập để thực hiện.");
    } else if (status == 401) {
        alert("Comment đã bị xóa.");
    }
}

function onDeleteChapterCommentFail() {

}

function replyComment2(evt) {
    let path = "/ajax/account/verify";
    let url = buildPath(path, new Map([]));

    makeRequest(url, "GET", new Map([]), null, function (result) {
        if (result.statusCode == 200) {
            let editorTemplate = document.querySelector("#editorTemplate");

            let cmtIndex = evt.getAttribute("data-id");
            let commentContainer = document.querySelector("#mgbStoryCommentContent");
            let currentComment = commentContainer.querySelectorAll(".mgb-comment-container")[cmtIndex];
            let editorContainer = currentComment.querySelector(".mgb-editor-container");

            if (editorContainer.querySelector(".mgb-editor-box") == null) {
                let editor = editorTemplate.content.cloneNode(true);
                editor.querySelector(".mgb-editor-submit").setAttribute("data-id", cmtIndex);
                editor.querySelector(".mgb-editor-text").addEventListener("paste", toPlainText);

                editorContainer.appendChild(editor);
            }

        } else {
            let elem = tippy(evt, {
                content: "Vui lòng đăng nhập để bình luận.",
                trigger: 'manual',
                duration: [300, 250],
                delay: 100,
                hideOnClick: false,
                onShow(instance) {
                    setTimeout(() => {
                        instance.hide();
                    }, 1000);
                }
            });
            elem.show();
        }
    }, function (result) {
        let elem = tippy(evt, {
            content: "Vui lòng kiểm tra lại kết nối mạng.",
            trigger: 'manual',
            duration: [300, 250],
            delay: 100,
            hideOnClick: false,
            onShow(instance) {
                setTimeout(() => {
                    instance.hide();
                }, 1000);
            }
        });
        elem.show();
    });
}

function deleteComment2(evt) {
    $.confirm({
        title: 'Xóa',
        content: 'Bạn muốn xóa comment này.',
        buttons: {
            OK: function () {
                let commentId = evt.getAttribute("data-id");
                let path = "/ajax/account/profile/comment/" + commentId;
                let url = buildPath(path, new Map([]));

                makeRequest(url, "DELETE", new Map([]), null, onDeleteChapterCommentSuccess, onDeleteChapterCommentFail);
            },
            Cancel: function () {
            },

        }
    });

}

function submitComment2(evt) {
    let path = "/ajax/account/verify";
    let url = buildPath(path, new Map([]));

    makeRequest(url, "GET", new Map([]), null, function (result) {
        if (result.statusCode == 200) {
            let cmtIndex = evt.getAttribute("data-id");
            let commentContainer = document.querySelector("#mgbStoryCommentContent");
            let currentComment = commentContainer.querySelectorAll(".mgb-comment-container")[cmtIndex];
            let editorContainer = currentComment.querySelector(".mgb-editor-container");

            let commentText = editorContainer.querySelector(".mgb-editor-text").innerHTML;
            // // console.log();
            // let newComment = new Comment("", commentText, 0, 0,
            //     null, new Account("", "ds", "", ""), null);
            // storyComments[cmtIndex].subComments.splice(0, 0, newComment);
            //
            // buildStoryCommentUi();


            let path = "/ajax/account/profile/comment";
            let url = buildPath(path, new Map([
                ["chapterId", chapterComments[cmtIndex].story.chapters[0].id],
                // ["commentText", toBinary(encodeURIComponent(commentText))],
                ["parentCommentId", chapterComments[cmtIndex].id]
            ]));

            let body = new FormData();
            body.append("commentText", toBinary(encodeURIComponent(commentText)));

            makeRequest(url, "POST", new Map([]), body, function (result) {
                if (result.statusCode == 200) {
                    callChapterComments(chapterCommentPagination.page, chapterCommentPagination.itemPerPage);
                } else if (result.statusCode == 400) {
                    let elem = tippy(evt, {
                        content: "Vui lòng đăng nhập để bình luận.",
                        trigger: 'manual',
                        duration: [300, 250],
                        delay: 100,
                        hideOnClick: false,
                        onShow(instance) {
                            setTimeout(() => {
                                instance.hide();
                            }, 1000);
                        }
                    });
                    elem.show();
                } else {
                    let elem = tippy(evt, {
                        content: "Tác vụ không hợp lệ.",
                        trigger: 'manual',
                        duration: [300, 250],
                        delay: 100,
                        hideOnClick: false,
                        onShow(instance) {
                            setTimeout(() => {
                                instance.hide();
                            }, 1000);
                        }
                    });
                    elem.show();
                }
            }, function (result) {
                let elem = tippy(evt, {
                    content: "Vui lòng kiểm tra lại kết nối mạng.",
                    trigger: 'manual',
                    duration: [300, 250],
                    delay: 100,
                    hideOnClick: false,
                    onShow(instance) {
                        setTimeout(() => {
                            instance.hide();
                        }, 1000);
                    }
                });
                elem.show();
            });


        } else {
            let elem = tippy(evt, {
                content: "Vui lòng đăng nhập để bình luận.",
                trigger: 'manual',
                duration: [300, 250],
                delay: 100,
                hideOnClick: false,
                onShow(instance) {
                    setTimeout(() => {
                        instance.hide();
                    }, 1000);
                }
            });
            elem.show();
        }
    }, function (result) {
        let elem = tippy(evt, {
            content: "Vui lòng kiểm tra lại kết nối mạng.",
            trigger: 'manual',
            duration: [300, 250],
            delay: 100,
            hideOnClick: false,
            onShow(instance) {
                setTimeout(() => {
                    instance.hide();
                }, 1000);
            }
        });
        elem.show();
    });
}

function submitRootComment2(evt) {
    let path = "/ajax/account/profile/comment";
    let url = buildPath(path, new Map([
        ["chapterId", document.querySelector("#mgb-chapter-id").getAttribute("value")],
        // ["commentText", toBinary(encodeURIComponent(document.querySelector("#mgb-editor-text").innerHTML))]
    ]));

    let body = new FormData();
    body.append("commentText", toBinary(encodeURIComponent(document.querySelector("#mgb-editor-text").innerHTML)));

    makeRequest(url, "POST", new Map([]), body, function (result) {
        if (result.statusCode == 200) {
            let elem = document.querySelector("#mgb-editor-submit-container");
            elem.style.display = "none";

            let elem1 = document.querySelector("#mgb-editor-text");
            elem1.innerHTML = "";

            chapterCommentPagination.page = 0;
            callChapterComments(0, chapterCommentPagination.itemPerPage);
        } else if (result.statusCode == 400) {
            let elem = tippy(evt, {
                content: "Vui lòng đăng nhập để bình luận.",
                trigger: 'manual',
                duration: [300, 250],
                delay: 100,
                hideOnClick: false,
                onShow(instance) {
                    setTimeout(() => {
                        instance.hide();
                    }, 1000);
                }
            });
            elem.show();
        } else {
            let elem = tippy(evt, {
                content: "Tác vụ không hợp lệ.",
                trigger: 'manual',
                duration: [300, 250],
                delay: 100,
                hideOnClick: false,
                onShow(instance) {
                    setTimeout(() => {
                        instance.hide();
                    }, 1000);
                }
            });
            elem.show();
        }
    }, function (result) {
        let elem = tippy(evt, {
            content: "Vui lòng kiểm tra lại kết nối mạng.",
            trigger: 'manual',
            duration: [300, 250],
            delay: 100,
            hideOnClick: false,
            onShow(instance) {
                setTimeout(() => {
                    instance.hide();
                }, 1000);
            }
        });
        elem.show();
    });

}


//Search advanced

let isSearchAdvancedBoxOpen = true;
let maxSearchAdvancedPerPage = 30;
let searchAdvancedStories = []
let searchAdvancedPagination = {};

//Hold filter status in search advanced
let searchAdvancedGeneFilter = new Set();
let searchAdvancedStatusFilter = 0;
let searchAdvancedChapterFilter = 0;
let searchAdvancedRatedFilter = 0;
let searchAdvancedSorting = 0;


function changeGenreSearchAdvanced(evt) {
    // searchAdvancedChapterFilter = evt.value;
    if (evt.checked) {
        searchAdvancedGeneFilter.add(evt.value);
    } else {
        searchAdvancedGeneFilter.delete(evt.value);
    }
}

function changeStatusSearchAdvanced(evt) {
    searchAdvancedStatusFilter = evt.value;
}

function changeChapterSearchAdvanced(evt) {
    searchAdvancedChapterFilter = evt.value;

    document.querySelector("#mgb-sa-chapter-text").innerHTML = searchAdvancedChapterFilter;
}

function changeRatedSearchAdvanced(evt) {
    searchAdvancedRatedFilter = evt.value;
}

function changeSortingSearchAdvanced(evt) {
    searchAdvancedSorting = evt.value;
}


function toggleSearchAdvancedBox() {
    let elem = document.querySelector("#mgb-search-advanced-open");
    let elem2 = document.querySelector("#mgb-search-advanced-close");
    let elem3 = document.querySelector("#mgb-search-advanced-box-content");
    let elem4 = document.querySelector("#mgb-search-advanced-text");

    if (isSearchAdvancedBoxOpen) {
        isSearchAdvancedBoxOpen = false;
        elem.style.display = "inline-block";
        elem2.style.display = "none";
        elem3.style.display = "none";
        elem4.innerHTML = "Hiện khung tìm kiếm";
    } else {
        isSearchAdvancedBoxOpen = true;
        elem.style.display = "none";
        elem2.style.display = "inline-block";
        elem3.style.display = "block";
        elem4.innerHTML = "Ẩn khung tìm kiếm";
    }
}

function resetSearchAdvanced() {
    searchAdvancedGeneFilter = new Set();
    searchAdvancedStatusFilter = 0;
    searchAdvancedChapterFilter = 0;
    searchAdvancedRatedFilter = 0;
    searchAdvancedSorting = 0;

    //Reset form
    document.querySelector(".mgb-search-advanced-box")
        .querySelectorAll("input[type='checkbox'], input[type='radio']")
        .forEach(v => {
            v.checked = false;
        })

    document.querySelector("#mgb-sa-status").checked = true;
    document.querySelector("#mgb-sa-rated").checked = true;
    document.querySelector("#mgb-sa-sort").checked = true;
    document.querySelector("#mgb-sa-chapter").value = "0";
}

function searchAdvanced() {
    //Test
    console.log(Array.from(searchAdvancedGeneFilter).join(',') + " - " + searchAdvancedStatusFilter + " - " + searchAdvancedChapterFilter + " - " +
        searchAdvancedRatedFilter + " - " + searchAdvancedSorting);

    callSearchAdvancedStories(0, maxSearchAdvancedPerPage);
}

function changeItemPerPageSearchAdvanced(evt) {
    console.log(evt.value);
    searchAdvancedPagination.itemPerPage = evt.value;

    callSearchAdvancedStories(0, searchAdvancedPagination.itemPerPage);
}

function onResultSearchAdvancedSuccess(result) {
    console.log(result);
    searchAdvancedStories = parseStories(result.data.items);
    searchAdvancedPagination = parsePagination(result.data);

    buildSearchAdvancedUi();
}

function buildSearchAdvancedUi() {
    let storyCardTemplate = document.querySelector("#userStoryCardTemplate2");

    if (searchAdvancedStories.length == 0) {
        let elem = document.querySelector("#mgbSearchAdvancedTitle");
        let elem2 = document.querySelector("#mgbSearchAdvancedTitleNumber");

        // elem.style.display = "none";
        elem.style.display = "block";
        elem2.innerHTML = "0";

        let content = document.querySelector("#mgbSearchAdvancedContent");
        content.innerHTML = "";

        let paginationContainer = document.querySelector("#paginationContainer");
        paginationContainer.style.display = "none";
    } else {
        let elem = document.querySelector("#mgbSearchAdvancedTitle");
        let elem2 = document.querySelector("#mgbSearchAdvancedTitleNumber");

        // elem.style.display = "none";
        elem.style.display = "block";
        elem2.innerHTML = searchAdvancedPagination.totalItems.toLocaleString("vi-Vn");

        //Build content
        let content = document.querySelector("#mgbSearchAdvancedContent");
        content.innerHTML = "";
        console.log(searchAdvancedPagination.totalItems);


        searchAdvancedStories.forEach(item => {
            let row = storyCardTemplate.content.cloneNode(true);
            row.querySelector("#tplTitle").innerHTML = item.name;
            row.querySelector("#tplTitle").setAttribute("href", item.url);
            row.querySelector("#tplImage").setAttribute("data-src", item.logoUrl);
            row.querySelector("#tplImageLink").setAttribute("href", item.url);
            row.querySelector("#tplViews").innerHTML = item.totalViews.toLocaleString("vi-Vn");
            row.querySelector("#tplLikes").innerHTML = item.totalLikes.toLocaleString("vi-Vn");

            //Add chapters
            let chapContainer = row.querySelector("#tplChapters");
            item.chapters.forEach(item => {
                let chapRow = document.querySelector("#userChapterTemplate").content.cloneNode(true);
                chapRow.querySelector("#tplName").innerHTML = item.name;
                chapRow.querySelector("#tplName").setAttribute("href", item.url);
                chapRow.querySelector("#tplFriendlyTimestamp").innerHTML = item.friendlyTimestamp;

                chapContainer.appendChild(chapRow);
                // console.log(item.name);
            });


            content.appendChild(row);
        });
        // console.log(likeStories.length)

        let paginationContainer = document.querySelector("#paginationContainer");
        paginationContainer.style.display = "block";
        buildPagination(paginationContainer, searchAdvancedPagination, searchAdvancedStories, changePageSearchAdvanced);

        lazyLoadInstance.update();
    }
}

function onResultSearchAdvancedFail(data) {
    console.log(data);
}

function changePageSearchAdvanced(evt) {
    let pageChanged = evt.currentTarget.getAttribute("value");
    console.log("page changed: " + pageChanged);

    searchAdvancedPagination.page = pageChanged;
    callSearchAdvancedStories(pageChanged, searchAdvancedPagination.itemPerPage);
}

function callSearchAdvancedStories(page, itemPerPage) {
    let path = "/ajax/search/advanced";
    let url = buildPath(path, new Map([
        ["genres", Array.from(searchAdvancedGeneFilter).join(',')],
        ["status", searchAdvancedStatusFilter],
        ["chapter", searchAdvancedChapterFilter],
        ["rated", searchAdvancedRatedFilter],
        ["sorting", searchAdvancedSorting],
        ["page", page],
        ["itemPerPage", itemPerPage],
    ]));


    makeRequest(url, "GET", new Map([]), null,
        onResultSearchAdvancedSuccess, onResultSearchAdvancedFail);
}

//Recovery account

function recoveryAccount() {
    let elem = document.querySelector("#mgb-recovery-alert1");
    let elem2 = document.querySelector("#mgb-recovery-alert2");
    let elem3 = document.querySelector("#mgb-recovery-new-password");
    let elem4 = document.querySelector("#mgb-recovery-renew-password");
    let elem5 = document.querySelector("#mgb-recovery-box");
    let ticketId = document.querySelector("#mgb-recovery-ticket-id").value;

    if (elem3.value.length < 6) {
        let alert = tippy(elem3, {
            content: "Mật khẩu ít nhất 6 ký tự",
            trigger: 'manual',
            duration: [300, 250],
            delay: 100,
            hideOnClick: false,
            onShow(instance) {
                setTimeout(() => {
                    instance.hide();
                }, 1000);
            }
        });
        alert.show();
        return;
    }

    if (elem4.value.length < 6) {
        let alert = tippy(elem4, {
            content: "Mật khẩu ít nhất 6 ký tự",
            trigger: 'manual',
            duration: [300, 250],
            delay: 100,
            hideOnClick: false,
            onShow(instance) {
                setTimeout(() => {
                    instance.hide();
                }, 1000);
            }
        });
        alert.show();
        return;
    }

    if (elem3.value != elem4.value) {
        let alert = tippy(elem4, {
            content: "Mật khẩu nhập lại chưa khớp.",
            trigger: 'manual',
            duration: [300, 250],
            delay: 100,
            hideOnClick: false,
            onShow(instance) {
                setTimeout(() => {
                    instance.hide();
                }, 1000);
            }
        });
        alert.show();
        return;
    }


    let path = "/ajax/account/recovery/confirm";
    let url = buildPath(path, new Map([
        ["ticketId", ticketId],
        ["newPass", encodeURIComponent(elem3.value)],
        ["renewPass", encodeURIComponent(elem4.value),]
    ]));


    makeRequest(url, "POST", new Map([]), null,
        function (result) {
            console.log(result);
            if (result.statusCode == 200) {
                elem2.style.display = "block";
                elem5.style.display = "none";
            } else {
                elem.style.display = "block";
                elem2.style.display = "none";
                elem5.style.display = "block";
            }

        }, function (result) {

        });
}

function sendRecovery() {
    let elem = document.querySelector("#mgb-recovery-email");
    let elem2 = document.querySelector("#mgb-recovery-alert");
    let elem3 = document.querySelector("#mgb-recovery-alert-text");
    let elem4 = document.querySelector("#mgb-recovery-box");

    if (!validateEmail(elem.value)) {
        let alert = tippy(elem, {
            content: "Email chưa đúng định dạng.",
            trigger: 'manual',
            duration: [300, 250],
            delay: 100,
            hideOnClick: false,
            onShow(instance) {
                setTimeout(() => {
                    instance.hide();
                }, 1000);
            }
        });
        alert.show();
        return;
    }

    let path = "/ajax/account/recovery";
    let url = buildPath(path, new Map([
        ["email", elem.value],
    ]));

    makeRequest(url, "POST", new Map([]), null,
        function (result) {
            console.log(result);
            if (result.statusCode == 400) {
                let alert = tippy(elem, {
                    content: "Email chưa đúng định dạng.",
                    trigger: 'manual',
                    duration: [300, 250],
                    delay: 100,
                    hideOnClick: false,
                    onShow(instance) {
                        setTimeout(() => {
                            instance.hide();
                        }, 1000);
                    }
                });
                alert.show();
            } else {
                elem2.style.display = "block";
                elem3.innerHTML = elem.value;
                elem4.style.display = "none";
            }

        }, function (result) {

        });
}
